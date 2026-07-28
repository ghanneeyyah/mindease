#!/bin/bash

echo "🚀 Starting MindEase Deployment..."

# Build frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Build Spring Boot
echo "📦 Building Spring Boot Backend..."
cd backend/chatbot
chmod +x mvnw
./mvnw clean package -DskipTests
cd ../..

# Build Docker images
echo "🐳 Building Docker Images..."
cd backend
docker-compose -f docker-compose.prod.yml build
cd ..

# Deploy
echo "🚀 Deploying..."
case "$1" in
  "railway")
    echo "Deploying to Railway..."
    cd frontend && railway up && cd ..
    cd backend/chatbot && railway up && cd ..
    cd backend/emotion-service && railway up && cd ..
    ;;
  "aws")
    echo "Deploying to AWS..."
    # AWS deployment commands
    ;;
  "local")
    echo "Deploying locally with Docker..."
    cd backend
    docker-compose up -d
    cd ..
    ;;
  *)
    echo "Usage: ./deploy.sh [railway|aws|local]"
    ;;
esac

echo "✅ Deployment complete!"