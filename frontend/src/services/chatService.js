import { api } from "./api";

export const chatService = {
  // Create a new chat session (or return today's existing one)
  createSession: async (userId) => {
    const response = await api.post("/chat/session", { userId });
    return response.data;
  },

  // Alias for clarity — backend always returns today's session or creates one
  getTodaySession: async (userId) => {
    const response = await api.post("/chat/session", { userId });
    return response.data;
  },

  // Get all sessions for a user (newest first)
  getUserSessions: async (userId) => {
    const response = await api.get(`/chat/sessions/${userId}`);
    return response.data;
  },

  // Get messages for a session
  getMessages: async (sessionId) => {
    const response = await api.get(`/chat/messages/${sessionId}`);
    return response.data;
  },

  // Send a message and get response
  sendMessage: async (sessionId, text) => {
    const response = await api.post("/chat/message", { sessionId, text });
    return response.data;
  },

  // End a session
  endSession: async (sessionId) => {
    const response = await api.put(`/chat/session/${sessionId}/end`);
    return response.data;
  },

  saveBotMessage: async (sessionId, text) => {
    const response = await api.post("/chat/message/bot", { sessionId, text });
    return response.data;
  },
};
