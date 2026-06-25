import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
    };
    
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Couldn't recognize speech. Please try again.");
    };
    
    recognition.start();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-sage-200 p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share how you're feeling... 🌿"
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 pr-24 rounded-2xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none resize-none transition-all bg-white text-sage-700 placeholder-sage-300 disabled:bg-sage-50 disabled:cursor-not-allowed"
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={disabled}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? "bg-red-100 text-red-500 animate-pulse" 
                    : "text-sage-400 hover:text-sage-600 hover:bg-sage-100"
                }`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="p-2 rounded-full bg-sage-500 text-white hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
        
        {/* Quick action buttons */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {["I'm feeling anxious", "I'm lonely", "Bad day", "Good news", "Need advice"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(suggestion)}
              disabled={disabled}
              className="px-3 py-1.5 bg-sage-100 text-sage-600 rounded-full text-sm whitespace-nowrap hover:bg-sage-200 transition-colors disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;