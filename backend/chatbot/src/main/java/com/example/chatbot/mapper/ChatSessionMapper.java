package com.example.chatbot.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.chatbot.model.dto.ChatSessionResponse;
import com.example.chatbot.model.dto.CreateChatSession;
import com.example.chatbot.model.entity.ChatSession;

//@Mapper(componentModel = "spring", uses = {MessageMapper.class})
public interface ChatSessionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true) // Will be set in service
    @Mapping(target = "sessionStartTime", ignore = true)
    @Mapping(target = "sessionEndTime", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "messages", ignore = true)
    ChatSession toEntity(CreateChatSession request);

    @Mapping(source = "id", target = "sessionId")
    ChatSessionResponse toResponse(ChatSession chatSession);

    List<ChatSessionResponse> toResponseList(List<ChatSession> chatSessions);
}