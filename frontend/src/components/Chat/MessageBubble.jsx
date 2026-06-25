import { useState } from "react";
import { Smile, Frown, Heart, Zap, Meh, AlertTriangle } from "lucide-react";

const emotionIcons = {
  joy: { icon: Smile, color: "text-yellow-500", label: "Joy" },
  sadness: { icon: Frown, color: "text-blue-400", label: "Sadness" },
  anger: { icon: Zap, color: "text-red-400", label: "Anger" },
  fear: { icon: AlertTriangle, color: "text-purple-400", label: "Fear" },
  love: { icon: Heart, color: "text-pink-400", label: "Love" },
  neutral: { icon: Meh, color: "text-gray-400", label: "Neutral" },
  crisis: { icon: AlertTriangle, color: "text-crisis-500", label: "Needs Support" },
};

const MessageBubble = ({ message, isUser }) => {
  const [showEmotion, setShowEmotion] = useState(false);
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const EmotionBadge = () => {
    if (!message.emotion) return null;
    const emotion = emotionIcons[message.emotion] || emotionIcons.neutral;
    const EmotionIcon = emotion.icon;
    
    return (
      <div 
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-help transition-opacity ${
          isUser ? 'bg-sage-400 text-white' : 'bg-sage-100 text-sage-600'
        }`}
        onMouseEnter={() => setShowEmotion(true)}
        onMouseLeave={() => setShowEmotion(false)}
        title={`Detected emotion: ${emotion.label} (${Math.round(message.confidence * 100)}% confidence)`}
      >
        <EmotionIcon className={`w-3 h-3 ${isUser ? 'text-white' : emotion.color}`} />
        <span className="text-xs">{emotion.label}</span>
        {showEmotion && (
          <span className="ml-1 text-[10px] opacity-75">
            {Math.round(message.confidence * 100)}%
          </span>
        )}
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 animate-fade-in">
        <div className="flex items-center gap-2 max-w-[85%]">
          <div className="message-user">
            <p className="text-white whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-sage-400">
          {message.emotion && <EmotionBadge />}
          <span>{timestamp}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 animate-fade-in group">
      <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-sage-600 text-sm">🌿</span>
      </div>
      <div className="flex-1">
        <div className="message-bot">
          <p className="text-sage-700 whitespace-pre-wrap break-words leading-relaxed">
            {message.text}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-sage-400">
          {message.emotion && <EmotionBadge />}
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;