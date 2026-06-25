import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  Shield, 
  Sparkles,
  Brain,
  Clock,
  Users,
  ChevronRight,
  Star,
  Phone,
  ArrowRight,
  CheckCircle,
  Moon,
  Sun,
  Zap,
  Smile,
  Frown,
  AlertCircle,
  BarChart3,
  User,
  TrendingUp
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const FeatureCard = ({ icon: Icon, title, description, index, color }) => (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setHoveredFeature(index)}
      onHoverEnd={() => setHoveredFeature(null)}
      className="bg-white rounded-2xl shadow-lg p-6 border border-sage-100 hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
        hoveredFeature === index ? 'scale-110' : ''
      }`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-sage-800 mb-2">{title}</h3>
      <p className="text-sage-600 leading-relaxed">{description}</p>
    </motion.div>
  );

  const TestimonialCard = ({ text, author, role, rating }) => (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-xl shadow-md p-6 border border-sage-100"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
      <p className="text-sage-700 mb-4 italic">"{text}"</p>
      <div>
        <p className="font-semibold text-sage-800">{author}</p>
        <p className="text-sm text-sage-500">{role}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 via-white to-sage-50">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-sage-800">MindEase</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sage-600 hover:text-sage-800 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sage-600 hover:text-sage-800 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sage-600 hover:text-sage-800 transition-colors">Testimonials</a>
            <a href="#faq" className="text-sage-600 hover:text-sage-800 transition-colors">FAQ</a>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-full hover:from-sage-600 hover:to-sage-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sage-300 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-sage-100 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-sage-500" />
                <span className="text-sm text-sage-600">Your Mental Wellness Companion</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
                A Gentle Space to
                <span className="bg-gradient-to-r from-sage-500 to-sage-600 bg-clip-text text-transparent"> Talk, Heal, Grow</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-sage-600 mb-8 leading-relaxed">
                MindEase is your AI-powered mental health companion. Share your thoughts, 
                track your emotions, and receive compassionate support - all in a safe, 
                private space designed for your wellbeing.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-full font-medium hover:from-sage-600 hover:to-sage-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Start Free Journey
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 border-2 border-sage-300 text-sage-600 rounded-full font-medium hover:bg-sage-50 transition-all"
                >
                  Learn More
                </button>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-400 border-2 border-white flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🙂</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-sage-500" />
                    <span className="text-sm text-sage-600">Trusted by 1000+ users</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Chat Preview */}
                  <div className="bg-sage-500 px-4 py-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-sage-500" />
                    </div>
                    <span className="text-white font-medium">MindEase Assistant</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🌿
                      </div>
                      <div className="bg-sage-50 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sage-700 text-sm">Hi there. How are you feeling today?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <div className="bg-sage-500 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <p className="text-white text-sm">I've been feeling really anxious lately...</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🌿
                      </div>
                      <div className="bg-sage-50 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sage-700 text-sm">I hear you. Anxiety can be really overwhelming. Let's take a moment together. Would you like to try a quick breathing exercise?</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-sage-200 px-2 py-1 rounded-full">Deep Breathing</span>
                          <span className="text-xs bg-sage-200 px-2 py-1 rounded-full">Talk More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-sage-300 rounded-full blur-xl opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-sage-400 rounded-full blur-xl opacity-40 animate-bounce delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Crisis Disclaimer Banner */}
      <div className="bg-amber-50 border-y border-amber-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-amber-800 flex items-center justify-center gap-2 flex-wrap">
            <AlertCircle className="w-4 h-4" />
            MindEase is an AI companion, not a crisis service. If this is an emergency, 
            <button onClick={() => window.location.href = "tel:988"} className="font-semibold underline hover:no-underline">
              call 988
            </button>
            for immediate support.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Why Choose MindEase?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-sage-600 max-w-2xl mx-auto">
              Designed with care to support your emotional wellbeing journey
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Support"
              description="Intelligent conversations that adapt to your emotions and provide personalized, empathetic responses 24/7."
              index={0}
              color="bg-gradient-to-br from-sage-400 to-sage-500"
            />
            <FeatureCard
              icon={Shield}
              title="Private & Secure"
              description="Your conversations stay on your device. Full control over your data with export and delete options."
              index={1}
              color="bg-gradient-to-br from-sage-500 to-sage-600"
            />
            <FeatureCard
              icon={Heart}
              title="Emotion Tracking"
              description="Understand your emotional patterns with insights and visualizations to support your growth."
              index={2}
              color="bg-gradient-to-br from-sage-600 to-sage-700"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-sage-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-sage-600">
              Three simple steps to start your journey
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: User, title: "Create Account", description: "Sign up for free and start your mental wellness journey in seconds" },
              { step: "02", icon: MessageCircle, title: "Start Talking", description: "Share what's on your mind. Our AI listens without judgment" },
              { step: "03", icon: TrendingUp, title: "Grow & Heal", description: "Track your emotions, gain insights, and develop coping strategies" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-sage-100">
                  <span className="text-2xl font-bold text-sage-500">{item.step}</span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center mx-auto mb-4 -mt-10 relative z-10 shadow-md">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-sage-800 mb-2">{item.title}</h3>
                <p className="text-sage-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotion Detection Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-sage-800 mb-4">
                Understand Your Emotions Better
              </h2>
              <p className="text-sage-600 mb-6 leading-relaxed">
                Our AI detects emotional patterns in your conversations, helping you recognize 
                and understand your feelings. Get insights that support your emotional growth.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { emotion: "Joyful", icon: Smile, color: "bg-yellow-100 text-yellow-700" },
                  { emotion: "Sad", icon: Frown, color: "bg-blue-100 text-blue-700" },
                  { emotion: "Anxious", icon: AlertCircle, color: "bg-purple-100 text-purple-700" }
                ].map((item) => (
                  <div key={item.emotion} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.emotion}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6"
            >
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-sage-500" />
                  <span className="font-semibold text-sage-700">Weekly Mood Overview</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-sage-500 mb-1">{day}</div>
                      <div className={`w-10 h-10 rounded-lg mx-auto ${
                        i === 0 ? 'bg-sage-300' : i === 4 ? 'bg-sage-500' : 'bg-sage-200'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-sage-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Loved by Our Community
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-sage-600">
              Real stories from real people finding support
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              text="MindEase has been a game-changer for my anxiety. Having someone to talk to at 3 AM makes all the difference."
              author="Sarah J."
              role="User since 2024"
              rating={5}
            />
            <TestimonialCard
              text="The breathing exercises and emotion tracking helped me understand my triggers better. Truly grateful."
              author="Michael T."
              role="User since 2024"
              rating={5}
            />
            <TestimonialCard
              text="Finally, a mental health app that feels warm and not clinical. The sage green theme is so calming!"
              author="Emma L."
              role="User since 2024"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Active Users", icon: Users },
              { number: "50K+", label: "Conversations", icon: MessageCircle },
              { number: "98%", label: "User Satisfaction", icon: Heart },
              { number: "24/7", label: "Always Available", icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-sage-600">
              Everything you need to know about MindEase
            </motion.p>
          </motion.div>
          
          <div className="space-y-4">
            {[
              { q: "Is MindEase free?", a: "Yes! MindEase offers a free tier with all core features. We believe mental health support should be accessible to everyone." },
              { q: "Is my data private?", a: "Absolutely. Your conversations are stored locally on your device. You have full control to export or delete your data anytime." },
              { q: "Can MindEase replace therapy?", a: "MindEase is a supportive companion, not a replacement for professional therapy. For serious mental health concerns, please consult a licensed professional." },
              { q: "What emotions can the AI detect?", a: "The AI can detect joy, sadness, anxiety, anger, love, and neutral states, with crisis detection for urgent situations." }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-sage-100 p-5"
              >
                <h3 className="font-semibold text-sage-800 mb-2">{faq.q}</h3>
                <p className="text-sage-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-sage-600 to-sage-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-16 h-16 text-white mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found support, understanding, and growth with MindEase.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-white text-sage-700 rounded-full font-semibold hover:bg-sage-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            </div>
            <p className="text-sm text-white/70 mt-6">
              No credit card required. Free forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-sage-300" />
                <span className="text-xl font-bold">MindEase</span>
              </div>
              <p className="text-sm text-sage-300">
                Your gentle companion for mental wellness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><button onClick={() => navigate("/features")} className="hover:text-white">Features</button></li>
                <li><button onClick={() => navigate("/pricing")} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => navigate("/faq")} className="hover:text-white">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><button onClick={() => navigate("/about")} className="hover:text-white">About</button></li>
                <li><button onClick={() => navigate("/privacy")} className="hover:text-white">Privacy</button></li>
                <li><button onClick={() => navigate("/terms")} className="hover:text-white">Terms</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><button onClick={() => window.location.href = "tel:988"} className="hover:text-white">Crisis Support</button></li>
                <li><button onClick={() => navigate("/blog")} className="hover:text-white">Blog</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sage-800 pt-8 text-center text-sm text-sage-400">
            <p>&copy; 2024 MindEase. Made with 💚 for mental wellness.</p>
            <p className="mt-2">If you're in crisis, call 988 for immediate support.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Landing;