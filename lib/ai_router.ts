export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRouterConfig {
  provider: "openrouter" | "gemini" | string;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  conversationHistory?: ChatMessage[];
}

export interface AIRouterResult {
  aiResponse: string;
  tokensUsed: number;
  latencyMs: number;
  model: string;
  provider: string;
}

// Default free models
const DEFAULT_FREE_OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Call OpenRouter API
 */
async function callOpenRouter(
  messages: ChatMessage[],
  model: string,
  temperature: number
): Promise<{ text: string; tokens: number }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://voicebuild.ai",
      "X-Title": "VoiceBuild Platform",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || DEFAULT_FREE_OPENROUTER_MODEL,
      messages,
      temperature,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content || "",
    tokens: data.usage?.total_tokens || 0,
  };
}

/**
 * Call Gemini API (via @google/genai)
 */
async function callGemini(
  messages: ChatMessage[],
  model: string,
  temperature: number
): Promise<{ text: string; tokens: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  let systemInstruction = "";
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  let lastUserMessage = "";

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction += msg.content + "\n";
    } else if (msg.role === "user") {
      lastUserMessage = msg.content;
      contents.push({ role: "user", parts: [{ text: msg.content }] });
    } else if (msg.role === "assistant") {
      contents.push({ role: "model", parts: [{ text: msg.content }] });
    }
  }

  const body: Record<string, any> = {
    contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: lastUserMessage }] }],
    generationConfig: { temperature, maxOutputTokens: 1024 },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const geminiModel = model || DEFAULT_GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const tokens = Math.ceil((JSON.stringify(messages).length + text.length) / 4);

  return { text, tokens };
}

/**
 * Route an AI request to the configured provider.
 * Falls back from OpenRouter → Gemini on failure.
 */
export async function routeAIRequest(
  messages: ChatMessage[],
  config: AIRouterConfig
): Promise<AIRouterResult> {
  const { provider, model, systemPrompt, temperature = 0.7, conversationHistory = [] } = config;
  const startTime = Date.now();

  // Build full message list: system + history + current
  let finalMessages: ChatMessage[] = [];
  if (systemPrompt) {
    finalMessages.push({ role: "system", content: systemPrompt });
  }
  if (conversationHistory.length > 0) {
    finalMessages = [...finalMessages, ...conversationHistory];
  }
  finalMessages = [...finalMessages, ...messages.filter(m => m.role !== "system")];

  let usedProvider = provider;
  let usedModel = model;
  let text = "";
  let tokens = 0;

  try {
    if (provider === "gemini") {
      const result = await callGemini(finalMessages, model || DEFAULT_GEMINI_MODEL, temperature);
      text = result.text;
      tokens = result.tokens;
      usedModel = model || DEFAULT_GEMINI_MODEL;
    } else {
      // OpenRouter (default)
      const result = await callOpenRouter(finalMessages, model || DEFAULT_FREE_OPENROUTER_MODEL, temperature);
      text = result.text;
      tokens = result.tokens;
      usedModel = model || DEFAULT_FREE_OPENROUTER_MODEL;
    }
  } catch (primaryError) {
    console.error(`[AI Router] Primary provider (${provider}) failed:`, primaryError);

    // Fallback to the other provider
    try {
      if (provider === "gemini") {
        console.log("[AI Router] Falling back to OpenRouter...");
        const result = await callOpenRouter(finalMessages, DEFAULT_FREE_OPENROUTER_MODEL, temperature);
        text = result.text;
        tokens = result.tokens;
        usedProvider = "openrouter";
        usedModel = DEFAULT_FREE_OPENROUTER_MODEL;
      } else {
        console.log("[AI Router] Falling back to Gemini...");
        const result = await callGemini(finalMessages, DEFAULT_GEMINI_MODEL, temperature);
        text = result.text;
        tokens = result.tokens;
        usedProvider = "gemini";
        usedModel = DEFAULT_GEMINI_MODEL;
      }
    } catch (fallbackError) {
      console.error("[AI Router] Fallback provider also failed:", fallbackError);
      throw new Error("All AI providers failed. Please try again later.");
    }
  }

  return {
    aiResponse: text,
    tokensUsed: tokens,
    latencyMs: Date.now() - startTime,
    model: usedModel,
    provider: usedProvider,
  };
}
