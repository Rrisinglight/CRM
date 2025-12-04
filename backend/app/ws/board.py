from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections for real-time board updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)
    
    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send message to specific client"""
        await websocket.send_json(message)


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/board")
async def websocket_board(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive messages from client (e.g., for typing indicators)
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await manager.send_personal(websocket, {"type": "pong"})
            
            # Broadcast other messages to all clients
            elif message.get("type") in ["typing", "cursor_move"]:
                await manager.broadcast(message)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)

