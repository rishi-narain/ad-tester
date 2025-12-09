import OpenAI from "openai";

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// For backward compatibility
export const openai = {
  get chat() {
    return getOpenAIClient().chat;
  },
};
