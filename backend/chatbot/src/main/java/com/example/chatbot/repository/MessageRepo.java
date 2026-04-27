package com.example.chatbot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.model.entity.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long>{
    List<Message> findByChatSessionId(Long sessionId);
}
