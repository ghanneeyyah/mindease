package com.example.chatbot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.model.entity.User;

import java.util.Optional;
import org.springframework.lang.NonNull;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    @NonNull Optional<User> findById(@NonNull Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}