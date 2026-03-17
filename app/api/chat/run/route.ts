export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runAgent } from "@/lib/runtime/agentRunner";
import { checkAndIncrementUsage } from "@/lib/subscriptionGuard";

function makeSupabaseClient(authHeader: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  return createClient(
    url,
    key,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  );
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { agentId, userMessage, conversationId: existingConversationId } = body;

    if (!agentId || !userMessage?.trim()) {
      return NextResponse.json({ error: "agentId and userMessage are required" }, { status: 400 });
    }

    const authHeader = request.headers.get("Authorization");
    const supabase = makeSupabaseClient(authHeader);

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get agent to verify ownership + get team
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("id, name, team_id, model_provider, model_name")
      .eq("id", agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Subscription check
    try {
      await checkAndIncrementUsage(agent.team_id);
    } catch (limitErr: any) {
      return NextResponse.json({ error: limitErr.message }, { status: 429 });
    }

    // Create or reuse conversation
    let conversationId = existingConversationId;
    let workflowVersion: number | null = null;

    if (!conversationId) {
      // Get the latest workflow version to pin this conversation to
      const { data: latestVersion } = await supabase
        .from("agent_versions")
        .select("version")
        .eq("agent_id", agentId)
        .order("version", { ascending: false })
        .limit(1)
        .single();

      workflowVersion = latestVersion?.version ?? null;

      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          agent_id: agentId,
          user_id: user.id,
          status: "active",
          workflow_version: workflowVersion,
        })
        .select("id")
        .single();

      if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);
      conversationId = newConv.id;
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender: "user",
      content: userMessage.trim(),
    });

    // Run the workflow
    const { output, logs } = await runAgent(agentId, userMessage.trim(), conversationId, supabase);

    // Save assistant response
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender: "assistant",
      content: output,
      metadata: { latencyMs: Date.now() - startTime, logs },
    });

    // Update conversation end time + latency
    await supabase
      .from("conversations")
      .update({
        status: "active",
        ended_at: new Date().toISOString(),
        latency_ms: Date.now() - startTime,
      })
      .eq("id", conversationId);

    return NextResponse.json({
      reply: output,
      conversationId,
      agentId,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error("[/api/chat/run]", error);
    return NextResponse.json(
      { error: "Sorry, something went wrong. Please try again.", details: error.message },
      { status: 500 }
    );
  }
}
