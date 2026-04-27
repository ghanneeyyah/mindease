package com.example.chatbot.model.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    @NotNull
    private Long sessionId;

    @NotBlank
    @Size(max=2000)
    private String text;
   
}