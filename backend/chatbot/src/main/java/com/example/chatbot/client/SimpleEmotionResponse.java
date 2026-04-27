package com.example.chatbot.client;

import lombok.Data;

@Data
public class SimpleEmotionResponse {
    private String text;
    private String emotion;
    private Double confidence;
}