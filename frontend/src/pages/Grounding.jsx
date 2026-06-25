import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Wind,
  Volume2,
  VolumeX
} from "lucide-react";
import toast from "react-hot-toast";

const Grounding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedExercise = location.state?.exercise;
  
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("inhale"); // inhale, hold, exhale, hold2
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  
  // Breathing pattern configurations
  const patterns = {
    "4-4-4-4": { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: "Box Breathing" },
    "4-7-8": { inhale: 4, hold: 7, exhale: 8, hold2: 0, name: "Relaxing Breath" },
    "5-5-5": { inhale: 5, hold: 0, exhale: 5, hold2: 0, name: "Equal Breathing" },
  };
  
  const [selectedPattern, setSelectedPattern] = useState("4-4-4-4");
  const pattern = patterns[selectedPattern];
  
  // Calculate current step duration
  const getCurrentDuration = () => {
    switch(phase) {
      case "inhale": return pattern.inhale;
      case "hold": return pattern.hold;
      case "exhale": return pattern.exhale;
      case "hold2": return pattern.hold2;
      default: return 4;
    }
  };
  
  // Play sound for breathing guidance
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      // Create audio context on user interaction (required by browsers)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      if (type === "inhale") {
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.1;
      } else if (type === "exhale") {
        oscillator.frequency.value = 392.00; // G4
        gainNode.gain.value = 0.1;
      } else if (type === "transition") {
        oscillator.frequency.value = 659.25; // E5
        gainNode.gain.value = 0.05;
      }
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3);
      oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
      console.log("Audio not supported");
    }
  }, [soundEnabled]);
  
  // Breathing circle animation size
  const getCircleSize = () => {
    const baseSize = 120;
    const maxSize = 200;
    
    if (phase === "inhale") {
      return baseSize + ((pattern.inhale - timeLeft) / pattern.inhale) * (maxSize - baseSize);
    } else if (phase === "exhale") {
      return maxSize - ((pattern.exhale - timeLeft) / pattern.exhale) * (maxSize - baseSize);
    } else {
      return baseSize;
    }
  };
  
  // Handle breathing cycle
  useEffect(() => {
    if (!isActive) return;
    
    const duration = getCurrentDuration();
    setTimeLeft(duration);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          clearInterval(intervalRef.current);
          
          setPhase((currentPhase) => {
            switch(currentPhase) {
              case "inhale":
                playSound("transition");
                if (pattern.hold > 0) return "hold";
                if (pattern.exhale > 0) return "exhale";
                return "inhale";
              case "hold":
                playSound("transition");
                if (pattern.exhale > 0) return "exhale";
                if (pattern.hold2 > 0) return "hold2";
                return "inhale";
              case "exhale":
                playSound("transition");
                if (pattern.hold2 > 0) return "hold2";
                setCycleCount(c => c + 1);
                return "inhale";
              case "hold2":
                playSound("transition");
                setCycleCount(c => c + 1);
                return "inhale";
              default:
                return "inhale";
            }
          });
          
          return getCurrentDuration();
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, phase, pattern, playSound]);
  
  // Play breathing guidance sounds
  useEffect(() => {
    if (isActive && timeLeft === getCurrentDuration()) {
      if (phase === "inhale") playSound("inhale");
      if (phase === "exhale") playSound("exhale");
    }
  }, [phase, timeLeft, isActive, getCurrentDuration, playSound]);
  
  const startExercise = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(pattern.inhale);
    setCycleCount(0);
    
    // Resume audio context if suspended
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };
  
  const pauseExercise = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(pattern.inhale);
    setCycleCount(0);
    clearInterval(intervalRef.current);
  };
  
  const getPhaseText = () => {
    switch(phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold2": return "Hold";
      default: return "Breathe";
    }
  };
  
  const getPhaseColor = () => {
    switch(phase) {
      case "inhale": return "text-sage-500";
      case "hold": return "text-amber-500";
      case "exhale": return "text-sage-400";
      default: return "text-sage-500";
    }
  };
  
  // If a specific exercise was selected from crisis page
  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/crisis")}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Resources
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-sage-800 mb-2">{selectedExercise.title}</h1>
            <p className="text-sage-600 mb-6">{selectedExercise.description}</p>
            
            <div className="space-y-4">
              {selectedExercise.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-sage-50 rounded-lg">
                  <span className="text-sage-500 font-bold">{index + 1}.</span>
                  <span className="text-sage-700">{step}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate("/grounding")}
              className="mt-8 w-full py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
            >
              Try Breathing Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/crisis")}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold text-sage-800">Mindful Breathing</h1>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-sage-100 rounded-full transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-sage-600" /> : <VolumeX className="w-5 h-5 text-sage-400" />}
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Pattern Selection */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {Object.entries(patterns).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                resetExercise();
                setSelectedPattern(key);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedPattern === key
                  ? "bg-sage-500 text-white shadow-md"
                  : "bg-white text-sage-600 hover:bg-sage-100"
              }`}
            >
              {value.name}
            </button>
          ))}
        </div>
        
        {/* Breathing Circle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div 
            className="relative flex items-center justify-center transition-all duration-300 ease-in-out"
            style={{ 
              width: getCircleSize(),
              height: getCircleSize()
            }}
          >
            <div className="absolute inset-0 bg-sage-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="w-full h-full bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className={`text-3xl font-bold text-white ${getPhaseColor()}`}>
                  {timeLeft}
                </div>
                <div className="text-sm text-white/80 mt-1">{getPhaseText()}</div>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 text-center">
            <p className="text-sage-600">
              {phase === "inhale" && "Fill your lungs gently..."}
              {phase === "hold" && "Pause and feel the stillness..."}
              {phase === "exhale" && "Release tension slowly..."}
              {phase === "hold2" && "Rest in the empty space..."}
            </p>
            {cycleCount > 0 && (
              <p className="text-sm text-sage-400 mt-2">Cycles completed: {cycleCount}</p>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isActive ? (
            <button
              onClick={startExercise}
              className="flex items-center gap-2 px-8 py-3 bg-sage-500 text-white rounded-full hover:bg-sage-600 transition-all shadow-md"
            >
              <Play className="w-5 h-5" />
              Start Breathing
            </button>
          ) : (
            <button
              onClick={pauseExercise}
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-md"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={resetExercise}
            className="p-3 bg-white text-sage-600 rounded-full hover:bg-sage-100 transition-all shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tips */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
          <h3 className="font-semibold text-sage-800 mb-3 flex items-center gap-2">
            <Wind className="w-4 h-4 text-sage-500" />
            Breathing Tips
          </h3>
          <ul className="space-y-2 text-sm text-sage-600">
            <li>💚 Find a comfortable position, either sitting or lying down</li>
            <li>💚 Place one hand on your chest and one on your belly</li>
            <li>💚 Breathe deeply into your belly, not just your chest</li>
            <li>💚 If you feel dizzy, return to normal breathing and try again later</li>
            <li>💚 Practice for 5-10 minutes daily for best results</li>
          </ul>
        </div>
        
        {/* Return to Chat Button */}
        <button
          onClick={() => navigate("/chat")}
          className="mt-8 w-full py-3 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors font-medium"
        >
          I feel calmer — Return to Chat 💚
        </button>
      </div>
    </div>
  );
};

export default Grounding;