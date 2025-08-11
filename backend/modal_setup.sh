#!/bin/bash

# Modal Setup Script for Tenflow Backend
# This script helps set up Modal deployment for the Tenflow FastAPI backend

set -e

echo "🚀 Setting up Modal deployment for Tenflow Backend"

# Create Modal secrets if they don't exist
echo "📝 Setting up Modal secrets..."

# Check if .env.modal exists
if [[ ! -f ".env.modal" ]]; then
    echo "⚠️  .env.modal not found. Please create it from .env.modal.example"
    echo "   Copy .env.modal.example to .env.modal and fill in your production values"
    exit 1
fi

# Load environment variables from .env.modal
set -a
source .env.modal
set +a

# Create or update Modal secrets
echo "🔑 Creating Modal secrets..."
uv run modal secret create tenflow-secrets \
    POSTGRES_DATABASE="$POSTGRES_DATABASE" \
    POSTGRES_USER="$POSTGRES_USER" \
    POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    POSTGRES_HOST="$POSTGRES_HOST" \
    POSTGRES_PORT="$POSTGRES_PORT" \
    SECRET_KEY="$SECRET_KEY" \
    ALGORITHM="$ALGORITHM" \
    ACCESS_TOKEN_EXPIRE_MINUTES="$ACCESS_TOKEN_EXPIRE_MINUTES" \
    FRONTEND_URL="$FRONTEND_URL" \
    APP_NAME="$APP_NAME" \
    API_V1_STR="$API_V1_STR" \
    || echo "⚠️  Secrets might already exist. Use 'modal secret list' to check."

echo "✅ Modal secrets configured"