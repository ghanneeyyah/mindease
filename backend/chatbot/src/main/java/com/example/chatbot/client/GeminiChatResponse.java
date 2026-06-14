package com.example.chatbot.client;

import lombok.Data;

@Data
public class GeminiChatResponse {
    private String userMessage;
    private String detectedEmotion;
    private Double confidence;
    private String botResponse;
}