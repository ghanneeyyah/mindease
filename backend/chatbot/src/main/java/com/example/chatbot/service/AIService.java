package com.example.chatbot.service;

import org.springframework.stereotype.Service;

@Service
public class AIService {
    public String generatedMessage(String userMessage){
        if (userMessage.toLowerCase().contains("hello")) {
            return "Hello! How can I help you today?";
        }
        return "I understand you said: " + userMessage;
    }

    public String analyzeSentiment(String text) {
        // Add sentiment analysis
        return "POSITIVE"; // or NEUTRAL, NEGATIVE
    }
}
