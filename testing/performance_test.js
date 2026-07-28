/**
 * Performance Testing Script - With Component-Level Timing
 * Measures: Total, Spring Boot, Emotion Service, and Gemini API separately
 * Run with: node performance_test.js
 */

const fs = require("fs");
const path = require("path");

// ================= CONFIG =================
const CONFIG = {
  baseUrl: "http://localhost:8081",
  emotionApiUrl: "http://localhost:5000",
  
  loginEndpoint: "/api/auth/login",
  signupEndpoint: "/api/auth/signup",
  chatSessionEndpoint: "/api/chat/session",
  chatMessageEndpoint: "/api/chat/message",
  
  // Direct emotion API endpoints (for component testing)
  emotionAnalyzeEndpoint: "/analyze/simple",
  emotionChatEndpoint: "/chat",
  emotionHealthEndpoint: "/health",
  
  testUser: {
    username: `perf_test_${Date.now()}`,
    email: `perf_test_${Date.now()}@example.com`,
    passwordHash: "PerfTest@123"
  },
  
  extractToken: (response) => response.token,
  extractUserId: (response) => response.userId,
  
  buildChatPayload: (sessionId, text) => ({
    sessionId: sessionId,
    text: text
  }),
  
  sampleMessages: [
    "I'm really stressed about my exams next week.",
    "I feel kind of sad today, not sure why.",
    "I'm actually feeling good about my project progress.",
    "I'm anxious about my presentation tomorrow.",
    "Today was a pretty normal day, nothing special.",
    "I've been feeling lonely lately.",
    "I'm so happy about my promotion!",
    "I'm frustrated with my team at work.",
    "I'm worried about my health.",
    "I feel peaceful today."
  ],
  
  sequentialRequests: 10,
  concurrentUsers: 5,
  concurrentRounds: 2,
  
  outputDir: "./performance-results",
  timestamp: new Date().toISOString().replace(/[:.]/g, "-"),
};
// =================================================================

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Helper functions
function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, Math.min(idx, sortedArr.length - 1))];
}

function summarize(latencies) {
  if (latencies.length === 0) {
    return { count: 0, avg: 0, min: 0, max: 0, median: 0, p95: 0, p99: 0, stdDev: 0 };
  }
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / sorted.length;
  
  const squaredDiffs = sorted.map(x => Math.pow(x - avg, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / sorted.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    count: sorted.length,
    avg: +(avg).toFixed(1),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
    stdDev: +stdDev.toFixed(1),
  };
}

function formatTime(ms) {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ================= API FUNCTIONS =================

async function createTestUser() {
  try {
    const res = await fetch(CONFIG.baseUrl + CONFIG.signupEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CONFIG.testUser),
    });
    if (res.ok) {
      console.log(`✅ Created test user: ${CONFIG.testUser.username}`);
      return true;
    }
    if (res.status === 409) {
      console.log(`ℹ️ Test user already exists`);
      return true;
    }
    return false;
  } catch (err) {
    console.log(`⚠️ Could not create test user: ${err.message}`);
    return false;
  }
}

async function login() {
  const res = await fetch(CONFIG.baseUrl + CONFIG.loginEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: CONFIG.testUser.username,
      password: CONFIG.testUser.passwordHash,
    }),
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }
  const json = await res.json();
  const token = CONFIG.extractToken(json);
  const userId = CONFIG.extractUserId(json);
  if (!token) throw new Error("Could not extract token");
  return { token, userId };
}

async function createChatSession(token, userId) {
  const res = await fetch(CONFIG.baseUrl + CONFIG.chatSessionEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userId }),
  });
  if (!res.ok) {
    throw new Error(`Create session failed: ${res.status}`);
  }
  const json = await res.json();
  return json.sessionId;
}

// ================= COMPONENT-LEVEL PERFORMANCE MEASUREMENT =================

/**
 * Measures performance of the COMPLETE end-to-end flow
 * This includes: Spring Boot + Emotion Service + Gemini API
 */
