export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getRouteClient } from "@/lib/supabaseServer";
import { runAgent } from "@/lib/runtime/agentRunner";

// GET /api/agents/[id]/test — fetch conversation test sessions for an agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        status,
        started_at,
        ended_at,
        latency_ms,
        tokens_used,
        workflow_version
      `)
      .eq("agent_id", agentId)
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ conversations: conversations || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/agents/[id]/test — run a test message through the agent workflow
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const { text, conversationId: existingConversationId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    const supabase = getRouteClient(request);
    
    // Explicitly pass token to getUser
    const { data: { user }, error: authError } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get or create conversation (test mode)
    let conversationId = existingConversationId;
    if (!conversationId) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          agent_id: agentId,
          user_id: user.id,
          status: 'active'
        })
        .select('id')
        .single();
      
      if (convError) throw convError;
      conversationId = newConv.id;
    }

    // 2. Save user message
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender: 'user',
      content: text
    });

    // 3. Run the agent workflow
    console.log("[Agent Test] Running workflow for agent:", agentId, "conv:", conversationId);
    let result;
    try {
      result = await runAgent(agentId, text, conversationId, supabase);
      console.log("[Agent Test] Workflow result:", !!result);
    } catch (runErr: any) {
      console.error("[Agent Test] runAgent failed:", runErr);
      throw new Error(`Workflow execution failed: ${runErr.message}`);
    }

    const { output, logs } = result;

    // 4. Save agent message
    console.log("[Agent Test] Saving assistant message...");
    const { error: msgErr } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender: 'assistant',
      content: output || "No response generated.",
      metadata: { logs }
    });
    
    if (msgErr) {
      console.error("[Agent Test] Failed to save message:", msgErr);
      // Don't throw here, just log it as it's not fatal for the response
    }

    return NextResponse.json({
      reply: output,
      conversationId,
      metadata: { logs }
    });
  } catch (error: any) {
    console.error("[Agent Test API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
