import { createClient } from "@supabase/supabase-js";

const EMBEDDING_DIM = 768; // Gemini text-embedding-004 dimension
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

/**
 * Split text into overlapping chunks for better retrieval
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start += chunkSize - overlap;
  }

  return chunks.filter(c => c.length > 20); // Discard tiny chunks
}

/**
 * Generate a 768-dimensional embedding using Gemini text-embedding-004
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text: text.slice(0, 8000) }] }, // Max 8k chars
          taskType: "RETRIEVAL_DOCUMENT",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const values: number[] = data.embedding?.values || [];
        if (values.length === EMBEDDING_DIM) return values;
        console.warn(`[RAG] Unexpected embedding dimension: ${values.length}`);
      } else {
        const err = await response.text();
        console.error(`[RAG] Gemini embedding error: ${err}`);
      }
    } catch (e) {
      console.error("[RAG] Gemini embedding failed:", e);
    }
  }

  // Fallback: HuggingFace (if key provided)
  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (hfToken) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5",
        {
          headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: text.slice(0, 512), options: { wait_for_model: true } }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        const vec = Array.isArray(result[0]) ? result[0] : result;
        if (Array.isArray(vec) && vec.length > 0) {
          // Pad or truncate to EMBEDDING_DIM
          return padOrTruncate(vec, EMBEDDING_DIM);
        }
      }
    } catch (e) {
      console.error("[RAG] HuggingFace embedding failed:", e);
    }
  }

  // Last resort: zero vector (search will return no results, graceful degradation)
  console.warn("[RAG] No embedding provider available. Using zero vector.");
  return Array(EMBEDDING_DIM).fill(0);
}

/** Pad or truncate a vector to a target length */
function padOrTruncate(vec: number[], targetDim: number): number[] {
  if (vec.length >= targetDim) return vec.slice(0, targetDim);
  return [...vec, ...Array(targetDim - vec.length).fill(0)];
}

/**
 * Embed a document: chunk → embed each chunk → store in Supabase
 * Note: agent_id should be set on the knowledge_documents record during initialization
 */
export async function embedAndStoreDocument(
  documentId: string,
  text: string,
  supabaseClient?: any
): Promise<{ chunksStored: number }> {
  const client = supabaseClient || createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  );

  const chunks = chunkText(text);
  let chunksStored = 0;

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);
    const { error } = await client.from("embeddings").insert({
      document_id: documentId,
      text: chunk,
      embedding,
    });
    if (error) {
      console.error("[RAG] Failed to store chunk:", error);
    } else {
      chunksStored++;
    }
  }

  return { chunksStored };
}

/**
 * Retrieve similar documents using cosine similarity
 */
export async function retrieveContext(
  query: string,
  agentId: string,
  limit = 3,
  supabaseClient?: any
): Promise<string> {
  const client = supabaseClient || createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  try {
    const queryEmbedding = await createEmbedding(query);

    const { data: documents, error } = await client.rpc("match_knowledge_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.6,
      match_count: limit,
      p_agent_id: agentId,
    });

    if (error) {
      console.error("[RAG] Similarity search error:", error);
      return "";
    }

    if (!documents || documents.length === 0) return "";

    return documents.map((doc: any) => doc.text).join("\n\n---\n\n");
  } catch (err) {
    console.error("[RAG] Retrieval error:", err);
    return "";
  }
}

/**
 * Build an augmented prompt with retrieved context
 */
export function buildAugmentedPrompt(userMessage: string, context: string): string {
  if (!context) return userMessage;

  return `You have access to the following knowledge base context. Use it to answer accurately.
If the answer is not in the context, rely on your general knowledge but note you are unsure if it strictly applies.

--- CONTEXT ---
${context}
--- END CONTEXT ---

User: ${userMessage}`;
}
