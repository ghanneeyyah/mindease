from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import google.generativeai as genai
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Emotion Detection + Chat Service")

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
# Configure Gemini
# ============================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key-here")
genai.configure(api_key=GEMINI_API_KEY)

# Use a lightweight model for faster responses
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

MENTAL_HEALTH_PROMPT = """
You are MindEase, a supportive and empathetic mental health companion. 
Your role is to:
- Listen actively and validate the user's feelings
- Offer gentle, evidence-based coping strategies when appropriate
- Never diagnose conditions or prescribe medication
- Always prioritize user safety — if someone expresses self-harm or suicidal thoughts, 
  encourage them to contact a crisis helpline immediately
- Keep responses concise (2-4 sentences), warm, and conversational
- Match your tone to the user's detected emotion

The user's detected emotion is: {emotion}
User message: {user_message}

Respond as MindEase:
"""

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

def generate_gemini_response(user_message: str, emotion: str) -> str:
    """Generate a response using Gemini based on detected emotion"""
    try:
        prompt = MENTAL_HEALTH_PROMPT.format(
            emotion=emotion,
            user_message=user_message
        )
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        # Fallback responses if Gemini fails
        fallbacks = {
            "joy": "That's wonderful to hear! What's making you feel so joyful?",
            "sadness": "I'm here for you. Would you like to talk about what's bothering you?",
            "anger": "I hear your frustration. Let's work through this together.",
            "fear": "It's okay to feel anxious. Take a deep breath. You're safe here.",
            "love": "That's beautiful! Spreading love makes the world better.",
            "surprise": "Wow! That sounds unexpected. Tell me more!",
            "neutral": "Thank you for sharing. How else can I support you today?"
        }
        return fallbacks.get(emotion.lower(), "I understand. Please continue sharing.")

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
        "gemini_configured": GEMINI_API_KEY != "your-gemini-api-key-here"
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
    """Full chat endpoint: detect emotion + generate Gemini response"""
    # Step 1: Detect emotion
    emotions, dominant, confidence = get_emotion_results(request.text)
    
    # Step 2: Generate response using Gemini
    bot_response = generate_gemini_response(request.text, dominant)
    
    logger.info(f"Chat: '{request.text[:50]}...' -> {dominant} -> Response generated")
    
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
    uvicorn.run(app, host="0.0.0.0", port=5000)