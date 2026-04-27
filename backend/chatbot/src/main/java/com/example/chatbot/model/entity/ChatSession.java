package com.example.chatbot.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.chatbot.model.entity.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="chat_sessions")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="session_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable =false)
    private User user;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime sessionStartTime;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime sessionEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable =false)
    private Status status;



    @OneToMany(mappedBy="chatSession", cascade=CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    // Add default constructor
    public ChatSession() {}
    
    // Helper methods for bidirectional relationship
    public void addMessage(Message message) {
        messages.add(message);
        message.setChatSession(this);
    }
    
    public void removeMessage(Message message) {
        messages.remove(message);
        message.setChatSession(null);
    }
}
