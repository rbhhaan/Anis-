import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

// --- CONFIGURATION FOR DEPLOYMENT ---
// If you are deploying to Netlify/GitHub Pages and don't want to use Environment Variables,
// you can base64 encode your API key and paste it below.
// 1. Go to https://www.base64encode.org/
// 2. Paste your Gemini API Key
// 3. Copy the result and paste it inside the quotes below.
const OBFUSCATED_KEY = ""; // e.g., "QUFJ..."

// Helper to get the key
const getApiKey = (): string | null => {
  // 1. Priority: Environment Variable (Best for Netlify/Vercel)
  if (process.env.API_KEY) return process.env.API_KEY;
  
  // 2. Fallback: Internal Obfuscated Key (For static deployments)
  if (OBFUSCATED_KEY) {
    try {
      return atob(OBFUSCATED_KEY);
    } catch (e) {
      console.error("Failed to decode obfuscated key");
      return null;
    }
  }
  
  return null;
};

export const initializeChat = (): void => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key missing. Chat functionalities will not work.");
    // We do not throw here to allow UI to render, but chat will fail later.
    return;
  }

  try {
    // Initialize instance if not already done or if key changed
    if (!genAI) {
      genAI = new GoogleGenAI({ apiKey });
    }

    chatSession = genAI.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
  }
};

export const sendMessageStream = async function* (message: string) {
  // Try to initialize if not ready
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const contentResponse = chunk as GenerateContentResponse;
      yield contentResponse.text || '';
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// Export a check function for the UI
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};