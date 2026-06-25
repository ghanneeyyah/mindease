const emotionGradients = {
  joy: "from-yellow-400 to-orange-400",
  sadness: "from-blue-400 to-indigo-400",
  anger: "from-red-400 to-orange-400",
  fear: "from-purple-400 to-pink-400",
  love: "from-pink-400 to-rose-400",
  neutral: "from-gray-400 to-slate-400",
  crisis: "from-crisis-500 to-crisis-600",
};

const emotionLabels = {
  joy: "Joyful 😊",
  sadness: "Sad 💙",
  anger: "Frustrated 😤",
  fear: "Anxious 🫣",
  love: "Loving 💚",
  neutral: "Neutral 😐",
  crisis: "Needs Support 🚨",
};

const EmotionBadge = ({ emotion, confidence, size = "sm" }) => {
  if (!emotion) return null;
  
  const gradient = emotionGradients[emotion] || emotionGradients.neutral;
  const label = emotionLabels[emotion] || emotion;
  const confidencePercent = Math.round((confidence || 0) * 100);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${gradient} text-white rounded-full ${sizeClasses[size]} shadow-sm`}>
      <span>{label}</span>
      {confidence && (
        <span className="text-white/80 text-[10px] font-mono">
          {confidencePercent}%
        </span>
      )}
    </div>
  );
};

export default EmotionBadge;