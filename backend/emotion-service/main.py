from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Emotion Detection Service")

# Load the emotion detection model
# Using a pre-trained model for emotion classification
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

class TextRequest(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    text: str
    emotions: dict
    dominant_emotion: str
    confidence: float

@app.get("/")
def read_root():
    return {"message": "Emotion Detection Service is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": emotion_classifier is not None}

@app.post("/analyze", response_model=EmotionResponse)
async def analyze_emotion(request: TextRequest):
    if not emotion_classifier:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Get emotion predictions
        results = emotion_classifier(request.text)[0]
        
        # Convert to dictionary format
        emotions = {item['label']: round(item['score'], 4) for item in results}
        
        # Find dominant emotion
        dominant = max(results, key=lambda x: x['score'])
        
        return EmotionResponse(
            text=request.text,
            emotions=emotions,
            dominant_emotion=dominant['label'],
            confidence=round(dominant['score'], 4)
        )
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/simple")
async def analyze_emotion_simple(request: TextRequest):
    """Simplified endpoint that returns just the dominant emotion"""
    if not emotion_classifier:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        results = emotion_classifier(request.text)[0]
        dominant = max(results, key=lambda x: x['score'])

        # Add logging to see what's happening
        logger.info(f"Text: '{request.text}' -> Emotion: {dominant['label']} ({dominant['score']:.3f})")
        
        return {
            "text": request.text,
            "emotion": dominant['label'],
            "confidence": round(dominant['score'], 4)
        }
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/debug")
async def analyze_debug(request: TextRequest):
    """Debug endpoint that returns all emotion scores"""
    if not emotion_classifier:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        results = emotion_classifier(request.text)[0]
        
        # Sort by confidence
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
        
        return {
            "text": request.text,
            "all_emotions": {item['label']: round(item['score'], 4) for item in sorted_results},
            "dominant_emotion": sorted_results[0]['label'],
            "confidence": round(sorted_results[0]['score'], 4),
            "threshold_check": "PASSED" if sorted_results[0]['score'] >= 0.6 else "FAILED"
        }
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)