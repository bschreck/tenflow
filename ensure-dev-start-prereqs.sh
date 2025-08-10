#!/bin/bash

echo "Ensuring docker is running..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Ensuring .env file exists..."
# Use docker.env if it exists, otherwise create it from example
if [ ! -f "docker.env" ] && [ -f "backend/env.example" ]; then
    echo "Creating docker.env file..."
    cp backend/env.example docker.env
    # Update DATABASE_URL for Docker
    sed -i.bak 's|localhost|postgres|g' docker.env
    rm docker.env.bak
fi
