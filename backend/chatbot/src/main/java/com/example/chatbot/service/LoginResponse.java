package com.example.chatbot.service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String message;
    private Long userId;
    private String username;

    public LoginResponse(String token, String message, Long userId, String username){
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.username = username;
    }

}
