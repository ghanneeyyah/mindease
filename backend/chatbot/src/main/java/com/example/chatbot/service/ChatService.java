package com.example.chatbot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
import com.example.chatbot.model.dto.SaveBotMessageRequest;
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

    private static final double CONFIDENCE_THRESHOLD = 0.6;

    @Transactional
    public ChatSessionResponse createSession(CreateChatSession request) {
        User user = userRepo.findById(request.getUserId())
            .orElseThrow(() -> new UserNotFound(request.getUserId()));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        return chatSessionRepo
            .findTodaysSession(request.getUserId(), startOfDay, endOfDay)
            .map(existingSession -> {
                log.info("Returning existing session {} for user {}", existingSession.getId(), request.getUserId());
                return mapToResponse(existingSession);
            })
            .orElseGet(() -> {
                log.info("Creating new session for user {}", request.getUserId());
                ChatSession session = new ChatSession();
                session.setUser(user);
                session.setStatus(Status.ACTIVE);
                session.setSessionStartTime(LocalDateTime.now());
                session.setSessionEndTime(LocalDateTime.now());
                ChatSession savedSession = chatSessionRepo.save(session);
                return mapToResponse(savedSession);
            });
    }

    /**
     * Saves the user message with emotion analysis and returns it.
     * Does NOT generate or save a bot response — that comes from Gemini via the frontend.
     */
    @Transactional
    public ChatResponse processMessage(ChatRequest request) {
        Long sessionId = request.getSessionId();
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        ChatSession session = chatSessionRepo.findById(sessionId)
            .orElseThrow(() -> new ChatSessionNotFound(sessionId));

        // Save user message
        Message userMessage = new Message();
        userMessage.setChatSession(session);
        userMessage.setText(request.getText());
        userMessage.setSenderType("USER");
        userMessage.setTimestamp(LocalDateTime.now());

        // Emotion analysis — used as metadata only, not to generate response
        String sentiment;
        try {
            SimpleEmotionResponse emotionResponse = emotionClient
                    .analyzeEmotionSimple(request.getText())
                    .block();

            if (emotionResponse != null && emotionResponse.getConfidence() >= CONFIDENCE_THRESHOLD) {
                sentiment = emotionResponse.getEmotion();
                log.info("Emotion detected: {} with confidence: {}", sentiment, emotionResponse.getConfidence());
            } else {
                sentiment = detectEmotionByKeywords(request.getText());
                log.warn("Low confidence emotion, using keyword fallback: {}", sentiment);
            }
        } catch (Exception e) {
            log.error("Emotion service unreachable, using keyword fallback", e);
            sentiment = detectEmotionByKeywords(request.getText());
        }

        userMessage.setSentimentLabel(sentiment);
        Message savedUserMessage = messageRepo.save(userMessage);

        // Update session end time
        session.setSessionEndTime(LocalDateTime.now());
        chatSessionRepo.save(session);

        return mapToChatResponse(savedUserMessage);
    }

    /**
     * Saves the Gemini-generated bot response sent back from the frontend.
     */
    @Transactional
    public ChatResponse saveBotMessage(SaveBotMessageRequest request) {
        ChatSession session = chatSessionRepo.findById(request.getSessionId())
            .orElseThrow(() -> new ChatSessionNotFound(request.getSessionId()));

        Message botMessage = new Message();
        botMessage.setChatSession(session);
        botMessage.setText(request.getText());
        botMessage.setSenderType("BOT");
        botMessage.setTimestamp(LocalDateTime.now());

        session.setSessionEndTime(LocalDateTime.now());
        chatSessionRepo.save(session);

        return mapToChatResponse(messageRepo.save(botMessage));
    }

    @Transactional
    public List<ChatResponse> getSessionMessages(Long sessionId) {
        List<Message> messages = messageRepo.findByChatSessionId(sessionId);
        return messages.stream()
                .map(this::mapToChatResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ChatSessionResponse> getUserSessions(Long userId) {
        return chatSessionRepo
            .findByUserIdOrderBySessionStartTimeDesc(userId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
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

    private String detectEmotionByKeywords(String text) {
        String lowerText = text.toLowerCase();
        if (containsAny(lowerText, "scared", "afraid", "fear", "terrified", "unsafe", "danger", "worried", "anxious")) return "fear";
        if (containsAny(lowerText, "sad", "unhappy", "depressed", "lonely", "hopeless", "cry", "miserable", "down")) return "sadness";
        if (containsAny(lowerText, "angry", "mad", "furious", "frustrated", "annoyed", "hate")) return "anger";
        if (containsAny(lowerText, "happy", "joy", "excited", "wonderful", "great", "amazing", "love", "glad")) return "joy";
        if (containsAny(lowerText, "surprised", "shocked", "unexpected", "wow", "omg")) return "surprise";
        return "neutral";
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }
}