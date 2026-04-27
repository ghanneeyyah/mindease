package com.example.chatbot.exception.domain;

import com.example.chatbot.exception.NotFoundException;

public class UserNotFound extends NotFoundException {
    public UserNotFound(String username){
        super("User with name "+username+" was not found");
    }
    public UserNotFound(Long id){
        super("User with id "+id+" was not found");
    }
    public UserNotFound(){
        super("User Not Found.");
    }
}
