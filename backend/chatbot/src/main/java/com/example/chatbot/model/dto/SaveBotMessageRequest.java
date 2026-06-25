package com.example.chatbot.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveBotMessageRequest {
    private Long sessionId;
    private String text;
}