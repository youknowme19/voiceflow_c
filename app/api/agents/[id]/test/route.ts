import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabaseClient";
import { runAgent } from "../../../../../lib/runtime/agentRunner";

export async function POST(request: Request) {
  const { text, agentId, conversationId } = await request.json();
  if (!agentId || !text) {
    return NextResponse.json({ error: "agentId and text required" }, { status: 400 });
  }

  // Check credits
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: credits } = await supabase
    .from("usage_credits")
    .select("credits")
    .eq("user_id", user.user?.id)
    .single();

  if (!credits || credits.credits <= 0) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  // create or use conversation
  let convId = conversationId;
  if (!convId) {
    const { data: convData, error: convErr } = await supabase
      .from("conversations")
      .insert({ agent_id: agentId, status: "active" })
      .select("id")
      .single();
    if (convErr) return NextResponse.json({ error: convErr.message }, { status: 500 });
    convId = convData.id;
  }

  // log user message
  await supabase.from("messages").insert({
    conversation_id: convId,
    sender: "user",
    content: text,
  });

  try {
    // Run agent workflow engine
    const { output, logs } = await runAgent(agentId, text, convId, supabase);

    // log ai message
    await supabase.from("messages").insert({
      conversation_id: convId,
      sender: "agent",
      content: output,
      metadata: { logs },
    });

    // Log execution in agent_logs
    await supabase.from("agent_logs").insert({
      agent_id: agentId,
      conversation_id: convId,
      event_type: "workflow_execution",
      details: logs,
    });

    // Deduct credits (1 credit per AI call)
    await supabase
      .from("usage_credits")
      .update({ credits: credits.credits - 1 })
      .eq("user_id", user.user?.id);

    return NextResponse.json({ reply: output, conversationId: convId, logs });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Workflow execution failed: " + error.message },
      { status: 500 }
    );
  }
}
