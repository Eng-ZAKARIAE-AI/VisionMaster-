import { GoogleGenAI } from "@google/genai";

// Test Gemini API connection
const testGeminiAPI = async () => {
  const apiKey = process.env.GEMINI_API_KEY || "test_key";
  
  console.log("🔍 Testing Gemini API Connection...");
  console.log(`📝 API Key: ${apiKey ? apiKey.substring(0, 10) + "..." : "NOT SET"}`);
  
  if (!apiKey || apiKey === "test_key") {
    console.error("❌ ERROR: GEMINI_API_KEY is not set in .env.local");
    console.log("\n📋 Steps to fix:");
    console.log("1. Get your API key from: https://aistudio.google.com/apikey");
    console.log("2. Create .env.local file in project root");
    console.log("3. Add: GEMINI_API_KEY=your_actual_key");
    process.exit(1);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: "Say 'API is working!' in one sentence." }] }]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ API Connection Successful!");
    console.log(`📝 Response: ${text}`);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ API Connection Failed!");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

testGeminiAPI();
