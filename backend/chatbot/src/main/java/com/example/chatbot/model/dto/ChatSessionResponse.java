package com.example.chatbot.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatSessionResponse {
    private Long sessionId;
    private Long userId;           // Added
    private String username;
    private LocalDateTime sessionStartTime;  // Added
    private LocalDateTime sessionEndTime;    // Added
    private String status;          // Added
    private List<ChatResponse> messages; 
}