import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const BASE_URL = "http://localhost:8081";

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const quickActions = [
  "I'm feeling anxious",
  "I need to talk",
  "I'm feeling overwhelmed",
  "I'm doing okay today",
];

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const existingSessionId = searchParams.get("session");

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        if (existingSessionId) {
          // Load existing session history
          const res = await fetch(`${BASE_URL}/api/chat/messages/${existingSessionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to load session");
          const data = await res.json();

          setSessionId(Number(existingSessionId));
          setMessages(
            data.map((m) => ({
              id: m.messageId,
              text: m.text,
              senderType: m.senderType,
              timestamp: m.timestamp,
              sentimentLabel: m.sentimentLabel,
            }))
          );
          setShowQuickActions(data.length === 0);
        } else {
          // Create a new session
          const res = await fetch(`${BASE_URL}/api/chat/session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: Number(userId) }),
          });
          if (!res.ok) throw new Error("Failed to create session");
          const data = await res.json();

          setSessionId(data.sessionId);
          setMessages([
            {
              id: Date.now(),
              text: "Hello! I'm MindEase. How are you feeling today?",
              senderType: "BOT",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        setError("Couldn't load this chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [existingSessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || !sessionId) return;

    const userMsg = {
      id: Date.now(),
      text,
      senderType: "USER",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setShowQuickActions(false);
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, text }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const botMsg = await res.json();
      setMessages((prev) => [...prev, {
        id: botMsg.messageId,
        text: botMsg.text,
        senderType: "BOT",
        timestamp: botMsg.timestamp,
        sentimentLabel: botMsg.sentimentLabel,
      }]);
    } catch (err) {
      setError("Couldn't send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-white">
        <p className="text-gray-400 text-sm">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-white">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm text-center px-4 py-2 border-b border-red-100">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.senderType === "USER"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 text-right ${
                msg.senderType === "USER" ? "text-blue-100" : "text-gray-400"
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-400"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showQuickActions && (
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="whitespace-nowrap text-sm px-4 py-2 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="How are you feeling?"
            className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChatPage;