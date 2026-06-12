package com.example.chatbot.exception.domain;

import com.example.chatbot.exception.NotFoundException;

public class ChatSessionNotFound extends NotFoundException {
    public ChatSessionNotFound(){
        super("Session Not Found.");
    }
    public ChatSessionNotFound(Long id){
        super("Chat session with id "+id+" was not found");
    }
}
