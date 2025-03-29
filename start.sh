#!/bin/bash

# Display banner
echo "=========================================="
echo "     Starting RazorKart Application       "
echo "=========================================="

# Kill any existing processes on ports 3000 and 5001
echo "Closing any existing servers..."
lsof -ti:3000,5001 | xargs kill -9 2>/dev/null || true

# Wait a moment to ensure ports are cleared
sleep 2

echo "Starting frontend and backend servers..."
echo "----------------------------------------"
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5001"
echo "----------------------------------------"

# Start backend first
echo "Starting backend server..."
cd server
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../client
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
