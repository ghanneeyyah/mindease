import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavigationBar from "../components/TopNavigationBar";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi. I'm here to listen. How are you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Very simple local crisis detection for demo
    const crisisKeywords = ['hurt', 'die', 'kill', 'suicide', 'alone', 'end it'];
    const isCrisis = crisisKeywords.some(keyword => userMsg.text.toLowerCase().includes(keyword));
    
    if (isCrisis) {
      setIsCrisisMode(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "I hear how much pain you're in right now. I'm worried about you. Would you like to talk, or try a grounding exercise?", 
          sender: "bot",
          detectedEmotion: "sad/crisis",
          showOptions: true
        }]);
      }, 1000);
      return;
    }

    try {
      // Backend integration mock (will work if backend running)
      // We assume sessionId is 1 for now if we didn't fetch it
      const currentSessionId = sessionId || 1;
      
      const response = await fetch("http://localhost:8080/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId, text: userMsg.text })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.text || "I understand.",
          sender: "bot",
          detectedEmotion: data.detectedEmotion || "neutral"
        }]);
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      // Fallback response if backend is offline
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "I hear that. You're not alone. I'm listening.", 
          sender: "bot",
          detectedEmotion: "neutral"
        }]);
      }, 1000);
    }
  };

  return (
    <div className="content-area fade-in" style={{ padding: 0, backgroundColor: isCrisisMode ? 'var(--crisis-bg)' : 'var(--bg-primary)' }}>
      {isCrisisMode && (
        <div style={{
          backgroundColor: 'var(--crisis-accent)',
          color: 'var(--bg-panel)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
            <strong>I'm worried about you. Here's help →</strong>
          </div>
          <Link to="/crisis" style={{ color: 'var(--bg-panel)', textDecoration: 'underline' }}>View</Link>
        </div>
      )}
      
      <TopNavigationBar 
        title="Chat with MindEase" 
        rightAction={
          <Link to="/crisis" style={{ color: 'var(--crisis-accent)' }}>
            <i className="fa-solid fa-truck-medical"></i>
          </Link>
        } 
      />

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === "user" ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.sender === "user" ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              backgroundColor: msg.sender === "user" ? 'var(--accent-primary)' : 'var(--bg-panel)',
              color: msg.sender === "user" ? 'white' : 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: msg.sender === "user" ? '16px 16px 0 16px' : '16px 16px 16px 0',
              boxShadow: 'var(--shadow-soft)'
            }}>
              {msg.text}
            </div>
            
            {msg.detectedEmotion && (
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                [Detected: {msg.detectedEmotion}]
              </span>
            )}

            {msg.showOptions && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>Talk</button>
                <Link to="/breathing" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', textDecoration: 'none' }}>Grounding</Link>
                <Link to="/crisis" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', textDecoration: 'none' }}>Hotlines</Link>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-panel)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        position: 'sticky',
        bottom: 'var(--bottom-nav-height)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid #ddd',
              backgroundColor: 'var(--bg-primary)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button 
            onClick={handleSend}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          ⚠️ Emergency? Tap <i className="fa-solid fa-truck-medical"></i> or call 988.
        </p>
      </div>
    </div>
  );
}
