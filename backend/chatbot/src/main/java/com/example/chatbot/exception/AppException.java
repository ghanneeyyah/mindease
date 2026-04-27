package com.example.chatbot.exception;

public abstract class AppException extends RuntimeException {
    private final int statusCode;

    public AppException(String message, int statusCode){
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode(){
        return statusCode;
    }
}
