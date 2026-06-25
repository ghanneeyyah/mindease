import { useState, useCallback, useRef } from "react";
import { chatService } from "../services/chatService";
import { emotionService } from "../services/emotionService";
import toast from "react-hot-toast";

export const useChat = (sessionId, userId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || !sessionId) return;

    const userMessage = {
      messageId: Date.now(),
      text: text,
      senderType: "USER",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    scrollToBottom();

    try {
      const emotionResponse = await emotionService.analyzeAndRespond(text);
      
      const crisisKeywords = ["kill myself", "suicide", "end my life", "hurt myself", "want to die"];
      const isCrisis = crisisKeywords.some(keyword => 
        text.toLowerCase().includes(keyword)
      ) || emotionResponse.detected_emotion === "crisis";
      
      if (isCrisis) setCrisisDetected(true);

      const botMessage = {
        messageId: Date.now() + 1,
        text: emotionResponse.bot_response,
        senderType: "BOT",
        timestamp: new Date().toISOString(),
        emotion: emotionResponse.detected_emotion,
        confidence: emotionResponse.confidence,
      };

      setMessages(prev => [...prev, botMessage]);
      
      await chatService.sendMessage(sessionId, text);
      
    } catch (error) {
      console.error("Failed to get response:", error);
      const fallbackMessage = {
        messageId: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please take a deep breath and try again in a moment. 🌿",
        senderType: "BOT",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error("Connection issue. Using offline support mode.");
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const clearCrisis = () => setCrisisDetected(false);

  return {
    messages,
    setMessages,
    isTyping,
    crisisDetected,
    clearCrisis,
    sendMessage,
    messagesEndRef,
    scrollToBottom
  };
};