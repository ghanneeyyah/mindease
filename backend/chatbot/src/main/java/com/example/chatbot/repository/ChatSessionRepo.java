package com.example.chatbot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.model.entity.ChatSession;
import com.example.chatbot.model.entity.enums.Status;

@Repository
public interface ChatSessionRepo extends JpaRepository<ChatSession, Long>{
    List<ChatSession> findByUserId(Long userId);
    List<ChatSession> findByStatus(Status status);
}
