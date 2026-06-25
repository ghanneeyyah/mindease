import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Shield, 
  Brain,
  MessageCircle,
  Lock,
  Database,
  Smartphone,
  Globe,
  HelpCircle,
  AlertCircle,
  Phone,
  BookOpen,
  Users,
  Clock,
  Download,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState({
    general: true,
    privacy: false,
    technical: false,
    mentalHealth: false,
    billing: false,
    safety: false
  });

  const [openQuestions, setOpenQuestions] = useState({});

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const FAQSection = ({ title, icon: Icon, category, questions }) => (
    <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
      <button
        onClick={() => toggleCategory(category)}
        className="w-full p-5 flex items-center justify-between hover:bg-sage-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-sage-800">{title}</h2>
        </div>
        {openCategories[category] ? (
          <ChevronUp className="w-5 h-5 text-sage-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-sage-500" />
        )}
      </button>
      
      <AnimatePresence>
        {openCategories[category] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-sage-100"
          >
            <div className="p-5 space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="border-b border-sage-100 last:border-0">
                  <button
                    onClick={() => toggleQuestion(`${category}-${idx}`)}
                    className="w-full py-3 flex items-center justify-between text-left hover:text-sage-600 transition-colors"
                  >
                    <span className="font-medium text-sage-800">{q.question}</span>
                    {openQuestions[`${category}-${idx}`] ? (
                      <ChevronUp className="w-4 h-4 text-sage-500 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-sage-500 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openQuestions[`${category}-${idx}`] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pb-3 text-sage-600 leading-relaxed"
                      >
                        {typeof q.answer === 'string' ? (
                          <p>{q.answer}</p>
                        ) : (
                          <div className="space-y-2">
                            {q.answer.map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </div>
                        )}
                        {q.link && (
                          <button
                            onClick={() => navigate(q.link)}
                            className="mt-3 text-sage-500 hover:text-sage-600 text-sm font-medium inline-flex items-center gap-1"
                          >
                            Learn more →
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const faqData = {
    general: [
      {
        question: "What is MindEase?",
        answer: "MindEase is an AI-powered mental health companion app that provides a safe, private space for you to express your feelings, track your emotions, and receive empathetic support. It's designed to be a gentle tool for emotional wellness, available 24/7."
      },
      {
        question: "How does MindEase work?",
        answer: [
          "1. You sign up for a free account",
          "2. Start a conversation with our AI companion",
          "3. Share your thoughts, feelings, or daily experiences",
          "4. Our AI detects emotions and responds with empathy",
          "5. Track your emotional patterns over time",
          "6. Access grounding exercises and crisis resources when needed"
        ]
      },
      {
        question: "Is MindEase free?",
        answer: "Yes! MindEase offers a completely free tier with all core features. We believe mental health support should be accessible to everyone. There are no hidden fees or premium paywalls for essential features."
      },
      {
        question: "Who is MindEase for?",
        answer: "MindEase is for anyone looking for emotional support, whether you're dealing with daily stress, anxiety, sadness, or just need someone to talk to. It's suitable for adults and teens (13+) who want a private space to process their feelings."
      }
    ],
    privacy: [
      {
        question: "Is my data private and secure?",
        answer: "Absolutely. Your conversations are stored locally on your device. We don't have access to your chat history unless you choose to export it. You have full control to delete your data at any time."
      },
      {
        question: "Where is my data stored?",
        answer: "All your conversations, mood history, and settings are stored locally in your browser's storage. We don't maintain cloud servers that store your personal conversations. You can export or delete your data anytime."
      },
      {
        question: "Can I delete my data?",
        answer: "Yes! In the Settings page, you'll find options to clear all your data, delete individual conversations, or export your data before deletion. You're always in control of your information."
      },
      {
        question: "Do you sell my data?",
        answer: "Never. We don't sell, trade, or share your personal data with third parties. Your privacy and trust are our top priorities. Our business model is not based on selling user data."
      }
    ],
    technical: [
      {
        question: "What devices does MindEase work on?",
        answer: "MindEase is a web-based application that works on any device with a modern browser - smartphones, tablets, laptops, and desktop computers. It's fully responsive and optimized for all screen sizes."
      },
      {
        question: "Do I need to download an app?",
        answer: "No download needed! MindEase works directly in your browser. You can also add it to your phone's home screen as a Progressive Web App (PWA) for an app-like experience."
      },
      {
        question: "Is there a mobile app?",
        answer: "Currently, MindEase is available as a web app that works beautifully on mobile browsers. We're planning native iOS and Android apps for the future. For now, you can add MindEase to your home screen for quick access."
      },
      {
        question: "What happens if I lose internet connection?",
        answer: "MindEase requires an internet connection for the AI responses. However, your chat history and settings are stored locally and will sync when you reconnect. Crisis resources are cached for offline access."
      },
      {
        question: "How does the emotion detection work?",
        answer: "We use a Hugging Face machine learning model that analyzes the text you share to detect emotional states like joy, sadness, anxiety, anger, and more. This helps our AI provide more empathetic and relevant responses. You can disable emotion detection in Settings if you prefer not to use it."
      }
    ],
    mentalHealth: [
      {
        question: "Can MindEase replace therapy?",
        answer: "No. MindEase is a supportive companion tool, not a replacement for professional mental health care. If you're experiencing severe mental health issues, please consult a licensed therapist or psychiatrist. MindEase can complement professional care but should not replace it."
      },
      {
        question: "What if I'm in crisis?",
        answer: [
          "If you're in immediate danger or having thoughts of harming yourself, please stop using the app and contact emergency services immediately:",
          "",
          "📞 Call 988 (Suicide & Crisis Lifeline) - Available 24/7",
          "📱 Text HOME to 741741 for crisis counseling",
          "🚑 Call 911 for medical emergencies",
          "",
          "MindEase has crisis detection and will show resources, but it cannot replace immediate professional help."
        ]
      },
      {
        question: "What emotions can the AI detect?",
        answer: "The AI can detect joy, sadness, anger, fear, love, neutral states, and signs of crisis. The confidence level of detection is shown alongside each response, and you can always see which emotion was detected in your messages."
      },
      {
        question: "How accurate is the emotion detection?",
        answer: "The emotion detection model has approximately 85-90% accuracy depending on the complexity of the text. We continuously improve the model. You'll always see the confidence percentage next to detected emotions."
      },
      {
        question: "Are the breathing exercises effective?",
        answer: "Yes! Scientific research shows that controlled breathing exercises can reduce stress, lower anxiety, and improve emotional regulation. Our exercises are based on proven techniques like box breathing and the 4-7-8 method used by mental health professionals."
      }
    ],
    billing: [
      {
        question: "Will MindEase always be free?",
        answer: "The core features of MindEase will remain free. If we introduce premium features in the future (like advanced analytics or personalized insights), the basic conversational support will stay free for everyone."
      },
      {
        question: "Are there any hidden costs?",
        answer: "No hidden costs. What you see is what you get. We're committed to transparency about any future pricing changes, and you'll always have access to essential features for free."
      },
      {
        question: "How do you sustain the app?",
        answer: "Currently, MindEase is sustained through grants and donations. In the future, we may introduce optional premium features for those who can afford them, while keeping core features free for everyone who needs them."
      }
    ],
    safety: [
      {
        question: "What happens if the AI detects crisis language?",
        answer: [
          "When the AI detects language indicating self-harm or crisis, it will:",
          "",
          "1. Pause the conversation gently",
          "2. Display crisis resources prominently",
          "3. Suggest breathing exercises",
          "4. Encourage reaching out to professional help",
          "5. Never dismiss or minimize your feelings",
          "",
          "The AI does NOT contact emergency services or anyone else for you - that's a decision only you can make."
        ]
      },
      {
        question: "Is there a way to get human support?",
        answer: "MindEase is primarily an AI-driven tool. However, we provide links to crisis hotlines, therapy directories, and support groups. For ongoing mental health support, we recommend finding a licensed therapist in your area."
      },
      {
        question: "What should I do if I feel the AI gave harmful advice?",
        answer: "While our AI is designed to be safe and supportive, if you ever feel you received harmful advice, please reach out to us at support@mindease.com. We take all feedback seriously and continuously improve our AI responses."
      },
      {
        question: "How do you ensure the AI's responses are appropriate?",
        answer: "Our AI uses Google's Gemini API with custom safety settings and empathetic prompting. We've also implemented content filters and crisis detection. All responses are designed to be supportive, non-judgmental, and appropriate for mental health contexts."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold text-sage-800">Frequently Asked Questions</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl shadow-lg mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-3">How Can We Help?</h1>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Find answers to common questions about MindEase, privacy, features, and mental health support
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Getting Started", icon: BookOpen, category: "general" },
            { label: "Privacy & Security", icon: Shield, category: "privacy" },
            { label: "Technical", icon: Smartphone, category: "technical" },
            { label: "Mental Health", icon: Brain, category: "mentalHealth" }
          ].map((link) => (
            <button
              key={link.category}
              onClick={() => {
                setOpenCategories({
                  general: false,
                  privacy: false,
                  technical: false,
                  mentalHealth: false,
                  billing: false,
                  safety: false,
                  [link.category]: true
                });
                document.getElementById(link.category)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-sage-100 hover:shadow-md transition-all hover:scale-105"
            >
              <link.icon className="w-6 h-6 text-sage-500" />
              <span className="text-sm font-medium text-sage-700">{link.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div id="general" className="scroll-mt-20">
          <FAQSection
            title="General Questions"
            icon={HelpCircle}
            category="general"
            questions={faqData.general}
          />
        </div>

        <div id="privacy" className="scroll-mt-20">
          <FAQSection
            title="Privacy & Security"
            icon={Shield}
            category="privacy"
            questions={faqData.privacy}
          />
        </div>

        <div id="technical" className="scroll-mt-20">
          <FAQSection
            title="Technical Questions"
            icon={Smartphone}
            category="technical"
            questions={faqData.technical}
          />
        </div>

        <div id="mentalHealth" className="scroll-mt-20">
          <FAQSection
            title="Mental Health Questions"
            icon={Brain}
            category="mentalHealth"
            questions={faqData.mentalHealth}
          />
        </div>

        <div id="billing" className="scroll-mt-20">
          <FAQSection
            title="Billing & Subscription"
            icon={Database}
            category="billing"
            questions={faqData.billing}
          />
        </div>

        <div id="safety" className="scroll-mt-20">
          <FAQSection
            title="Safety & Crisis Support"
            icon={AlertCircle}
            category="safety"
            questions={faqData.safety}
          />
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-2xl p-8 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-3">Still Have Questions?</h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            We're here to help! Reach out to our support team for any unanswered questions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = "mailto:support@mindease.com"}
              className="px-6 py-2 bg-white text-sage-700 rounded-full font-medium hover:bg-sage-50 transition-all shadow-md"
            >
              Email Support
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="px-6 py-2 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Ask the AI
            </button>
          </div>
        </div>

        {/* Crisis Support Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Immediate Crisis Support</h4>
              <p className="text-sm text-amber-700 mb-2">
                If you're in crisis or having thoughts of self-harm, please reach out to professional help right now.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.href = "tel:988"}
                  className="text-sm bg-amber-600 text-white px-4 py-1.5 rounded-full hover:bg-amber-700 transition-colors"
                >
                  Call 988
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("741741");
                    alert("Text HOME to 741741 for crisis counseling");
                  }}
                  className="text-sm border border-amber-600 text-amber-700 px-4 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                >
                  Text HOME to 741741
                </button>
                <button
                  onClick={() => navigate("/crisis")}
                  className="text-sm border border-amber-600 text-amber-700 px-4 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                >
                  View All Resources
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-sage-400 py-8">
          <p>© 2024 MindEase. All rights reserved.</p>
          <p className="mt-1">
            MindEase is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;