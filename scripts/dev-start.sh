#!/bin/bash

# MerkadAgency Development Startup Script

set -e

echo "🚀 Starting MerkadAgency Development Environment"
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm" >&2; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "⚠️  Warning: FFmpeg not found. Video rendering will fail." >&2; }

echo "✅ Prerequisites check passed"
echo ""

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
  echo "✅ .env created"
else
  echo "✅ .env exists"
fi
echo ""

# Start Docker services
echo "🐳 Starting Docker services (Postgres, Redis, MinIO)..."
docker-compose up -d
echo "✅ Docker services started"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be healthy..."
sleep 5
echo "✅ Services ready"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi
echo ""

# Initialize database
echo "🗄️  Initializing database..."
pnpm db:push
echo "✅ Database initialized"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm dev' to start all services"
echo "  2. Visit http://localhost:3000 to access the web UI"
echo "  3. API will be available at http://localhost:3001"
echo "  4. MinIO console at http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "Optional:"
echo "  - Run 'pnpm seed' to create sample project data"
echo "  - Run 'pnpm db:studio' to open Prisma Studio"
echo ""
