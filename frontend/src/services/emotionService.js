import { emotionApi } from "./api";

export const emotionService = {
  // Get full emotion analysis
  analyzeEmotion: async (text) => {
    const response = await emotionApi.post("/analyze", { text });
    return response.data;
  },

  // Get simple emotion detection
  getSimpleEmotion: async (text) => {
    const response = await emotionApi.post("/analyze/simple", { text });
    return response.data;
  },

  // Get empathetic response based on emotion
  // `history` = array of { role: "user" | "model", text: "..." } in chronological order,
  // NOT including the current message (that's sent separately as `text`).
  analyzeAndRespond: async (text, history = []) => {
    try {
      const response = await emotionApi.post("/chat", { text, history });
      return {
        detected_emotion: response.data.detected_emotion,
        confidence: response.data.confidence,
        bot_response: response.data.bot_response,
        user_message: response.data.user_message,
      };
    } catch (error) {
      console.error("Emotion service error:", error);

      // Fallback responses if Python service is down
      const fallbackResponses = {
        sad: "I hear that you're feeling down. That's completely valid. Would you like to talk more about what's making you feel this way? I'm here to listen. 💙",
        angry: "It sounds like you're feeling frustrated. That's okay - all emotions are welcome here. Take a deep breath with me. Would you like to talk about what's bothering you? 🫂",
        fear: "I sense you might be feeling anxious or worried. That can be really hard. Let's take a moment together. You're safe here. What's on your mind? 🌿",
        joy: "I love hearing that you're feeling good! That's wonderful. Would you like to share more about what's bringing you joy? 😊",
        neutral: "Thank you for sharing. I'm here to support you however you need. How can I help you today? 💚",
      };

      // Simple keyword detection for fallback
      let emotion = "neutral";
      if (text.match(/sad|depressed|down|unhappy|lonely|alone/i)) emotion = "sad";
      else if (text.match(/angry|mad|frustrated|annoyed|hate/i)) emotion = "angry";
      else if (text.match(/anxious|nervous|worried|scared|fear|panic/i)) emotion = "fear";
      else if (text.match(/happy|great|wonderful|excited|joy|good/i)) emotion = "joy";

      return {
        detected_emotion: emotion,
        confidence: 0.7,
        bot_response: fallbackResponses[emotion],
        user_message: text,
      };
    }
  },
};