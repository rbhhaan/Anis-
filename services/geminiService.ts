import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

// Initialize the API client
// Note: process.env.API_KEY is handled by the build environment/runtime
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initializeChat = (): void => {
  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but balanced for therapy
        topK: 40,
        topP: 0.95,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    throw error;
  }
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
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