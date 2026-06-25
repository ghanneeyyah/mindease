package com.example.chatbot.model.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatSessionResponse {
    private Long sessionId;
    private Long userId;
    private String username;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;
    private String status;
    private List<ChatResponse> messages;
    private String dateLabel; // e.g. "June 24, 2026"

    // Auto-generate dateLabel from sessionStartTime
    public void setSessionStartTime(LocalDateTime sessionStartTime) {
        this.sessionStartTime = sessionStartTime;
        if (sessionStartTime != null) {
            this.dateLabel = sessionStartTime.format(
                DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH)
            );
        }
    }
}