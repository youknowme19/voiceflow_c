export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { runAgent } from "@/lib/runtime/agentRunner";
import { getAdminClient } from "@/lib/supabaseServer";

// CORS headers for embedded widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/widget/[agentId] — return agent info for widget initialization
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  try {
    const adminClient = getAdminClient();
    const { data: agent, error } = await adminClient
      .from("agents")
      .select("id, name, description, settings")
      .eq("id", agentId)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(
      {
        agentId: agent.id,
        name: agent.name,
        description: agent.description,
        settings: {
          welcomeMessage: agent.settings?.welcomeMessage || `Hello! I'm ${agent.name}. How can I help you?`,
          primaryColor: agent.settings?.primaryColor || "#6366f1",
          logo: agent.settings?.logo || null,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/widget/[agentId] — public chat (no auth, uses service role)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  try {
    const body = await request.json();
    const { message, conversationId: existingConversationId, sessionId } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400, headers: corsHeaders });
    }
    const adminClient = getAdminClient();

    // Verify agent exists
    const { data: agent } = await adminClient
      .from("agents")
      .select("id, name, team_id")
      .eq("id", agentId)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
    }

    // Create or reuse conversation
    let conversationId = existingConversationId;

    if (!conversationId) {
      // Get latest version to pin
      const { data: latestVer } = await adminClient
        .from("agent_versions")
        .select("version")
        .eq("agent_id", agentId)
        .order("version", { ascending: false })
        .limit(1)
        .single();

      const { data: newConv } = await adminClient
        .from("conversations")
        .insert({
          agent_id: agentId,
          status: "active",
          workflow_version: latestVer?.version ?? null,
        })
        .select("id")
        .single();

      conversationId = newConv?.id;
    }

    if (!conversationId) {
      throw new Error("Failed to create conversation");
    }

    // Save user message
    await adminClient.from("messages").insert({
      conversation_id: conversationId,
      sender: "user",
      content: message.trim(),
      metadata: { sessionId },
    });

    // Run workflow
    const { output } = await runAgent(agentId, message.trim(), conversationId, adminClient);

    // Save assistant response
    await adminClient.from("messages").insert({
      conversation_id: conversationId,
      sender: "assistant",
      content: output,
    });

    return NextResponse.json({ reply: output, conversationId }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[/api/widget]", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again.", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
