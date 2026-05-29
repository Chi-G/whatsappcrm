import OpenAI from "openai";
import { Message } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function generateBotResponse(
  conversationHistory: Message[]
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[OpenAI] OPENAI_API_KEY is not set. Bot response skipped.");
    return null;
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful, professional customer support assistant for a business using Fora CRM. Your goal is to assist customers promptly, answer their questions concisely, and collect any relevant information. Keep your responses short and friendly. Do not use formatting like bolding or bullet points unless absolutely necessary, as this is a WhatsApp text message.",
    },
  ];

  const sortedHistory = [...conversationHistory].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const msg of sortedHistory) {
    if (!msg.content_text) continue;
    
    messages.push({
      role: msg.sender_type === "customer" ? "user" : "assistant",
      content: msg.content_text,
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("[OpenAI] Error generating response:", error);
    return null;
  }
}
