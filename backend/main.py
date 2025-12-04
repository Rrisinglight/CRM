from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.config import get_settings
from app.api import auth, tasks, clients, media, users, messages, files, analytics
from app.ws import board

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    os.makedirs(settings.upload_dir, exist_ok=True)
    yield
    # Shutdown


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# API routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

# WebSocket
app.include_router(board.router, prefix="/api/ws", tags=["websocket"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