async function measureFullChatFlow(token, sessionId, message) {
  const start = performance.now();
  let status = "OK";
  let errorMsg = "";
  
  try {
    const payload = CONFIG.buildChatPayload(sessionId, message);
    const res = await fetch(CONFIG.baseUrl + CONFIG.chatMessageEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      status = `HTTP_${res.status}`;
      errorMsg = await res.text().catch(() => "");
    } else {
      await res.json().catch(() => null);
    }
  } catch (err) {
    status = "ERROR";
    errorMsg = err.message;
  }
  
  const elapsed = performance.now() - start;
  return { elapsed: +elapsed.toFixed(1), status, errorMsg };
}

/**
 * Measures ONLY the Emotion Service + Gemini API
 * (Skips Spring Boot processing)
 */
async function measureEmotionServiceOnly(message) {
  const start = performance.now();
  let status = "OK";
  let errorMsg = "";
  
  try {
    const res = await fetch(CONFIG.emotionApiUrl + CONFIG.emotionChatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message,
        session_id: `test_session_${Date.now()}`
      }),
    });
    
    if (!res.ok) {
      status = `HTTP_${res.status}`;
      errorMsg = await res.text().catch(() => "");
    } else {
      await res.json().catch(() => null);
    }
  } catch (err) {
    status = "ERROR";
    errorMsg = err.message;
  }
  
  const elapsed = performance.now() - start;
  return { elapsed: +elapsed.toFixed(1), status, errorMsg };
}

/**
 * Measures ONLY the Hugging Face Emotion Detection
 * (Skips Gemini API call)
 */
async function measureEmotionDetectionOnly(message) {
  const start = performance.now();
  let status = "OK";
  let errorMsg = "";
  
  try {
    const res = await fetch(CONFIG.emotionApiUrl + CONFIG.emotionAnalyzeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    
    if (!res.ok) {
      status = `HTTP_${res.status}`;
      errorMsg = await res.text().catch(() => "");
    } else {
      await res.json().catch(() => null);
    }
  } catch (err) {
    status = "ERROR";
    errorMsg = err.message;
  }
  
  const elapsed = performance.now() - start;
  return { elapsed: +elapsed.toFixed(1), status, errorMsg };
}

/**
 * Measures ONLY the Gemini API Response Generation
 * (Requires emotion first, then calls Gemini)
 */
async function measureGeminiOnly(message) {
  const start = performance.now();
  let status = "OK";
  let errorMsg = "";
  
  try {
    // First get emotion
    const emotionRes = await fetch(CONFIG.emotionApiUrl + CONFIG.emotionAnalyzeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    
    if (!emotionRes.ok) {
      return { elapsed: 0, status: "EMOTION_FAILED", errorMsg: "Could not get emotion" };
    }
    
    const emotionData = await emotionRes.json();
    const emotion = emotionData.dominant_emotion || "neutral";
    
    // Now call Gemini with emotion context
    // Note: This assumes your service has a direct Gemini endpoint
    // If not, this measures the full /chat endpoint which includes Gemini
    const geminiRes = await fetch(CONFIG.emotionApiUrl + CONFIG.emotionChatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message,
        emotion: emotion,  // Some services accept emotion param
        session_id: `test_session_${Date.now()}`
      }),
    });
    
    if (!geminiRes.ok) {
      status = `HTTP_${geminiRes.status}`;
      errorMsg = await geminiRes.text().catch(() => "");
    } else {
      await geminiRes.json().catch(() => null);
    }
  } catch (err) {
    status = "ERROR";
    errorMsg = err.message;
  }
  
  const elapsed = performance.now() - start;
  return { elapsed: +elapsed.toFixed(1), status, errorMsg };
}

// ================= CSV EXPORT FUNCTIONS =================

function exportComponentPerformanceCSV(componentResults, filename = "component_performance.csv") {
  const header = "component,requestNum,elapsed_ms,status,message\n";
  const rows = componentResults.map(r => {
    const message = (r.message || "").replace(/,/g, ";");
    return `${r.component},${r.requestNum},${r.elapsed},${r.status},"${message}"`;
  }).join("\n");
  
  const filepath = path.join(CONFIG.outputDir, filename);
  fs.writeFileSync(filepath, header + rows);
  return filepath;
}

