package com.example.chatbot.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@SuppressWarnings("null")
public class EmotionServiceClient {
    
    private final WebClient webClient;
    
    public EmotionServiceClient(@Value("${emotion.service.url:http://localhost:5000}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
    
    public Mono<EmotionResponse> analyzeEmotion(String text) {
        return webClient.post()
                .uri("/analyze")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(EmotionResponse.class);
    }
    
    public Mono<SimpleEmotionResponse> analyzeEmotionSimple(String text) {
        return webClient.post()
                .uri("/analyze/simple")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(SimpleEmotionResponse.class);
    }
}