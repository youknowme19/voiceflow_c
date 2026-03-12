import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { runAgent } from "@/lib/runtime/agentRunner";

export async function POST(request: Request) {
  try {
    const { text, agentId, conversationId } = await request.json();

    if (!agentId || !text) {
      return NextResponse.json(
        { error: "agentId and text required" },
        { status: 400 }
      );
    }

    // Verify agent exists (allow public access without auth)
    const { data: agent } = await supabase
      .from("agents")
      .select("id")
      .eq("id", agentId)
      .single();

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Create or use conversation
    let convId = conversationId;
    if (!convId) {
      const { data: convData, error: convErr } = await supabase
        .from("conversations")
        .insert({ agent_id: agentId, status: "active" })
        .select("id")
        .single();

      if (convErr) {
        return NextResponse.json(
          { error: convErr.message },
          { status: 500 }
        );
      }
      convId = convData.id;
    }

    // Log user message
    await supabase.from("messages").insert({
      conversation_id: convId,
      sender: "user",
      content: text,
    });

    // Run agent workflow
    const { output, logs } = await runAgent(agentId, text, convId, supabase);

    // Log AI message
    await supabase.from("messages").insert({
      conversation_id: convId,
      sender: "agent",
      content: output,
      metadata: { logs },
    });

    return NextResponse.json({
      reply: output,
      conversationId: convId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
