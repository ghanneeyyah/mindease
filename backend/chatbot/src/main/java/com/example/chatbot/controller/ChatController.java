package com.example.chatbot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatbot.model.dto.ChatRequest;
import com.example.chatbot.model.dto.ChatResponse;
import com.example.chatbot.model.dto.ChatSessionResponse;
import com.example.chatbot.model.dto.CreateChatSession;
import com.example.chatbot.model.dto.SaveBotMessageRequest;
import com.example.chatbot.service.ChatService;

@RestController
@RequestMapping("api/chat")
public class ChatController {
    @Autowired
    public ChatService chatService;

    @PostMapping("/session")
    public ResponseEntity<ChatSessionResponse> createSession(@RequestBody CreateChatSession request) {
        ChatSessionResponse response = chatService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.processMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/message/bot")
    public ResponseEntity<ChatResponse> saveBotMessage(@RequestBody SaveBotMessageRequest request) {
        ChatResponse response = chatService.saveBotMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<List<ChatSessionResponse>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserSessions(userId));
    }

    @GetMapping("/messages/{sessionId}")
    public ResponseEntity<List<ChatResponse>> getMessages(@PathVariable Long sessionId) {
        List<ChatResponse> messages = chatService.getSessionMessages(sessionId);
        return ResponseEntity.ok(messages);
    }
}