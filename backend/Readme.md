# Mental Health Chatbot - Microservices Architecture

## 🏗️ Architecture
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Frontend │────▶│ API Gateway │────▶│ Chatbot │
│ (React/HTML) │ │ (Port 8080) │ │ Service │
└─────────────────┘ └──────────────────┘ │ (Port 8081) │
└────────┬────────┘
│
▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Emotion │◀────│ Service-to- │ │ MySQL │
│ Detection │ │ Service Call │ │ Database │
│ (Python) │ │ │ │ (Port 3306) │
│ (Port 5000) │ └──────────────────┘ └─────────────────┘
└─────────────────┘


## 🚀 Quick Start

### Run with Docker Compose
```bash
docker-compose up --build"# mental-health-chatbot-backend" 
