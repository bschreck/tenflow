#!/bin/bash

echo "Starting Tenflow Frontend..."

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting Vite development server..."
npm run dev
