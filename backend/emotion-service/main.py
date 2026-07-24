from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
# CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key-here")
genai.configure(api_key=GEMINI_API_KEY)
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
gemini_model = genai.GenerativeModel(GEMINI_MODEL_NAME)

MENTAL_HEALTH_PROMPT = """
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

Detected emotion (may be imperfect):
{emotion} (confidence: {confidence:.0%})

User message:
"{user_message}"

If the user expresses suicidal thoughts or immediate danger:
- Respond with empathy.
- Encourage them to reach out to someone they trust.
- Recommend contacting an appropriate local crisis service or emergency services if they are in immediate danger.
- Stay calm and supportive.

Reply only as MindEase.
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

def generate_gemini_response(user_message: str, emotion: str, confidence: float) -> str:
    """Generate a response using Gemini based on detected emotion"""
    try:
        prompt = MENTAL_HEALTH_PROMPT.format(
            emotion=emotion,
            confidence=confidence,
            user_message=user_message
        )
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API error with primary model: {e}")
        try:
            fallback_model = genai.GenerativeModel("gemini-flash-lite-latest")
            prompt = MENTAL_HEALTH_PROMPT.format(
                emotion=emotion,
                confidence=confidence,
                user_message=user_message
            )
            response = fallback_model.generate_content(prompt)
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
    
    # Step 2: Generate response using Gemini with confidence
    bot_response = generate_gemini_response(request.text, dominant, confidence)
    
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