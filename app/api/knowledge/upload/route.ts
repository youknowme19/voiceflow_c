export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { embedAndStoreDocument } from "@/lib/rag_engine";
import { getAdminClient, getRouteClient } from "@/lib/supabaseServer";

// POST /api/knowledge/upload — upload doc, chunk, embed, store
export async function POST(request: Request) {
  try {
    const supabase = getRouteClient(request);
    const adminClient = getAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { agentId, content, name, type = "text" } = body;

    if (!agentId || !content) {
      return NextResponse.json({ error: "agentId and content are required" }, { status: 400 });
    }

    // Verify user has access to this agent
    const { data: agent } = await supabase
      .from("agents")
      .select("id, team_id")
      .eq("id", agentId)
      .single();
    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

    // Create knowledge_documents record
    const { data: doc, error: docError } = await adminClient
      .from("knowledge_documents")
      .insert({
        agent_id: agentId,
        team_id: agent.team_id,
        name: name || `Document (${new Date().toLocaleDateString()})`,
        type,
        metadata: { uploadedBy: user.id, chars: content.length },
      })
      .select("id")
      .single();

    if (docError) throw docError;

    // Chunk and embed the document  
    const { chunksStored } = await embedAndStoreDocument(doc.id, content, adminClient);

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      chunksStored,
      message: `Document embedded with ${chunksStored} chunks.`,
    });
  } catch (error: any) {
    console.error("[/api/knowledge/upload]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
