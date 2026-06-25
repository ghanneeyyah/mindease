import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { chatService } from "../services/chatService";
import {
  Calendar,
  MessageCircle,
  TrendingUp,
  Smile,
  Frown,
  Heart,
  ChevronRight,
  BarChart3,
  Clock,
  Trash2,
  Download,
  X,
  AlertCircle,
  BookOpen,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [todaySession, setTodaySession] = useState(null); // null = not checked yet
  const [hasTodaySession, setHasTodaySession] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [moodData, setMoodData] = useState({
    weekly: [],
    topEmotions: [],
    averageSentiment: 0,
    totalMessages: 0,
  });

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userSessions = await chatService.getUserSessions(user.id);
      const list = userSessions || [];
      setSessions(list);

      // Check if today's session already exists by comparing dateLabel
      const todayLabel = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
      const existing = list.find(s => s.dateLabel === todayLabel);
      if (existing) {
        setTodaySession(existing);
        setHasTodaySession(true);
      } else {
        setHasTodaySession(false);
      }

      processMoodData(list);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Could not load your history");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Navigate to today's chat — creates one if it doesn't exist
  const goToToday = async () => {
    try {
      const session = await chatService.getTodaySession(user.id);
      navigate("/chat", { state: { sessionId: session.sessionId, isToday: true } });
    } catch (error) {
      toast.error("Couldn't open today's entry. Please try again.");
    }
  };

  // Navigate to a specific past session
  const openSession = (sessionId) => {
    navigate("/chat", { state: { sessionId, isToday: false } });
  };

  const processMoodData = async (sessionsList) => {
    const allMessages = [];
    for (const session of sessionsList) {
      try {
        const messages = await chatService.getMessages(session.sessionId);
        const userMessages = messages.filter(m => m.senderType === "USER" && m.sentimentLabel);
        allMessages.push(...userMessages);
      } catch (error) {
        console.error("Failed to fetch messages for session:", session.sessionId);
      }
    }

    const emotionCount = {};
    allMessages.forEach(msg => {
      const emotion = msg.sentimentLabel || "neutral";
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
    });

    const topEmotions = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weeklyMessages = allMessages.filter(msg => new Date(msg.timestamp) > lastWeek);
    const dailyEmotions = {};
    weeklyMessages.forEach(msg => {
      const day = new Date(msg.timestamp).toLocaleDateString("en-US", { weekday: "short" });
      if (!dailyEmotions[day]) dailyEmotions[day] = [];
      dailyEmotions[day].push(msg.sentimentLabel || "neutral");
    });

    const weeklyData = Object.entries(dailyEmotions).map(([day, emotions]) => ({
      day,
      dominantEmotion: getDominantEmotion(emotions),
      count: emotions.length,
    }));

    setMoodData({
      weekly: weeklyData,
      topEmotions,
      averageSentiment: calculateAverageSentiment(allMessages),
      totalMessages: allMessages.length,
    });
  };

  const getDominantEmotion = (emotions) => {
    const counts = {};
    emotions.forEach(e => (counts[e] = (counts[e] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  };

  const calculateAverageSentiment = (messages) => {
    const sentimentScores = { joy: 5, love: 5, neutral: 3, sadness: 2, fear: 2, anger: 1, crisis: 1 };
    const total = messages.reduce((sum, msg) => sum + (sentimentScores[msg.sentimentLabel] || 3), 0);
    return messages.length ? (total / messages.length).toFixed(1) : 0;
  };

  const handleViewSession = async (sessionId) => {
    try {
      const messages = await chatService.getMessages(sessionId);
      setSessionMessages(messages);
      setSelectedSession(sessionId);
    } catch (error) {
      toast.error("Could not load conversation");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    toast.success("Conversation deleted");
    setShowDeleteConfirm(null);
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setSessionMessages([]);
    }
  };

  const exportData = () => {
    const data = {
      user: { username: user?.username, email: user?.email },
      exportDate: new Date().toISOString(),
      sessions: sessions.map(session => ({ ...session, messages: sessionMessages })),
      moodData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindease-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Your data has been exported");
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      joy: <Smile className="w-4 h-4 text-yellow-500" />,
      sadness: <Frown className="w-4 h-4 text-blue-400" />,
      love: <Heart className="w-4 h-4 text-pink-400" />,
      anger: <AlertCircle className="w-4 h-4 text-red-400" />,
      fear: <AlertCircle className="w-4 h-4 text-purple-400" />,
      neutral: <MessageCircle className="w-4 h-4 text-gray-400" />,
    };
    return icons[emotion] || icons.neutral;
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: "bg-yellow-100 text-yellow-700",
      sadness: "bg-blue-100 text-blue-700",
      love: "bg-pink-100 text-pink-700",
      anger: "bg-red-100 text-red-700",
      fear: "bg-purple-100 text-purple-700",
      neutral: "bg-gray-100 text-gray-700",
    };
    return colors[emotion] || colors.neutral;
  };

  const filterSessions = () => {
    if (filter === "all") return sessions;
    const cutoff = new Date();
    if (filter === "week") cutoff.setDate(cutoff.getDate() - 7);
    else if (filter === "month") cutoff.setMonth(cutoff.getMonth() - 1);
    return sessions.filter(s => new Date(s.sessionStartTime) > cutoff);
  };

  // Today's label for matching
  const todayLabel = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sage-50">
        <div className="text-center">
          <div className="animate-pulse text-sage-500 text-lg">Loading your journey...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sage-800">Your Dashboard</h1>
              <p className="text-sm text-sage-500 mt-1">Reflect on your emotional journey</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportData} className="p-2 hover:bg-sage-100 rounded-full transition-colors" title="Export data">
                <Download className="w-5 h-5 text-sage-600" />
              </button>
              <button onClick={() => navigate("/settings")} className="p-2 hover:bg-sage-100 rounded-full transition-colors">
                <BarChart3 className="w-5 h-5 text-sage-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Today's Entry CTA ── */}
        <div className="mb-8">
          <div className={`rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm border
            ${hasTodaySession
              ? "bg-sage-500 border-sage-600"
              : "bg-white border-sage-200"
            }`}
          >
            <div>
              <p className={`text-sm font-medium mb-1 ${hasTodaySession ? "text-sage-100" : "text-sage-500"}`}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h2 className={`text-xl font-bold ${hasTodaySession ? "text-white" : "text-sage-800"}`}>
                {hasTodaySession ? "Continue Today's Entry" : "Start Today's Entry"}
              </h2>
              <p className={`text-sm mt-1 ${hasTodaySession ? "text-sage-200" : "text-sage-400"}`}>
                {hasTodaySession
                  ? "Pick up where you left off"
                  : "How are you feeling today?"}
              </p>
            </div>
            <button
              onClick={goToToday}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all flex-shrink-0
                ${hasTodaySession
                  ? "bg-white text-sage-700 hover:bg-sage-50"
                  : "bg-sage-500 text-white hover:bg-sage-600"
                }`}
            >
              {hasTodaySession ? <BookOpen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {hasTodaySession ? "Continue" : "Start"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-5 h-5 text-sage-500" />
              <span className="text-2xl font-bold text-sage-800">{moodData.totalMessages}</span>
            </div>
            <p className="text-sm text-sage-500">Total Messages</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-sage-500" />
              <span className="text-2xl font-bold text-sage-800">{sessions.length}</span>
            </div>
            <p className="text-sm text-sage-500">Journal Entries</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-sage-500" />
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-sage-800">{moodData.averageSentiment}</span>
                <span className="text-sm text-sage-400">/5</span>
              </div>
            </div>
            <p className="text-sm text-sage-500">Average Mood Score</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-sage-500" />
              <span className="text-xl font-bold text-sage-800 capitalize">
                {moodData.topEmotions[0]?.emotion || "—"}
              </span>
            </div>
            <p className="text-sm text-sage-500">Top Emotion</p>
          </div>
        </div>

        {/* Weekly Mood */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sage-500" />
            This Week's Mood
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
              const mood = moodData.weekly.find(m => m.day === day);
              return (
                <div key={day} className="text-center">
                  <div className="text-xs text-sage-500 mb-2">{day}</div>
                  <div className={`p-3 rounded-lg ${mood ? getEmotionColor(mood.dominantEmotion) : "bg-sage-50"}`}>
                    {mood ? getEmotionIcon(mood.dominantEmotion) : <div className="w-4 h-4 mx-auto opacity-30">–</div>}
                  </div>
                  {mood && <div className="text-xs text-sage-400 mt-1">{mood.count}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Emotional Patterns */}
        {moodData.topEmotions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-sage-800 mb-4">Your Emotional Patterns</h2>
            <div className="space-y-3">
              {moodData.topEmotions.map(({ emotion, count }) => (
                <div key={emotion} className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm capitalize ${getEmotionColor(emotion)}`}>{emotion}</div>
                  <div className="flex-1 bg-sage-100 rounded-full h-2">
                    <div
                      className="bg-sage-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(count / moodData.totalMessages) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-sage-500">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journal History */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="p-6 border-b border-sage-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage-500" />
                Journal History
              </h2>
              <div className="flex gap-2">
                {["all", "week", "month"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                      filter === f ? "bg-sage-500 text-white" : "bg-sage-100 text-sage-600 hover:bg-sage-200"
                    }`}
                  >
                    {f === "all" ? "All" : f === "week" ? "This Week" : "This Month"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-sage-100">
            {filterSessions().length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">No journal entries yet</p>
                <button onClick={goToToday} className="mt-4 text-sage-600 hover:text-sage-700 font-medium">
                  Write your first entry →
                </button>
              </div>
            ) : (
              filterSessions().map((session) => {
                const isToday = session.dateLabel === todayLabel;
                return (
                  <div key={session.sessionId} className="p-4 hover:bg-sage-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => isToday ? goToToday() : openSession(session.sessionId)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${isToday ? "bg-sage-500" : "bg-sage-100"}`}>
                            <MessageCircle className={`w-5 h-5 ${isToday ? "text-white" : "text-sage-500"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sage-800">{session.dateLabel}</p>
                              {isToday && (
                                <span className="text-xs bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full">Today</span>
                              )}
                            </div>
                            <p className="text-sm text-sage-500">
                              {isToday ? "Tap to continue" : "Tap to read"}
                            </p>
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => isToday ? goToToday() : openSession(session.sessionId)}
                          className="p-2 hover:bg-sage-100 rounded-full transition-colors"
                          title={isToday ? "Continue" : "Read entry"}
                        >
                          <ChevronRight className="w-5 h-5 text-sage-500" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(session.sessionId)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    {showDeleteConfirm === session.sessionId && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700 mb-2">Delete this journal entry?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteSession(session.sessionId)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
