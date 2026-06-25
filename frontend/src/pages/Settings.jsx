import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Shield, 
  Moon, 
  Sun, 
  Monitor, 
  Type, 
  Eye, 
  Volume2,
  Database,
  Download,
  Trash2,
  Bell,
  Lock,
  User,
  Mail,
  Save,
  AlertTriangle,
  CheckCircle,
  Globe,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Privacy
    saveChatHistory: false,
    enableEmotionDetection: true,
    anonymousMode: false,
    
    // Appearance
    theme: "light", // light, dark, system
    fontSize: "medium", // small, medium, large
    reduceAnimations: false,
    highContrast: false,
    
    // Accessibility
    dyslexiaFriendly: false,
    screenReaderOptimized: false,
    soundNotifications: true,
    
    // Notifications
    emailReminders: false,
    dailyMoodCheckin: false,
    weeklyReport: true,
    
    // Language
    language: "en",
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("mindease_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("mindease_settings", JSON.stringify(settings));
    toast.success("Settings saved successfully! 💚");
    
    // Apply theme changes immediately
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
    applyAccessibilitySettings();
  };

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const applyFontSize = (size) => {
    const sizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    document.documentElement.style.fontSize = sizes[size];
  };

  const applyAccessibilitySettings = () => {
    if (settings.dyslexiaFriendly) {
      document.documentElement.classList.add("dyslexia-friendly");
    } else {
      document.documentElement.classList.remove("dyslexia-friendly");
    }
    
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (settings.reduceAnimations) {
      document.documentElement.classList.add("reduce-animations");
    } else {
      document.documentElement.classList.remove("reduce-animations");
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearAllData = async () => {
    setIsLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem("mindease_sessions");
      localStorage.removeItem("mindease_settings");
      localStorage.removeItem("mindease_mood_history");
      
      // Clear IndexedDB if used
      const databases = await indexedDB.databases?.() || [];
      for (const db of databases) {
        if (db.name?.startsWith("mindease")) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      
      toast.success("All data cleared successfully");
      setShowDeleteConfirm(false);
      
      // Optional: Logout after clearing data
      setTimeout(() => {
        if (window.confirm("Data cleared. Would you like to logout for privacy?")) {
          logout();
          navigate("/login");
        }
      }, 1500);
    } catch (error) {
      toast.error("Failed to clear data");
    } finally {
      setIsLoading(false);
    }
  };

  const exportUserData = async () => {
    setIsLoading(true);
    try {
      // Gather all user data
      const userData = {
        user: {
          id: user?.id,
          username: user?.username,
          email: user?.email,
        },
        settings: settings,
        exportDate: new Date().toISOString(),
        appVersion: "1.0.0",
      };
      
      // Get chat data from localStorage
      const sessions = localStorage.getItem("mindease_sessions");
      if (sessions) {
        userData.chatHistory = JSON.parse(sessions);
      }
      
      // Get mood history
      const moodHistory = localStorage.getItem("mindease_mood_history");
      if (moodHistory) {
        userData.moodHistory = JSON.parse(moodHistory);
      }
      
      // Create download
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mindease-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Your data has been exported");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    toast.success("Profile update feature coming soon! 💚");
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
      <div className="p-5 border-b border-sage-100 bg-gradient-to-r from-sage-50 to-white">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-sage-500" />
          <h2 className="font-semibold text-sage-800">{title}</h2>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange, icon: Icon, danger = false }) => (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-sage-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-sage-500'}`} />}
          <label className={`font-medium ${danger ? 'text-red-700' : 'text-sage-700'}`}>
            {label}
          </label>
        </div>
        {description && (
          <p className="text-sm text-sage-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 ${
          checked ? (danger ? 'bg-red-500' : 'bg-sage-500') : 'bg-sage-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const RadioGroup = ({ label, options, value, onChange }) => (
    <div className="space-y-2">
      <label className="font-medium text-sage-700">{label}</label>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
              value === option.value
                ? "border-sage-500 bg-sage-50 text-sage-700"
                : "border-sage-200 text-sage-500 hover:border-sage-300"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sage-800">Settings</h1>
              <p className="text-sm text-sage-500 mt-1">Customize your experience</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Section */}
        <SettingSection title="Profile" icon={User}>
          <div className="flex items-start gap-4 p-3 bg-sage-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sage-800">{user?.username}</h3>
                <span className="text-xs bg-sage-200 text-sage-700 px-2 py-0.5 rounded-full">
                  Member
                </span>
              </div>
              <p className="text-sm text-sage-500">{user?.email}</p>
              <button
                onClick={updateProfile}
                className="mt-2 text-sm text-sage-600 hover:text-sage-700 font-medium"
              >
                Edit Profile →
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection title="Privacy & Security" icon={Shield}>
          <ToggleSwitch
            label="Save Chat History"
            description="Keep your conversations for future reflection (stored locally)"
            checked={settings.saveChatHistory}
            onChange={(val) => handleSettingChange("saveChatHistory", val)}
            icon={Database}
          />
          <ToggleSwitch
            label="Emotion Detection"
            description="Allow AI to analyze emotions for better responses"
            checked={settings.enableEmotionDetection}
            onChange={(val) => handleSettingChange("enableEmotionDetection", val)}
            icon={MessageCircle}
          />
          <ToggleSwitch
            label="Anonymous Mode"
            description="Hide your identity in conversations"
            checked={settings.anonymousMode}
            onChange={(val) => handleSettingChange("anonymousMode", val)}
            icon={Lock}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={Sun}>
          <RadioGroup
            label="Theme"
            options={[
              { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
              { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
              { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
            ]}
            value={settings.theme}
            onChange={(val) => handleSettingChange("theme", val)}
          />
          
          <RadioGroup
            label="Font Size"
            options={[
              { value: "small", label: "Small", icon: <Type className="w-4 h-4" /> },
              { value: "medium", label: "Medium", icon: <Type className="w-4 h-4" /> },
              { value: "large", label: "Large", icon: <Type className="w-4 h-4" /> },
            ]}
            value={settings.fontSize}
            onChange={(val) => handleSettingChange("fontSize", val)}
          />
          
          <ToggleSwitch
            label="Reduce Animations"
            description="Minimize motion effects throughout the app"
            checked={settings.reduceAnimations}
            onChange={(val) => handleSettingChange("reduceAnimations", val)}
            icon={Monitor}
          />
          
          <ToggleSwitch
            label="High Contrast Mode"
            description="Increase color contrast for better visibility"
            checked={settings.highContrast}
            onChange={(val) => handleSettingChange("highContrast", val)}
            icon={Eye}
          />
        </SettingSection>

        {/* Accessibility */}
        <SettingSection title="Accessibility" icon={Eye}>
          <ToggleSwitch
            label="Dyslexia-Friendly Font"
            description="Use a font designed for easier reading"
            checked={settings.dyslexiaFriendly}
            onChange={(val) => handleSettingChange("dyslexiaFriendly", val)}
            icon={Type}
          />
          <ToggleSwitch
            label="Screen Reader Optimized"
            description="Enhanced support for screen readers"
            checked={settings.screenReaderOptimized}
            onChange={(val) => handleSettingChange("screenReaderOptimized", val)}
            icon={Volume2}
          />
          <ToggleSwitch
            label="Sound Notifications"
            description="Play sounds for important alerts"
            checked={settings.soundNotifications}
            onChange={(val) => handleSettingChange("soundNotifications", val)}
            icon={Volume2}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <ToggleSwitch
            label="Email Reminders"
            description="Receive gentle check-in reminders via email"
            checked={settings.emailReminders}
            onChange={(val) => handleSettingChange("emailReminders", val)}
            icon={Mail}
          />
          <ToggleSwitch
            label="Daily Mood Check-in"
            description="Daily prompt to log your mood"
            checked={settings.dailyMoodCheckin}
            onChange={(val) => handleSettingChange("dailyMoodCheckin", val)}
            icon={MessageCircle}
          />
          <ToggleSwitch
            label="Weekly Report"
            description="Receive a summary of your emotional journey each week"
            checked={settings.weeklyReport}
            onChange={(val) => handleSettingChange("weeklyReport", val)}
            icon={Database}
          />
        </SettingSection>

        {/* Language & Region */}
        <SettingSection title="Language & Region" icon={Globe}>
          <div className="p-3 bg-sage-50 rounded-lg">
            <label className="block text-sm font-medium text-sage-700 mb-2">
              App Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none bg-white"
            >
              <option value="en">English</option>
              <option value="es">Español (Coming Soon)</option>
              <option value="fr">Français (Coming Soon)</option>
              <option value="zh">中文 (Coming Soon)</option>
            </select>
          </div>
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management" icon={Database}>
          <div className="space-y-3">
            <button
              onClick={exportUserData}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-sage-600" />
                <span className="text-sage-700">Export All Your Data</span>
              </div>
              <span className="text-sm text-sage-500">JSON</span>
            </button>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">Clear All Data</span>
                </div>
                <span className="text-sm text-red-500">⚠️ Irreversible</span>
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Delete All Data?</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  This will permanently delete all your conversations, mood history, and settings. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={clearAllData}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {isLoading ? "Deleting..." : "Yes, Delete Everything"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </SettingSection>

        {/* Support & About */}
        <SettingSection title="Support" icon={HelpCircle}>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-sage-50 rounded-lg transition-colors flex items-center justify-between">
              <span className="text-sage-700">Privacy Policy</span>
              <span className="text-sage-400">→</span>
            </button>
            <button className="w-full text-left p-3 hover:bg-sage-50 rounded-lg transition-colors flex items-center justify-between">
              <span className="text-sage-700">Terms of Service</span>
              <span className="text-sage-400">→</span>
            </button>
            <button className="w-full text-left p-3 hover:bg-sage-50 rounded-lg transition-colors flex items-center justify-between">
              <span className="text-sage-700">About MindEase</span>
              <span className="text-sage-400">→</span>
            </button>
            <div className="p-3 bg-sage-50 rounded-lg text-center">
              <p className="text-sm text-sage-500">Version 1.0.0</p>
              <p className="text-xs text-sage-400 mt-1">Made with 💚 for mental wellness</p>
            </div>
          </div>
        </SettingSection>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
        >
          Sign Out
        </button>

        {/* Crisis Note */}
        <div className="text-center py-4">
          <p className="text-xs text-sage-400">
            🌿 Need immediate support?{" "}
            <button onClick={() => window.location.href = "tel:988"} className="text-sage-500 underline">
              Call 988
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;