function exportComponentSummaryCSV(componentData, filename = "component_summary.csv") {
  const header = "component,count,avg_ms,min_ms,max_ms,p95_ms,p99_ms\n";
  const rows = componentData.map(([name, latencies]) => {
    if (latencies.length === 0) return `${name},0,0,0,0,0,0`;
    const sum = latencies.reduce((a, b) => a + b, 0);
    const avg = sum / latencies.length;
    const sorted = [...latencies].sort((a, b) => a - b);
    return `${name},${latencies.length},${avg.toFixed(1)},${sorted[0]},${sorted[sorted.length - 1]},${percentile(sorted, 95)},${percentile(sorted, 99)}`;
  }).join("\n");
  
  const filepath = path.join(CONFIG.outputDir, filename);
  fs.writeFileSync(filepath, header + rows);
  return filepath;
}

// ================= TEST FUNCTIONS =================

async function runComponentTests() {
  console.log("\n🔬 Component-Level Performance Tests");
  console.log("=".repeat(50));
  console.log("Testing each component individually to identify bottlenecks...\n");
  
  const results = {
    fullFlow: [],
    emotionService: [],
    emotionDetection: [],
    geminiOnly: []
  };
  
  const testMessages = CONFIG.sampleMessages.slice(0, 5); // Use 5 messages for component tests
  
  // Step 1: Login once for full flow tests
  const { token } = await login();
  const sessionId = await createChatSession(token, 1); // Assuming user ID 1
  
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`  Testing message ${i+1}/${testMessages.length}: "${message.substring(0, 30)}..."`);
    
    // 1. Full Flow (Spring Boot + Emotion + Gemini)
    const fullResult = await measureFullChatFlow(token, sessionId, message);
    results.fullFlow.push({ ...fullResult, message, component: "full_flow" });
    
    // 2. Emotion Service Only (Hugging Face + Gemini)
    const emotionResult = await measureEmotionServiceOnly(message);
    results.emotionService.push({ ...emotionResult, message, component: "emotion_service" });
    
    // 3. Emotion Detection Only (Hugging Face only)
    const detectionResult = await measureEmotionDetectionOnly(message);
    results.emotionDetection.push({ ...detectionResult, message, component: "emotion_detection" });
    
    // 4. Gemini Only (via emotion service)
    const geminiResult = await measureGeminiOnly(message);
    results.geminiOnly.push({ ...geminiResult, message, component: "gemini_only" });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}

// ================= MAIN EXECUTION =================

