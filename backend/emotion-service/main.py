import os
import logging
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Emotion Detection + Chat Service")

# ============================================
# CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://mindease-ai.pxxl.run",  # Add production domain
        "https://yourdomain.com"          # Replace with your actual domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Load Emotion Detection Model
# ============================================
try:
    emotion_classifier = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        top_k=None
    )
    logger.info("Emotion model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    emotion_classifier = None

# ============================================
# Gemini setup
# ============================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key-here")
genai.configure(api_key=GEMINI_API_KEY)
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")  # Updated to correct model name

SYSTEM_INSTRUCTION = """
You are MindEase, a warm, compassionate mental health companion who feels like a trusted friend.

Your goal is to help the user feel heard, understood, and supported.

Guidelines:
- Speak naturally, warmly, and conversationally.
- Validate the user's feelings before offering suggestions.
- Focus on understanding before solving.
- Ask one gentle follow-up question to continue the conversation.
- Keep responses to 2-3 sentences.
- Vary sentence openings naturally.
- Never sound clinical, robotic, or scripted.
- Never mention being an AI or language model.
- Never invent facts about the user.
- If the detected emotion conflicts with the user's message, trust the user's message.
- Each user message may be prefixed with a line like "[Detected emotion: sadness (confidence: 82%)]" —
  treat this as background context only, never repeat it back to the user, and never mention that
  emotion detection is happening.

If the user expresses suicidal thoughts or immediate danger:
- Respond with empathy.
- Encourage them to reach out to someone they trust.
- Recommend contacting an appropriate local crisis service or emergency services if they are in immediate danger.
- Stay calm and supportive.

Reply only as MindEase.
"""

gemini_model = genai.GenerativeModel(
    GEMINI_MODEL_NAME,
    system_instruction=SYSTEM_INSTRUCTION
)

# ============================================
# Conversation memory
# ============================================
# This service is STATELESS: the frontend (backed by your Java service, which
# already persists messages per session) sends the relevant conversation
# history with every /chat request. We don't keep our own session store here,
# so there's a single source of truth for chat history (Java's DB) instead of
# two copies that can drift out of sync.

MAX_HISTORY_TURNS = 20  # cap history length accepted per request, purely defensive


class HistoryTurn(BaseModel):
    role: str  # "user" or "model"
    text: str


def to_gemini_history(history: List[HistoryTurn]) -> List[dict]:
    """Convert incoming {role, text} turns into Gemini's {role, parts} format."""
    trimmed = history[-(MAX_HISTORY_TURNS * 2):]
    return [{"role": turn.role, "parts": [turn.text]} for turn in trimmed]


# ============================================
# Pydantic Models
# ============================================
class TextRequest(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    text: str
    emotions: dict
    dominant_emotion: str
    confidence: float

class ChatRequest(BaseModel):
    text: str
    # Prior conversation turns, oldest first, NOT including `text` itself.
    # Frontend builds this from messages it already has (e.g. from Java).
    history: List[HistoryTurn] = []

class ChatResponse(BaseModel):
    user_message: str
    detected_emotion: str
    confidence: float
    bot_response: str

# ============================================
# Helper Functions
# ============================================
def get_emotion_results(text: str):
    """Run emotion detection and return results"""
    if not emotion_classifier:
        raise HTTPException(status_code=503, detail="Model not loaded")

    results = emotion_classifier(text)[0]
    dominant = max(results, key=lambda x: x['score'])
    emotions = {item['label']: round(item['score'], 4) for item in results}

    return emotions, dominant['label'], round(dominant['score'], 4)


def generate_gemini_response(
    history: List[HistoryTurn], user_message: str, emotion: str, confidence: float
) -> str:
    """Generate a response using Gemini, given conversation history passed in by the client"""
    gemini_history = to_gemini_history(history)

    # Give the model the emotion signal for this turn only (not stored/echoed anywhere)
    annotated_message = (
        f"[Detected emotion: {emotion} (confidence: {confidence:.0%})]\n"
        f"{user_message}"
    )

    try:
        chat = gemini_model.start_chat(history=gemini_history)
        response = chat.send_message(annotated_message)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API error with primary model: {e}")
        try:
            fallback_model = genai.GenerativeModel(
                "gemini-1.5-flash-lite",  # Updated to correct model name
                system_instruction=SYSTEM_INSTRUCTION
            )
            chat = fallback_model.start_chat(history=gemini_history)
            response = chat.send_message(annotated_message)
            return response.text.strip()
        except Exception as fallback_err:
            logger.error(f"Gemini fallback model error: {fallback_err}")
            fallbacks = {
                "joy": "That's so good to hear! What's been making you smile lately?",
                "sadness": "That sounds really hard, and it makes sense you're feeling that way. Want to share more about what's going on?",
                "anger": "Ugh, that sounds so frustrating. What happened?",
                "fear": "Hey, you're safe here. Take a breath — what's been weighing on you?",
                "love": "That's really sweet to hear. Tell me more!",
                "surprise": "Oh wow, that sounds unexpected! What happened?",
                "neutral": "Thanks for sharing that with me. What's been on your mind?"
            }
            return fallbacks.get(emotion.lower(), "I'm here — tell me more.")

# ============================================
# Endpoints
# ============================================
@app.get("/")
def read_root():
    return {
        "message": "MindEase Emotion Detection + Chat Service is running!",
        "endpoints": ["/analyze", "/analyze/simple", "/chat", "/health", "/analyze/debug"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": emotion_classifier is not None,
        "gemini_configured": GEMINI_API_KEY != "your-gemini-api-key-here",
        "port": int(os.getenv("PORT", 8080))
    }

@app.post("/analyze", response_model=EmotionResponse)
async def analyze_emotion(request: TextRequest):
    emotions, dominant, confidence = get_emotion_results(request.text)

    return EmotionResponse(
        text=request.text,
        emotions=emotions,
        dominant_emotion=dominant,
        confidence=confidence
    )

@app.post("/analyze/simple")
async def analyze_emotion_simple(request: TextRequest):
    """Simplified endpoint that returns just the dominant emotion"""
    emotions, dominant, confidence = get_emotion_results(request.text)

    logger.info(f"Text: '{request.text}' -> Emotion: {dominant} ({confidence})")

    return {
        "text": request.text,
        "emotion": dominant,
        "confidence": confidence
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Full chat endpoint: detect emotion + generate Gemini response.

    Stateless — expects `history` (prior turns) in the request body, since
    the Java backend already persists messages per session.
    """
    # Step 1: Detect emotion
    emotions, dominant, confidence = get_emotion_results(request.text)

    # Step 2: Generate response using Gemini, using history passed by the client
    bot_response = generate_gemini_response(request.history, request.text, dominant, confidence)

    logger.info(f"'{request.text[:50]}...' -> {dominant} -> response generated (history len={len(request.history)})")

    return ChatResponse(
        user_message=request.text,
        detected_emotion=dominant,
        confidence=confidence,
        bot_response=bot_response
    )

@app.post("/analyze/debug")
async def analyze_debug(request: TextRequest):
    """Debug endpoint that returns all emotion scores"""
    emotions, dominant, confidence = get_emotion_results(request.text)

    return {
        "text": request.text,
        "all_emotions": emotions,
        "dominant_emotion": dominant,
        "confidence": confidence,
        "threshold_check": "PASSED" if confidence >= 0.6 else "FAILED"
    }

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable if set, otherwise default to 8080
    # The deployment expects port 8080 (or whatever PORT is set to)
    port = int(os.getenv("PORT", 8080))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)