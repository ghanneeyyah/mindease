import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { chatService } from "../services/chatService";
import { emotionService } from "../services/emotionService";
import MessageBubble from "../components/Chat/MessageBubble";
import MessageInput from "../components/Chat/MessageInput";
import CrisisAlert from "../components/Crisis/CrisisAlert";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { Bot, AlertTriangle, ArrowLeft, CalendarDays, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sessions, setSessions] = useState([]);
  const [todaySessionId, setTodaySessionId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const todaySession = await chatService.getTodaySession(user.id);
        const todayId = todaySession.sessionId;
        setTodaySessionId(todayId);

        const allSessions = await chatService.getUserSessions(user.id);
        setSessions(allSessions || []);

        const navState = location.state;
        const targetId = navState?.sessionId || todayId;
        setCurrentSessionId(targetId);

        const history = await chatService.getMessages(targetId);
        if (!history || history.length === 0) {
          setMessages([{
            messageId: Date.now(),
            text: "Hi, I'm MindEase. 🌿 I'm here to listen without judgment. How are you feeling today?",
            senderType: "BOT",
            timestamp: new Date().toISOString(),
          }]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        toast.error("Couldn't load chat. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [user]);

  const switchSession = async (sessionId) => {
    if (!sessionId || sessionId === currentSessionId) {
      setSidebarOpen(false);
      return;
    }
    setIsLoadingMessages(true);
    setSidebarOpen(false);
    try {
      const history = await chatService.getMessages(sessionId);
      setCurrentSessionId(sessionId);
      setMessages(history || []);
    } catch (error) {
      console.error("Failed to load session:", error);
      toast.error("Couldn't load that conversation.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Converts your existing `messages` state (from Java) into the
  // { role, text } shape Gemini/Python expects, oldest-first.
  // Excludes the message currently being sent — that goes separately.
  const buildHistoryForGemini = (msgs, maxTurns = 20) => {
    const trimmed = msgs.slice(-(maxTurns * 2)); // keep it bounded
    return trimmed.map((m) => ({
      role: m.senderType === "USER" ? "user" : "model",
      text: m.text,
    }));
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !currentSessionId) return;

    // Build history from current messages BEFORE we optimistically add the new one
    const historyForGemini = buildHistoryForGemini(messages);

    // Optimistically show user message
    const tempUserMessage = {
      messageId: Date.now(),
      text,
      senderType: "USER",
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setIsTyping(true);

    try {
      // Step 1: Save user message to Java, get emotion analysis back
      await chatService.sendMessage(currentSessionId, text);

      // Step 2: Get Gemini response from Python emotion service, WITH conversation history
      const emotionResponse = await emotionService.analyzeAndRespond(text, historyForGemini);

      // Step 3: Save Gemini bot response to Java
      await chatService.saveBotMessage(currentSessionId, emotionResponse.bot_response);

      // Crisis detection
      const crisisKeywords = ["kill myself", "suicide", "end my life", "hurt myself", "want to die"];
      const isCrisis = crisisKeywords.some(kw => text.toLowerCase().includes(kw))
        || emotionResponse.detected_emotion === "crisis";

      if (isCrisis) setCrisisDetected(true);

      // Step 4: Display Gemini response
      setMessages(prev => [...prev, {
        messageId: Date.now() + 1,
        text: emotionResponse.bot_response,
        senderType: "BOT",
        timestamp: new Date().toISOString(),
        emotion: emotionResponse.detected_emotion,
        confidence: emotionResponse.confidence,
      }]);

      if (isCrisis) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            messageId: Date.now() + 2,
            text: "💚 Your safety matters. Would you like me to share some resources that might help right now? Just type 'help' or tap the crisis button above.",
            senderType: "BOT",
            timestamp: new Date().toISOString(),
          }]);
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, {
        messageId: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please take a deep breath and try again in a moment. 🌿",
        senderType: "BOT",
        timestamp: new Date().toISOString(),
      }]);
      toast.error("Connection issue. Using offline support mode.");
    } finally {
      setIsTyping(false);
    }
  };

  const goToToday = () => switchSession(todaySessionId);

  const isViewingToday = currentSessionId === todaySessionId;
  const currentSession = sessions.find(s => s.sessionId === currentSessionId);

  const handleCrisisHelp = () => navigate("/crisis", { state: { returnTo: "/chat" } });
  const dismissCrisis = () => setCrisisDetected(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sage-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-sage-50 to-sage-100 overflow-hidden">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-sage-200 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-sage-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-sage-600" />
            <span className="font-semibold text-sage-800">Journal History</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-sage-100 rounded-full">
            <X className="w-4 h-4 text-sage-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-sage-400 text-center mt-8 px-4">No previous conversations yet.</p>
          ) : (
            sessions.map(session => {
              const isActive = session.sessionId === currentSessionId;
              const isTodayEntry = session.sessionId === todaySessionId;
              return (
                <button
                  key={session.sessionId}
                  onClick={() => switchSession(session.sessionId)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-l-4
                    ${isActive
                      ? "bg-sage-50 border-sage-500 text-sage-800"
                      : "border-transparent hover:bg-sage-50 text-sage-600 hover:text-sage-800"
                    }`}
                >
                  <CalendarDays className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sage-500" : "text-sage-400"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{session.dateLabel}</p>
                    {isTodayEntry && <span className="text-xs text-sage-400">Today</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-sage-100">
          <p className="text-xs text-sage-400 text-center">One journal entry per day</p>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="p-2 hover:bg-sage-100 rounded-full transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-sage-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-sage-800">MindEase</h1>
                  <p className="text-xs text-sage-500">{currentSession?.dateLabel || "Always here to listen"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-sage-100 rounded-full transition-colors"
                title="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-sage-600" />
              </button>
              <button
                onClick={handleCrisisHelp}
                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                title="Emergency help"
              >
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {crisisDetected && <CrisisAlert onClose={dismissCrisis} onGetHelp={handleCrisisHelp} />}

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {!isViewingToday && (
                <div className="text-center py-2 px-4 bg-sage-100 rounded-xl text-sm text-sage-500">
                  📖 You're reading a past journal entry.{" "}
                  <button onClick={goToToday} className="text-sage-700 underline font-medium hover:text-sage-900">
                    Go to today
                  </button>
                </div>
              )}

              {messages.map((message, index) => (
                <MessageBubble
                  key={message.messageId || index}
                  message={message}
                  isUser={message.senderType === "USER"}
                />
              ))}

              {isTyping && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-sage-600" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-sage-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input or past-entry bar */}
        {isViewingToday ? (
          <MessageInput onSendMessage={sendMessage} disabled={isTyping} />
        ) : (
          <div className="bg-white/80 border-t border-sage-200 px-4 py-3 text-center">
            <p className="text-sm text-sage-400">
              This is a past entry.{" "}
              <button onClick={goToToday} className="text-sage-600 underline font-medium hover:text-sage-800">
                Go to today
              </button>
            </p>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-sm border-t border-sage-100 py-2 px-4 text-center">
          <p className="text-xs text-sage-400">
            💚 MindEase is an AI companion, not a crisis service. If this is an emergency, call 988.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;