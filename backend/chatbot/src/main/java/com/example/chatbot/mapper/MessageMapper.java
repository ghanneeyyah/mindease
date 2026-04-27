package com.example.chatbot.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.chatbot.model.dto.ChatRequest;
import com.example.chatbot.model.dto.ChatResponse;
import com.example.chatbot.model.entity.Message;

//@Mapper(componentModel = "spring")
public interface MessageMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "chatSession", ignore = true)
    @Mapping(target = "sentimentLabel", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    @Mapping(target = "senderType", constant = "USER") // Set default sender type
    Message toEntity(ChatRequest request);

    @Mapping(source = "id", target = "messageId")
    @Mapping(source = "chatSession.id", target = "sessionId")
    ChatResponse toResponse(Message message);

    List<ChatResponse> toResponseList(List<Message> messages);
}