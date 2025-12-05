#!/bin/bash

# CRM Development Script
# Rebuilds frontend and starts both frontend and backend servers

set -e

PROJECT_DIR="/root/crm"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          CRM Development Server                   ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    pkill -f "node build" 2>/dev/null || true
    pkill -f "uvicorn main:app" 2>/dev/null || true
    echo -e "${GREEN}Servers stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Stop existing processes
echo -e "\n${YELLOW}[1/4] Stopping existing processes...${NC}"
pkill -f "node build" 2>/dev/null || true
pkill -f "uvicorn main:app" 2>/dev/null || true
sleep 1
echo -e "${GREEN}✓ Done${NC}"

# Rebuild frontend
echo -e "\n${YELLOW}[2/4] Rebuilding frontend...${NC}"
cd "$FRONTEND_DIR"
npm run build
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Start backend
echo -e "\n${YELLOW}[3/4] Starting backend server (port 8000)...${NC}"
cd "$BACKEND_DIR"
source сenv/bin/activate 2>/dev/null || source venv/bin/activate 2>/dev/null || true
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
sleep 3

# Check if backend started
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}✗ Failed to start backend${NC}"
    exit 1
fi

# Start frontend
echo -e "\n${YELLOW}[4/4] Starting frontend server (port 3000)...${NC}"
cd "$FRONTEND_DIR"
node build &
FRONTEND_PID=$!
sleep 2

# Check if frontend started
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}✗ Failed to start frontend${NC}"
    exit 1
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All servers running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Frontend: ${GREEN}http://127.0.0.1:3000${NC}"
echo -e "  Backend:  ${GREEN}http://127.0.0.1:8000${NC}"
echo -e "  API Docs: ${GREEN}http://127.0.0.1:8000/docs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Wait for background processes
wait

