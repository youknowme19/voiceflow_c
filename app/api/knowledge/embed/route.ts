import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { generateEmbedding } from "../../../../lib/openrouter";

export async function POST(request: Request) {
  const { documentId, text } = await request.json();
  if (!documentId || !text) {
    return NextResponse.json({ error: "documentId and text required" }, { status: 400 });
  }

  // generate embedding via openrouter
  try {
    const embedRes = await generateEmbedding([text]);
    const vector = embedRes.data[0].embedding;
    await supabase.from("embeddings").insert({ document_id: documentId, vector, text });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
