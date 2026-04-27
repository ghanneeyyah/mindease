package com.example.chatbot.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateChatSession {
    @NotNull
    private Long userId;
    // Note: You don't need to pass these from request, they're set in service
}