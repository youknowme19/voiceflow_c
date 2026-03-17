import { NextResponse } from "next/server";
import { embedAndStoreDocument } from "@/lib/rag_engine";
import { getAdminClient, getRouteClient } from "@/lib/supabaseServer";

// POST /api/knowledge/embed
export async function POST(request: Request) {
  try {
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { documentId, text } = await request.json();

    const adminClient = getAdminClient();
    const { chunksStored } = await embedAndStoreDocument(documentId, text, adminClient);
    return NextResponse.json({ success: true, chunksStored });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