(async () => {
  console.log("\n🌿 MindEase Performance Test Suite");
  console.log("=".repeat(50));
  console.log(`📁 Results will be saved to: ${CONFIG.outputDir}`);
  
  try {
    // Setup
    console.log("\n📝 Setting up test user...");
    await createTestUser();
    
    console.log("🔐 Logging in...");
    const { token, userId } = await login();
    console.log(`✅ Login successful (User ID: ${userId})`);
    
    console.log("💬 Creating chat session...");
    const sessionId = await createChatSession(token, userId);
    console.log(`✅ Session created (ID: ${sessionId})`);
    
    // Warm-up
    console.log("\n🔥 Warming up...");
    for (let i = 0; i < 3; i++) {
      await measureFullChatFlow(token, sessionId, "Warm-up message");
      process.stdout.write(".");
    }
    console.log(" ✅");
    
    // Run component performance tests
    const componentResults = await runComponentTests();
    
    // Export component results
    const allComponentResults = [
      ...componentResults.fullFlow,
      ...componentResults.emotionService,
      ...componentResults.emotionDetection,
      ...componentResults.geminiOnly
    ];
    
    const compFile = exportComponentPerformanceCSV(allComponentResults, `component_performance_${CONFIG.timestamp}.csv`);
    console.log(`\n✅ Component performance CSV: ${path.basename(compFile)}`);
    
    // Calculate and export component summary
    const componentSummary = [
      ["Full Flow (Spring Boot + Emotion + Gemini)", componentResults.fullFlow.filter(r => r.status === "OK").map(r => r.elapsed)],
      ["Emotion Service (Hugging Face + Gemini)", componentResults.emotionService.filter(r => r.status === "OK").map(r => r.elapsed)],
      ["Emotion Detection (Hugging Face Only)", componentResults.emotionDetection.filter(r => r.status === "OK").map(r => r.elapsed)],
      ["Gemini API Only", componentResults.geminiOnly.filter(r => r.status === "OK").map(r => r.elapsed)]
    ];
    
    const summaryFile = exportComponentSummaryCSV(componentSummary, `component_summary_${CONFIG.timestamp}.csv`);
    console.log(`✅ Component summary CSV: ${path.basename(summaryFile)}`);
    
    // Print component breakdown
    console.log("\n📊 COMPONENT PERFORMANCE BREAKDOWN");
    console.log("=".repeat(60));
    
    const componentNames = [
      "Full Flow (End-to-End)",
      "Emotion Service (Hugging Face + Gemini)",
      "Emotion Detection (Hugging Face Only)",
      "Gemini API Only"
    ];
    
    const componentLatencies = [
      componentResults.fullFlow.filter(r => r.status === "OK").map(r => r.elapsed),
      componentResults.emotionService.filter(r => r.status === "OK").map(r => r.elapsed),
      componentResults.emotionDetection.filter(r => r.status === "OK").map(r => r.elapsed),
      componentResults.geminiOnly.filter(r => r.status === "OK").map(r => r.elapsed)
    ];
    
    let geminiLatency = 0;
    let huggingFaceLatency = 0;
    let springBootLatency = 0;
    
    componentLatencies.forEach((latencies, idx) => {
      const summary = summarize(latencies);
      const name = componentNames[idx];
      console.log(`\n${name}:`);
      console.log(`  Avg: ${formatTime(summary.avg)}`);
      console.log(`  p95: ${formatTime(summary.p95)}`);
      console.log(`  p99: ${formatTime(summary.p99)}`);
      console.log(`  Count: ${summary.count}`);
      
      // Calculate component breakdown
      if (idx === 1 && latencies.length > 0 && componentLatencies[2]?.length > 0) {
        // Emotion Service = Hugging Face + Gemini
        // We can estimate Gemini latency = Emotion Service - Hugging Face
        const avgEmotionService = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const avgHuggingFace = componentLatencies[2].reduce((a, b) => a + b, 0) / componentLatencies[2].length;
        const estimatedGemini = avgEmotionService - avgHuggingFace;
        geminiLatency = estimatedGemini;
        huggingFaceLatency = avgHuggingFace;
        console.log(`  └─ Estimated Gemini: ${formatTime(estimatedGemini)}`);
        console.log(`  └─ Estimated Hugging Face: ${formatTime(avgHuggingFace)}`);
      }
      
      if (idx === 0 && latencies.length > 0 && componentLatencies[1]?.length > 0) {
        // Full Flow = Spring Boot + Emotion Service
        // Spring Boot latency = Full Flow - Emotion Service
        const avgFullFlow = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const avgEmotionService = componentLatencies[1].reduce((a, b) => a + b, 0) / componentLatencies[1].length;
        const estimatedSpringBoot = avgFullFlow - avgEmotionService;
        springBootLatency = estimatedSpringBoot;
        console.log(`  └─ Estimated Spring Boot: ${formatTime(estimatedSpringBoot)}`);
        console.log(`  └─ Estimated Emotion Service: ${formatTime(avgEmotionService)}`);
      }
    });
    
    // Final breakdown
    console.log("\n📊 FINAL COMPONENT BREAKDOWN");
    console.log("=".repeat(60));
    console.log(`🟢 Spring Boot API: ${formatTime(springBootLatency)}`);
    console.log(`🟡 Hugging Face Emotion Detection: ${formatTime(huggingFaceLatency)}`);
    console.log(`🔴 Gemini API Response Generation: ${formatTime(geminiLatency)}`);
    console.log(`📦 Total End-to-End Latency: ${formatTime(springBootLatency + huggingFaceLatency + geminiLatency)}`);
    
    console.log(`\n📁 All CSV files saved in: ${CONFIG.outputDir}`);
    console.log("\n✅ Performance test completed!");
    
  } catch (err) {
    console.error("\n❌ Script failed:", err.message);
  }
})();