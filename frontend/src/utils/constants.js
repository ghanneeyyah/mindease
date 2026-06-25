export const EMOTIONS = {
  JOY: "joy",
  SADNESS: "sadness",
  ANGER: "anger",
  FEAR: "fear",
  LOVE: "love",
  NEUTRAL: "neutral",
  CRISIS: "crisis"
};

export const EMOTION_CONFIG = {
  [EMOTIONS.JOY]: {
    label: "Joyful",
    icon: "😊",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    score: 5
  },
  [EMOTIONS.SADNESS]: {
    label: "Sad",
    icon: "😢",
    color: "text-blue-400",
    bgColor: "bg-blue-100",
    score: 2
  },
  [EMOTIONS.ANGER]: {
    label: "Angry",
    icon: "😤",
    color: "text-red-400",
    bgColor: "bg-red-100",
    score: 1
  },
  [EMOTIONS.FEAR]: {
    label: "Anxious",
    icon: "😰",
    color: "text-purple-400",
    bgColor: "bg-purple-100",
    score: 2
  },
  [EMOTIONS.LOVE]: {
    label: "Loving",
    icon: "💚",
    color: "text-pink-400",
    bgColor: "bg-pink-100",
    score: 5
  },
  [EMOTIONS.NEUTRAL]: {
    label: "Neutral",
    icon: "😐",
    color: "text-gray-400",
    bgColor: "bg-gray-100",
    score: 3
  },
  [EMOTIONS.CRISIS]: {
    label: "Needs Support",
    icon: "🚨",
    color: "text-crisis-500",
    bgColor: "bg-crisis-50",
    score: 1
  }
};

export const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "end my life", "hurt myself", "want to die",
  "better off dead", "no reason to live", "ending it", "self harm"
];

export const BREATHING_PATTERNS = {
  "4-4-4-4": { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: "Box Breathing" },
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, hold2: 0, name: "Relaxing Breath" },
  "5-5-5": { inhale: 5, hold: 0, exhale: 5, hold2: 0, name: "Equal Breathing" }
};

export const CRISIS_HOTLINES = [
  { name: "988 Suicide & Crisis Lifeline", number: "988", description: "24/7 free confidential support" },
  { name: "Crisis Text Line", number: "741741", description: "Text HOME to connect" },
  { name: "SAMHSA Helpline", number: "1-800-662-4357", description: "Substance abuse & mental health" }
];

export const APP_CONFIG = {
  name: "MindEase",
  version: "1.0.0",
  supportEmail: "support@mindease.com",
  crisisLine: "988"
};