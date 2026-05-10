export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { embedAndStoreDocument } from "@/lib/rag_engine";
import { getAdminClient, getRouteClient } from "@/lib/supabaseServer";
import pdfParse from "pdf-parse";

// POST /api/knowledge/embed
export async function POST(request: Request) {
  try {
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { documentId, url, type, text: explicitText } = await request.json();

    let extractedText = explicitText;

    if (type === "pdf" && url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch PDF from storage");
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text;
      } catch (pdfErr) {
        console.error("PDF Parsing error:", pdfErr);
        return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 500 });
      }
    } else if (!extractedText && url) {
      // Fallback for txt/md if passed as URL
      const response = await fetch(url);
      if (response.ok) {
        extractedText = await response.text();
      }
    }

    if (!extractedText) {
      return NextResponse.json({ error: "No text to embed" }, { status: 400 });
    }

    const adminClient = getAdminClient();
    const { chunksStored } = await embedAndStoreDocument(documentId, extractedText, adminClient);
    return NextResponse.json({ success: true, chunksStored });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
