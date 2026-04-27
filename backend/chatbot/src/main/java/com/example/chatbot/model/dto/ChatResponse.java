package com.example.chatbot.model.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponse {
    private Long messageId;
    private Long sessionId;
    private String text;
    private String sentimentLabel;
    private String senderType;
    private LocalDateTime timestamp;
}
