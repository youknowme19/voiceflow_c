import fetch from "node-fetch";

const OPENROUTER_URL = "https://api.openrouter.ai/v1";
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn("OPENROUTER_API_KEY is not set");
}

interface Message {
  role: string;
  content: string;
}

export async function generateAIResponse(
  messages: Message[],
  model: string = "openai/gpt-4o-mini"
) {
  if (!apiKey) {
    throw new Error("OpenRouter API key missing");
  }
  const response = await fetch(`${OPENROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });
  const data: any = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenRouter request failed");
  }
  return data;
}

// embeddings
export async function generateEmbedding(texts: string[], model: string = "text-embedding-3-small") {
  if (!apiKey) {
    throw new Error("OpenRouter API key missing");
  }
  const response = await fetch(`${OPENROUTER_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: texts,
    }),
  });
  const data: any = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Embedding request failed");
  }
  return data;
}
