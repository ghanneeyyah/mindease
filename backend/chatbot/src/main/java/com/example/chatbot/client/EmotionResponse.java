package com.example.chatbot.client;

import lombok.Data;
import java.util.Map;

@Data
public class EmotionResponse {
    private String text;
    private Map<String, Double> emotions;
    private String dominantEmotion;
    private Double confidence;
}