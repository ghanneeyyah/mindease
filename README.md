# MindEase 🧠

### A Supportive Chatbot System for Student Stress Management

MindEase is an AI-powered student support chatbot designed to provide accessible, empathetic, and supportive conversations for university students experiencing academic stress and mild-to-moderate emotional difficulties.

The system combines **emotion detection**, **AI-generated conversational responses**, and **student wellbeing resources** to create a safe digital environment where students can express how they feel, receive supportive responses, and access simple coping and grounding techniques.

> **Important:** MindEase is an academic software project and is **not a replacement for a licensed mental health professional, therapist, counselor, or emergency service.** The system is designed to provide general emotional support and stress-management assistance.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Project Objectives](#-project-objectives)
* [Key Features](#-key-features)
* [How MindEase Works](#-how-mindease-works)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [AI Components](#-ai-components)
* [Application Flow](#-application-flow)
* [Application Pages](#-application-pages)
* [API Endpoints](#-api-endpoints)
* [Database](#-database)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Docker Setup](#-docker-setup)
* [Authentication](#-authentication)
* [Emotion Detection](#-emotion-detection)
* [Safety and Crisis Support](#-safety-and-crisis-support)
* [Design Approach](#-design-approach)
* [Theoretical Foundations](#-theoretical-foundations)
* [Testing](#-testing)
* [Limitations](#-limitations)
* [Future Improvements](#-future-improvements)
* [Disclaimer](#-disclaimer)
* [Author](#-author)

---

# 🌱 Overview

University students often experience significant academic and personal pressure. Coursework, examinations, deadlines, financial concerns, relationships, career uncertainty, and other challenges can affect students' emotional wellbeing.

MindEase was developed as a supportive chatbot system that gives students a simple way to express their thoughts and feelings through conversation.

Rather than attempting to diagnose or treat mental health conditions, MindEase focuses on:

* Providing supportive conversational responses
* Identifying emotions expressed in user messages
* Recognizing potentially high-risk conversations
* Providing basic stress-management and grounding techniques
* Giving students access to crisis-support information
* Maintaining a record of conversations and detected emotions
* Providing a simple and accessible user experience

The system combines conventional web application architecture with AI services to provide personalized conversational support.

---

# 🎯 Problem Statement

Many university students experience academic stress but may not always have immediate access to professional counseling or may feel uncomfortable seeking help in person.

Traditional support systems can also be limited by:

* Availability of counselors
* Appointment schedules
* Accessibility
* Cost
* Students' reluctance to openly discuss emotional difficulties
* Limited availability outside institutional working hours

MindEase explores how an AI-assisted conversational system can provide an additional, accessible layer of support for students while maintaining clear boundaries around what an automated system can safely provide.

---

# 🎯 Project Objectives

The main objectives of MindEase are to:

1. Develop an accessible chatbot for student stress management.
2. Detect emotions expressed in students' messages.
3. Generate supportive responses based on the user's emotional context.
4. Apply Cognitive Behavioural Therapy (CBT)-informed principles to conversational responses.
5. Provide basic grounding and relaxation exercises.
6. Identify potentially high-risk messages and provide appropriate safety guidance.
7. Store conversations and emotion information for the user's personal history.
8. Provide a simple and user-friendly interface for accessing the system.
9. Demonstrate how AI can be integrated into a full-stack software application.

---

# ✨ Key Features

## 💬 AI Supportive Chatbot

Students can communicate with MindEase using natural language.

The chatbot processes each message, identifies the likely emotion expressed, and generates a contextual response.

The goal is to make responses feel conversational, supportive, and human-like rather than simply returning predefined messages.

---

## 🧠 Emotion Detection

MindEase uses a pretrained transformer-based emotion classification model to analyze the emotional content of user messages.

The system uses:

**`j-hartmann/emotion-english-distilroberta-base`**

The model provides an emotion classification and confidence score.

Examples of emotions that may be detected include:

* Joy
* Sadness
* Anger
* Fear
* Disgust
* Surprise
* Neutral
* Gratitude
* Confusion
* Disapproval
* And other supported emotion categories

The detected emotion is then passed to the conversational component to provide additional context when generating a response.

---

## 🤖 AI-Generated Responses

MindEase uses the **Google Gemini API** to generate conversational responses.

The chatbot is designed to produce responses that are:

* Supportive
* Empathetic
* Context-aware
* Concise
* Non-judgmental
* Appropriate for student stress situations

The AI response generation is informed by the detected emotion and the user's message.

---

## 🔐 User Authentication

MindEase includes authentication using:

* User registration
* User login
* Password-based authentication
* JWT authentication
* Protected application routes

Authentication allows each student's conversations and associated data to remain connected to their account.

---

## 💾 Conversation Persistence

Chat sessions and messages are stored in MySQL.

This allows the system to maintain conversation history and associate messages with the appropriate user.

---

## 📊 Emotion Logging

Detected emotions are stored alongside conversation data.

This provides a record of emotional classifications generated during chatbot interactions and can be used by the application for wellbeing-related visualizations and analysis.

---

## 🧘 Grounding and Relaxation Exercises

MindEase includes simple guided exercises intended to help students manage immediate stress.

Examples include:

### 4-4-4-4 Breathing

A structured breathing exercise involving:

1. Inhale for 4 seconds
2. Hold for 4 seconds
3. Exhale for 4 seconds
4. Hold for 4 seconds

### 4-7-8 Breathing

A breathing technique involving:

1. Inhale for 4 seconds
2. Hold for 7 seconds
3. Exhale for 8 seconds

### 5-5-5 Grounding

A simple grounding exercise designed to redirect attention toward the present moment.

---

## 🚨 Crisis Support

MindEase contains a dedicated crisis-support section for situations where a user may require immediate human assistance.

The system can recognize potentially high-risk messages and provide a safer response directing the user toward appropriate emergency or professional support rather than attempting to handle a crisis entirely through AI-generated conversation.

---

## ❓ FAQ

The application includes an FAQ section containing information about the chatbot, its purpose, limitations, and how students can use the system.

---

# 🔄 How MindEase Works

The application follows a multi-service architecture.

At a high level:

```text
                    ┌─────────────────────┐
                    │      Student        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  User Interface     │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │ Authentication      │
                    │ Chat Sessions       │
                    │ Data Persistence     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌─────────────────┐    ┌──────────────────┐
          │     MySQL       │    │ Python AI Service│
          │                 │    │                  │
          │ Users           │    │ Emotion          │
          │ Sessions        │    │ Detection        │
          │ Messages        │    │ + Gemini         │
          │ Emotion Logs    │    │ Integration      │
          └─────────────────┘    └─────────┬────────┘
                                           │
                                  ┌────────┴────────┐
                                  ▼                 ▼
                         ┌────────────────┐  ┌──────────────┐
                         │ Hugging Face   │  │ Google Gemini│
                         │ Emotion Model  │  │ API          │
                         └────────────────┘  └──────────────┘
```

---

# 🏗️ System Architecture

MindEase consists of three main application services:

### 1. React Frontend

Responsible for:

* User interface
* Authentication screens
* Chat interface
* Navigation
* User interactions
* Grounding exercises
* Crisis resources
* FAQ
* Dashboard and settings

The frontend communicates with the Spring Boot backend through REST APIs.

---

### 2. Spring Boot Backend

The Spring Boot service acts as the primary backend API.

It is responsible for:

* User authentication
* JWT token management
* User accounts
* Chat sessions
* Message persistence
* Communication with the Python AI service
* Database interaction
* API request handling

The backend runs locally on:

```text
http://localhost:8081
```

---

### 3. Python Emotion Service

The Python service provides the AI-related processing layer.

It is responsible for:

* Receiving user messages
* Emotion classification
* Confidence-score generation
* Communication with the Gemini API
* Returning the detected emotion and generated response

The service is implemented using **FastAPI**.

It runs locally on:

```text
http://localhost:5000
```

A health-check endpoint is available at:

```text
GET /health
```

---

# 🛠️ Technology Stack

## Frontend

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| React                 | Frontend framework        |
| Vite                  | Development/build tooling |
| React Router          | Client-side routing       |
| Tailwind CSS          | Styling                   |
| JavaScript            | Application logic         |
| useState / useContext | State management          |

---

## Backend

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Java            | Backend programming language   |
| Spring Boot     | REST API and backend framework |
| Spring Security | Authentication/security        |
| JWT             | Stateless authentication       |
| Maven           | Dependency/build management    |

---

## AI Service

| Technology        | Purpose                            |
| ----------------- | ---------------------------------- |
| Python            | AI service                         |
| FastAPI           | AI service API                     |
| PyTorch           | Model execution                    |
| Hugging Face      | Emotion classification             |
| Google Gemini API | Conversational response generation |

---

## Database

| Technology             | Purpose                    |
| ---------------------- | -------------------------- |
| MySQL 8                | Relational database        |
| MySQL Docker container | Local database environment |

---

## DevOps / Tools

| Technology     | Purpose                     |
| -------------- | --------------------------- |
| Docker         | Containerization            |
| Docker Compose | Multi-service orchestration |
| Git            | Version control             |
| GitHub         | Source code hosting         |
| Maven          | Java project management     |
| npm            | Frontend package management |

---

# 🤖 AI Components

MindEase uses two major AI components.

## 1. Emotion Classification

The emotion service uses:

```text
j-hartmann/emotion-english-distilroberta-base
```

The model analyzes the student's message and returns an emotion classification with an associated confidence score.

Example:

```json
{
  "emotion": "sadness",
  "confidence": 0.94
}
```

The classification gives the chatbot additional context about the emotional state expressed in the message.

---

## 2. Gemini Response Generation

The detected emotion and user message are passed to the conversational AI layer.

Gemini is then used to generate a supportive response.

The configured Gemini model is:

```text
gemini-flash-latest
```

The response-generation process is designed to encourage:

* Empathy
* Emotional validation
* Practical support
* Appropriate coping suggestions
* Concise conversational responses

---

# 🔄 Application Flow

When a student sends a message, the general flow is:

```text
Student
   │
   │ Sends message
   ▼
React Frontend
   │
   │ POST request
   ▼
Spring Boot Backend
   │
   ├──────────────► Save message
   │
   ▼
Python Emotion Service
   │
   ├──► Hugging Face Emotion Model
   │
   │    Detect emotion + confidence
   │
   ▼
Gemini
   │
   │ Generate supportive response
   ▼
Python Emotion Service
   │
   │ Return AI result
   ▼
Spring Boot Backend
   │
   ├──► Store emotion/response
   │
   ▼
React Frontend
   │
   ▼
Student sees response
```

---

# 🖥️ Application Pages

MindEase contains several application views.

### Landing Page

Introduces MindEase and explains its purpose.

### Login

Allows registered users to authenticate.

### Registration

Allows new users to create an account.

### Chat

The main conversational interface where students interact with MindEase.

### Dashboard

Provides access to relevant wellbeing information and user activity.

### Settings

Allows users to manage available application preferences.

### Crisis Support

Provides information and guidance for situations requiring immediate human assistance.

### Grounding

Provides guided breathing and grounding exercises.

### FAQ

Answers common questions about the application and its purpose.

---

# 🔌 API Endpoints

The Spring Boot backend exposes REST endpoints for the core application functionality.

## Authentication

### Login

```http
POST /api/auth/login
```

Used to authenticate a user and obtain a JWT token.

---

## Chat Sessions

### Create / Access Chat Session

```http
POST /api/chat/session
```

Handles chat-session operations associated with the authenticated user.

---

## Chat Messages

```http
POST /api/chat/message
```

Used to send a user's message to the chatbot and receive the generated response.

---

## Emotion Service

The Python service runs on:

```text
http://localhost:5000
```

### Health Check

```http
GET /health
```

Used to verify that the emotion service is running correctly.

---

# 🗄️ Database

MindEase uses **MySQL 8**.

The local database is configured as:

```text
Database: chatbot_db
```

The Docker database container exposes MySQL through:

```text
localhost:3307
```

The application stores information including:

* Users
* Chat sessions
* Messages
* Detected emotions
* Emotion confidence information

The database allows conversational information to remain associated with authenticated users.

---

# 📁 Project Structure

A simplified project structure is:

```text
MindEase/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── chatbot-service/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── emotion-service/
│   ├── ...
│   ├── requirements.txt
│   └── ...
│
├── docker-compose.yml
│
└── README.md
```

> The exact directory structure may vary depending on the version of the repository.

---

# ⚙️ Prerequisites

Before running MindEase locally, install:

* **Node.js**
* **npm**
* **Java 21**
* **Maven**
* **Python 3**
* **Docker Desktop**
* **Git**

You will also need API credentials for the external AI service used by the application.

---

# 🔑 Environment Variables

The application requires environment variables for sensitive configuration.

Important variables include:

```env
MYSQL_PASSWORD=your_mysql_password
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
EMOTION_SERVICE_URL=http://localhost:5000
```

Database configuration should also contain the appropriate:

```env
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USERNAME
MYSQL_PASSWORD
```

### ⚠️ Security

Never commit actual API keys, JWT secrets, passwords, or other credentials to GitHub.

Use environment variables and a local `.env` file instead.

A `.env.example` file can be provided as a template without exposing real credentials.

---

# 🐳 Docker Setup

MindEase can be run using Docker Compose.

The local deployment contains the major backend services:

```text
chatbot-mysql
chatbot-service
emotion-service
```

Start the services with:

```bash
docker compose up -d
```

To check running containers:

```bash
docker compose ps
```

To view logs:

```bash
docker compose logs
```

To view logs for a specific service:

```bash
docker compose logs chatbot-service
```

or:

```bash
docker compose logs emotion-service
```

To stop the services:

```bash
docker compose down
```

---

# ▶️ Running the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# ▶️ Running the Backend Manually

If running the Spring Boot service outside Docker:

```bash
cd chatbot-service
```

Then:

```bash
./mvnw spring-boot:run
```

On Windows, the Maven wrapper can be run with:

```bash
mvnw.cmd spring-boot:run
```

The backend is configured to run on:

```text
http://localhost:8081
```

---

# ▶️ Running the Emotion Service

Navigate to the Python service:

```bash
cd emotion-service
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service using the project's configured entry point.

The service runs on:

```text
http://localhost:5000
```

Verify that it is running by accessing:

```text
GET /health
```

---

# 🔐 Authentication

MindEase uses **JWT-based authentication**.

The general authentication process is:

```text
User
 │
 ▼
Login
 │
 ▼
Spring Boot Authentication
 │
 ▼
JWT Token
 │
 ▼
Frontend stores authentication state
 │
 ▼
Protected API Requests
```

Protected routes require a valid authentication token.

This prevents unauthenticated users from accessing user-specific chat information.

---

# 🧠 Emotion Detection Pipeline

The emotion-processing pipeline can be summarized as:

```text
User Message
     │
     ▼
Emotion Service
     │
     ▼
Tokenizer / Transformer Model
     │
     ▼
Emotion Classification
     │
     ├── Emotion
     └── Confidence Score
     │
     ▼
Response Generation
```

For example:

```text
Input:
"I have so much work to do and I don't know how I'm going to finish everything."

          ↓

Detected Emotion:
Stress-related emotional state

          ↓

Confidence:
Model-generated confidence score

          ↓

Gemini:
Generates contextual supportive response
```

The emotion classifier provides an additional signal rather than being treated as a clinical diagnosis.

---

# 🛡️ Safety and Crisis Support

Mental health applications require special consideration because AI systems can produce inappropriate or misleading responses.

MindEase therefore includes safety-oriented behavior.

When a message indicates a potentially high-risk situation, the system can prioritize a safer response rather than relying entirely on ordinary conversational generation.

The system encourages users experiencing serious or immediate danger to seek appropriate human assistance and emergency support.

MindEase does **not**:

* Diagnose mental health disorders
* Replace professional counseling
* Prescribe medication
* Provide medical treatment
* Guarantee the accuracy of emotion predictions
* Act as an emergency response service

The chatbot's role is limited to supportive conversation and general wellbeing assistance.

---

# 🎨 Design Approach

MindEase was designed with accessibility and emotional comfort in mind.

The interface uses a calm visual style and focuses on reducing unnecessary visual complexity.

The application emphasizes:

* Simple navigation
* Clear typography
* Responsive layouts
* Conversational interaction
* Accessible wellbeing resources
* Clear separation between normal chat and crisis support

The goal is to make the application feel approachable rather than clinical.

---

# 📚 Theoretical Foundations

MindEase was developed using two major theoretical foundations.

## Cognitive Behavioural Therapy (CBT)

CBT principles influenced the design of the chatbot's conversational behavior.

The system encourages users to:

* Recognize difficult thoughts and emotions
* Reflect on stressful situations
* Consider healthier perspectives
* Explore practical coping strategies

The chatbot does not perform formal CBT treatment. Instead, CBT concepts provide a foundation for designing supportive interactions.

---

## Technology Acceptance Model (TAM)

The Technology Acceptance Model was used to consider factors affecting users' acceptance of the system.

Important considerations include:

* Perceived usefulness
* Perceived ease of use
* User interaction
* Accessibility
* Willingness to use the system

These principles informed the design of the user interface and overall interaction experience.

---

# 🧪 Testing

The application can be tested at multiple levels.

### Frontend Testing

Testing focuses on:

* Navigation
* Form validation
* Authentication flows
* Chat interaction
* Responsive UI
* Protected routes

### Backend Testing

Testing focuses on:

* Authentication endpoints
* Chat session management
* Message processing
* Database persistence
* API communication
* Error handling

### AI Service Testing

Testing focuses on:

* Emotion classification
* Confidence scores
* API responses
* Gemini response generation
* Service availability
* Failure/fallback behavior

### Integration Testing

The complete flow is tested from:

```text
Frontend
   ↓
Spring Boot
   ↓
Python AI Service
   ↓
Hugging Face / Gemini
   ↓
Spring Boot
   ↓
Database
   ↓
Frontend
```

This ensures that the individual services work together correctly.

---

# ⚠️ Limitations

MindEase has several limitations.

### AI Accuracy

Emotion classification is not perfectly accurate. A model may incorrectly interpret the emotional meaning of a message.

### Context Understanding

AI-generated responses may not always fully understand a student's personal circumstances or cultural context.

### No Clinical Diagnosis

Detected emotions should not be interpreted as medical or psychological diagnoses.

### Internet Dependency

External AI services such as Gemini may require an active internet connection and may be affected by API availability, rate limits, or latency.

### Language Limitations

The emotion model was primarily designed for English-language text, so performance may vary for other languages or mixed-language conversations.

### Crisis Detection

Automated systems cannot reliably identify every crisis situation. Human professional support remains essential for serious mental health concerns.

---

# 🚀 Future Improvements

Potential improvements to MindEase include:

* Improved emotion classification through additional training data
* Support for additional languages
* More advanced conversation memory
* Improved personalization
* Integration with university counseling services
* Appointment booking with professional counselors
* More comprehensive wellbeing analytics
* Improved crisis detection and escalation mechanisms
* Offline or locally hosted AI capabilities
* More extensive accessibility support
* Automated testing and CI/CD
* Production-grade monitoring and logging
* Stronger privacy and data-protection mechanisms

---

# 🔒 Privacy Considerations

Because MindEase processes personal conversations, privacy is an important consideration.

A production deployment should implement:

* Secure HTTPS communication
* Strong password hashing
* Secure secret management
* Database encryption where appropriate
* Appropriate data retention policies
* Access controls
* Audit logging
* Secure API configuration
* Clear user consent and privacy policies

The academic implementation should not be considered a production-ready clinical system.

---

# 📌 Project Status

**Status: Completed**

MindEase was developed as a final-year Computer Science project demonstrating the integration of:

* Full-stack web development
* RESTful APIs
* Microservice-style architecture
* Relational databases
* Authentication
* Natural language processing
* Emotion classification
* Generative AI
* Docker containerization
* Human-centered application design

---

# 👩🏽‍💻 Author

**Ganiyat Olaiwon Oluwatobi**

Computer Science Graduate
Crescent University, Abeokuta, Nigeria

---

# 📄 Academic Project

**Project Title:**

> **A Chatbot Supportive System for Student Stress Management**

MindEase was developed as a final-year Computer Science project to explore the use of artificial intelligence and full-stack software development in providing accessible supportive tools for university students experiencing academic stress.

---

# ⚠️ Disclaimer

MindEase is an academic software project intended for educational and research purposes.

It is **not a medical device, diagnostic system, therapist, counselor, or emergency service**.

The information and responses generated by the system should not be considered professional medical or psychological advice.

Users experiencing a mental health emergency or immediate danger should contact an appropriate emergency service, crisis line, or qualified mental health professional.

---

## ⭐ Acknowledgements

MindEase combines open-source technologies, pretrained machine-learning models, and third-party AI services.

Key technologies and services used include:

* React
* Spring Boot
* FastAPI
* MySQL
* Docker
* Hugging Face
* Google Gemini
* Tailwind CSS
* Vite

The project demonstrates how these technologies can be combined into a full-stack AI-assisted application for student wellbeing support.
