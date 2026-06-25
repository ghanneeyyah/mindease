import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  Download, 
  Copy, 
  Check,
  ArrowLeft,
  ExternalLink,
  Clock,
  Users,
  Moon,
  Sun
} from "lucide-react";
import toast from "react-hot-toast";

const Crisis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/chat";
  const [copiedHotline, setCopiedHotline] = useState(null);
  const [safetyPlan, setSafetyPlan] = useState({
    triggers: "",
    people: "",
    places: "",
  });

  // Crisis resources data
  const hotlines = [
    {
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description: "Free, confidential support 24/7 for people in distress",
      icon: Phone,
      color: "bg-blue-500",
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to connect with a crisis counselor",
      icon: MessageCircle,
      color: "bg-purple-500",
      isText: true,
    },
    {
      name: "SAMHSA Helpline",
      number: "1-800-662-4357",
      description: "Substance abuse and mental health support",
      icon: Shield,
      color: "bg-green-500",
    },
    {
      name: "The Trevor Project",
      number: "1-866-488-7386",
      description: "Crisis support for LGBTQ+ youth",
      icon: Heart,
      color: "bg-pink-500",
    },
  ];

  const groundingExercises = [
    {
      id: "54321",
      title: "5-4-3-2-1 Senses",
      description: "A grounding technique to bring you to the present moment",
      steps: [
        "👁️ 5 things you can SEE",
        "🤚 4 things you can TOUCH",
        "👂 3 things you can HEAR",
        "👃 2 things you can SMELL",
        "👅 1 thing you can TASTE",
      ],
      duration: "2 minutes",
    },
    {
      id: "breathing",
      title: "Box Breathing",
      description: "Calm your nervous system with rhythmic breathing",
      steps: [
        "💨 Inhale for 4 seconds",
        "⏸️ Hold for 4 seconds",
        "🌬️ Exhale for 4 seconds",
        "⏸️ Hold for 4 seconds",
      ],
      duration: "1 minute",
    },
    {
      id: "temperature",
      title: "Temperature Change",
      description: "Quick physical reset technique",
      steps: [
        "🧊 Splash cold water on your face",
        "❄️ Hold an ice cube in your hand",
        "🍃 Step outside for fresh air",
      ],
      duration: "30 seconds",
    },
  ];

  const copyToClipboard = (text, hotlineName) => {
    navigator.clipboard.writeText(text);
    setCopiedHotline(hotlineName);
    toast.success(`${hotlineName} number copied!`);
    setTimeout(() => setCopiedHotline(null), 2000);
  };

  const downloadSafetyPlan = () => {
    const content = `
MY SAFETY PLAN

Date: ${new Date().toLocaleDateString()}

1. My Triggers (situations, thoughts, or feelings that might lead to crisis):
${safetyPlan.triggers || "_________________________________"}

2. People I Can Call for Support:
${safetyPlan.people || "_________________________________"}

3. Places That Calm Me:
${safetyPlan.places || "_________________________________"}

4. Professional Helplines:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line: Text HOME to 741741

5. Things That Help Me Feel Better:
- Deep breathing exercises
- Going for a walk
- Listening to calming music
- Talking to someone I trust

Remember: You are not alone. Help is always available.
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safety-plan-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Safety plan downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sage-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(returnTo)}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold text-sage-800">Safety Resources</h1>
          <div className="w-16"></div> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-crisis-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You matter. 💚</h2>
              <p className="text-white/90 mb-4">
                If you're in immediate danger or having thoughts of harming yourself, 
                please reach out right now. These resources are available 24/7.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.href = "tel:988"}
                  className="bg-white text-crisis-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call 988 Now
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("741741");
                    toast.success("Text HOME to 741741");
                  }}
                  className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Text HOME to 741741
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hotlines Section */}
        <section>
          <h2 className="text-xl font-semibold text-sage-800 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-crisis-500" />
            Immediate Support Hotlines
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {hotlines.map((hotline) => {
              const Icon = hotline.icon;
              return (
                <div
                  key={hotline.name}
                  className="bg-white rounded-xl shadow-sm border border-sage-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${hotline.color} rounded-full p-2 text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sage-800">{hotline.name}</h3>
                      <p className="text-sm text-sage-500 mt-1">{hotline.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => {
                            if (hotline.isText) {
                              navigator.clipboard.writeText(hotline.number);
                              toast.success(`Text HOME to ${hotline.number}`);
                            } else {
                              window.location.href = `tel:${hotline.number.replace(/-/g, '')}`;
                            }
                          }}
                          className="text-sage-600 font-medium text-sm hover:text-sage-800"
                        >
                          {hotline.isText ? `Text ${hotline.number}` : `Call ${hotline.number}`}
                        </button>
                        <button
                          onClick={() => copyToClipboard(hotline.number, hotline.name)}
                          className="p-1 hover:bg-sage-100 rounded transition-colors"
                        >
                          {copiedHotline === hotline.name ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-sage-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Grounding Exercises Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-sage-500" />
              Grounding Exercises
            </h2>
            <button
              onClick={() => navigate("/grounding")}
              className="text-sage-500 hover:text-sage-600 text-sm font-medium flex items-center gap-1"
            >
              View all exercises
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {groundingExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => navigate("/grounding", { state: { exercise } })}
                className="bg-white rounded-xl shadow-sm border border-sage-100 p-5 text-left hover:shadow-md transition-all hover:scale-[1.02]"
              >
                <h3 className="font-semibold text-sage-800 mb-2">{exercise.title}</h3>
                <p className="text-sm text-sage-500 mb-3">{exercise.description}</p>
                <div className="flex items-center gap-2 text-xs text-sage-400">
                  <Clock className="w-3 h-3" />
                  <span>{exercise.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Safety Plan Builder */}
        <section className="bg-white rounded-xl shadow-sm border border-sage-100 p-6">
          <h2 className="text-xl font-semibold text-sage-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sage-500" />
            Create Your Safety Plan
          </h2>
          <p className="text-sage-600 mb-4">
            A personalized plan can help you navigate difficult moments. Fill this out for yourself.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                What situations, thoughts, or feelings might trigger a crisis for you?
              </label>
              <textarea
                value={safetyPlan.triggers}
                onChange={(e) => setSafetyPlan({ ...safetyPlan, triggers: e.target.value })}
                placeholder="e.g., Feeling overwhelmed at work, arguments with loved ones, lack of sleep..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Who can you reach out to for support? (Friends, family, therapist)
              </label>
              <textarea
                value={safetyPlan.people}
                onChange={(e) => setSafetyPlan({ ...safetyPlan, people: e.target.value })}
                placeholder="e.g., Sarah (555-123-4567), My brother Tom, Dr. Martinez"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                What places or activities help you feel calm?
              </label>
              <textarea
                value={safetyPlan.places}
                onChange={(e) => setSafetyPlan({ ...safetyPlan, places: e.target.value })}
                placeholder="e.g., The park near my house, listening to music, taking a warm bath"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none"
              />
            </div>
          </div>
          
          <button
            onClick={downloadSafetyPlan}
            className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download My Safety Plan
          </button>
        </section>

        {/* Additional Tips */}
        <section className="bg-sage-50 rounded-xl p-6">
          <h3 className="font-semibold text-sage-800 mb-3">Remember You're Not Alone</h3>
          <div className="grid gap-3 text-sm text-sage-600">
            <p>💚 Most people who reach out for help feel better afterward</p>
            <p>💚 Difficult feelings are temporary, even when they feel overwhelming</p>
            <p>💚 You deserve support and care, exactly as you are right now</p>
            <p>💚 There is always someone who wants to listen</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Crisis;