package com.example.chatbot.service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String message;

    public LoginResponse(String token, String message){
        this.token = token;
        this.message = message;
    }

}
