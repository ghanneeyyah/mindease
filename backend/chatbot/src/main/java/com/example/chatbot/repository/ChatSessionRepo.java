package com.example.chatbot.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.chatbot.model.entity.ChatSession;
import com.example.chatbot.model.entity.enums.Status;

@Repository
public interface ChatSessionRepo extends JpaRepository<ChatSession, Long> {

    // Find all sessions for a user, newest first
    List<ChatSession> findByUserIdOrderBySessionStartTimeDesc(Long userId);

    // Check if a session already exists for a user on a specific day
    @Query("SELECT cs FROM ChatSession cs WHERE cs.user.id = :userId " +
           "AND cs.sessionStartTime >= :startOfDay " +
           "AND cs.sessionStartTime < :endOfDay")
    Optional<ChatSession> findTodaysSession(
        @Param("userId") Long userId,
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );

    List<ChatSession> findByStatus(Status status);
}