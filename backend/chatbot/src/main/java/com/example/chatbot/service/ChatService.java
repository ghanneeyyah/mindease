package com.example.chatbot.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chatbot.client.EmotionServiceClient;
import com.example.chatbot.client.SimpleEmotionResponse;
import com.example.chatbot.exception.domain.ChatSessionNotFound;
import com.example.chatbot.exception.domain.UserNotFound;
import com.example.chatbot.model.dto.ChatRequest;
import com.example.chatbot.model.dto.ChatResponse;
import com.example.chatbot.model.dto.ChatSessionResponse;
import com.example.chatbot.model.dto.CreateChatSession;
import com.example.chatbot.model.entity.ChatSession;
import com.example.chatbot.model.entity.Message;
import com.example.chatbot.model.entity.User;
import com.example.chatbot.model.entity.enums.Status;
import com.example.chatbot.repository.ChatSessionRepo;
import com.example.chatbot.repository.MessageRepo;
import com.example.chatbot.repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatService {
    @Autowired
    private ChatSessionRepo chatSessionRepo;

    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmotionServiceClient emotionClient;

    // Add confidence threshold constant
    private static final double CONFIDENCE_THRESHOLD = 0.6; // Adjust as needed
    

    @Transactional
    public ChatSessionResponse createSession(CreateChatSession request) {
        User user = userRepo.findById(request.getUserId())
            .orElseThrow(() -> new UserNotFound(request.getUserId()));
        
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setStatus(Status.ACTIVE);
        session.setSessionStartTime(LocalDateTime.now());
        session.setSessionEndTime(LocalDateTime.now());
        
        ChatSession savedSession = chatSessionRepo.save(session);
        
        // Convert to DTO (no password exposure)
        return mapToResponse(savedSession);
    }
    
    

    //@Transactional
    // public Message processMessage(ChatRequest request) {
    //     ChatSession session = chatSessionRepo.findById(request.getSessionId())
    //         .orElseThrow(() -> new ChatSessionNotFound());
        
    //     Message message = new Message();
    //     message.setChatSession(session);
    //     message.setText(request.getText());
    //     message.setSenderType("USER");
    //     message.setTimestamp(LocalDateTime.now());
        
    //     // TODO: Add AI response logic here
        
    //     return messageRepo.save(message);
    // }

    @Transactional
    public ChatResponse processMessage(ChatRequest request) {
        ChatSession session = chatSessionRepo.findById(request.getSessionId())
            .orElseThrow(() -> new ChatSessionNotFound(request.getSessionId()));
        
         // Save user message
        Message userMessage = new Message();
        userMessage.setChatSession(session);
        userMessage.setText(request.getText());
        userMessage.setSenderType("USER");
        userMessage.setTimestamp(LocalDateTime.now());
        
        // Call Python service for emotion detection
        String sentiment;
        try {
            SimpleEmotionResponse emotionResponse = emotionClient
                    .analyzeEmotionSimple(request.getText())
                    .block();
            
            // 🔥 CONFIDENCE THRESHOLD CHECK HERE!
            if (emotionResponse != null && emotionResponse.getConfidence() >= CONFIDENCE_THRESHOLD) {
                sentiment = emotionResponse.getEmotion();
                log.info("Emotion detected: {} with confidence: {}", sentiment, emotionResponse.getConfidence());
            } else {
                // Low confidence - fallback to neutral or context-based
                sentiment = detectEmotionByKeywords(request.getText());
                log.warn("Low confidence emotion, using keyword fallback: {}", sentiment);
            }
        } catch (Exception e) {
            log.error("Emotion service failed, using fallback", e);
            sentiment = detectEmotionByKeywords(request.getText());
        }
        
        userMessage.setSentimentLabel(sentiment);
        Message savedUserMessage = messageRepo.save(userMessage);
        
        // Generate bot response based on emotion
        String botResponse = generateResponseBasedOnEmotion(request.getText(), sentiment);
        
        // Save bot response
        Message botMessage = new Message();
        botMessage.setChatSession(session);
        botMessage.setText(botResponse);
        botMessage.setSenderType("BOT");
        botMessage.setTimestamp(LocalDateTime.now());
        messageRepo.save(botMessage);
        
        // Update session end time
        session.setSessionEndTime(LocalDateTime.now());
        chatSessionRepo.save(session);
        
        return mapToChatResponse(savedUserMessage);
    }

    @Transactional
    public List<ChatResponse> getSessionMessages(Long sessionId) {
        List<Message> messages = messageRepo.findByChatSessionId(sessionId);
        return messages.stream()
                .map(this::mapToChatResponse)
                .collect(Collectors.toList());
    }



    public Object getUserSessions(Long userId) {
        // TODO Auto-generated method stub
        return chatSessionRepo.findByUserId(userId);
    }

    private ChatResponse mapToChatResponse(Message message) {
        ChatResponse response = new ChatResponse();
        response.setMessageId(message.getId());
        response.setSessionId(message.getChatSession().getId());
        response.setText(message.getText());
        response.setSenderType(message.getSenderType());
        response.setSentimentLabel(message.getSentimentLabel());
        response.setTimestamp(message.getTimestamp());
        return response;
    }

    private ChatSessionResponse mapToResponse(ChatSession session) {
        ChatSessionResponse response = new ChatSessionResponse();
        response.setSessionId(session.getId());
        response.setUserId(session.getUser().getId());
        response.setUsername(session.getUser().getUsername());
        response.setSessionStartTime(session.getSessionStartTime());
        response.setSessionEndTime(session.getSessionEndTime());
        response.setStatus(session.getStatus().name());
        return response;
    }

     /**
     * Keyword-based fallback when AI confidence is low
     */
    private String detectEmotionByKeywords(String text) {
        String lowerText = text.toLowerCase();
        
        // Fear-related keywords
        if (containsAny(lowerText, "scared", "afraid", "fear", "terrified", "unsafe", "danger", "worried", "anxious")) {
            return "fear";
        }
        // Sadness-related keywords
        if (containsAny(lowerText, "sad", "unhappy", "depressed", "lonely", "hopeless", "cry", "miserable", "down")) {
            return "sadness";
        }
        // Anger-related keywords
        if (containsAny(lowerText, "angry", "mad", "furious", "frustrated", "annoyed", "hate")) {
            return "anger";
        }
        // Joy-related keywords
        if (containsAny(lowerText, "happy", "joy", "excited", "wonderful", "great", "amazing", "love", "glad")) {
            return "joy";
        }
        // Surprise-related keywords
        if (containsAny(lowerText, "surprised", "shocked", "unexpected", "wow", "omg")) {
            return "surprise";
        }
        
        return "neutral";
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String generateResponseBasedOnEmotion(String message, String emotion) {
        Map<String, String> responses = Map.of(
        "joy", "That's wonderful to hear! What's making you feel so joyful?",
        "sadness", "I'm here for you. Would you like to talk about what's bothering you?",
        "anger", "I hear your frustration. Let's work through this together.",
        "fear", "It's okay to feel anxious. Take a deep breath. You're safe here.",
        "love", "That's beautiful! Spreading love makes the world better.",
        "surprise", "Wow! That sounds unexpected. Tell me more!",
        "neutral", "Thank you for sharing. How else can I support you today?"
        );
        
        return responses.getOrDefault(emotion.toLowerCase(), 
            "I understand. Please continue sharing.");
    }
}
