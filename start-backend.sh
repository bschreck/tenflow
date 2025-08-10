#!/bin/bash

echo "Starting Tenflow Backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "Please update the .env file with your PostgreSQL credentials"
fi

# Create database if it doesn't exist
echo "Creating database if needed..."
python create_database.py

# Initialize database
echo "Initializing database..."
python init_db.py

# Start the server
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
