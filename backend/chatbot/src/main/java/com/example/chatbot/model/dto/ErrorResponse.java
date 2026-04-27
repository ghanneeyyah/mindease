package com.example.chatbot.model.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String message;
    private int status;
    private LocalDateTime timeStamp;
    
    public ErrorResponse() {
        this.timeStamp = LocalDateTime.now();
    }
    
    public String getMessage(){
        return message;
    }
    public void setMessage(String message){
        this.message = message;
    }

    public int getStatus(){
        return status;
    }
    public void setStatus(int status){
        this.status = status;
    }

    public LocalDateTime getTimeStamp(){
        return timeStamp;
    }
    public void setTimeStamp(LocalDateTime timeStamp){
        this.timeStamp = timeStamp;
    }
    
}
