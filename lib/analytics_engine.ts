import { getAdminClient } from "@/lib/supabaseServer";

export interface AnalyticsLog {
  agentId: string;
  conversationId: string;
  userMessage?: string;
  aiResponse?: string;
  latencyMs: number;
  tokensUsed: number;
  success: boolean;
}

/**
 * Log conversation details and update aggregate analytics
 */
export async function logExecutionAnalytics(log: AnalyticsLog) {
  const supabase = getAdminClient();

  try {
    const {
      agentId,
      conversationId,
      userMessage,
      aiResponse,
      latencyMs = 0,
      tokensUsed = 0,
      success,
    } = log;

    // 1. Update conversation with final stats
    await supabase
      .from("conversations")
      .update({
        ai_response: aiResponse,
        user_message: userMessage,
        latency_ms: latencyMs,
        tokens_used: tokensUsed,
        status: success ? "completed" : "failed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // 2. Upsert aggregate analytics row per agent
    const { data: current } = await supabase
      .from("analytics")
      .select("*")
      .eq("agent_id", agentId)
      .single();

    if (current) {
      const totalReq = (current.total_requests || 0) + 1;
      const newLatency = Math.round(
        ((current.avg_latency || 0) * (current.total_requests || 0) + latencyMs) / totalReq
      );
      const prevSuccessful = Math.round((current.total_requests || 0) * ((current.success_rate || 0) / 100));
      const newSuccessRate = (((prevSuccessful + (success ? 1 : 0)) / totalReq) * 100).toFixed(2);
      const newTokenCost = (Number(current.token_cost) || 0) + (tokensUsed / 1000) * 0.0002;

      await supabase
        .from("analytics")
        .update({
          total_requests: totalReq,
          avg_latency: newLatency,
          success_rate: newSuccessRate,
          token_cost: newTokenCost,
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id);
    } else {
      await supabase.from("analytics").insert({
        agent_id: agentId,
        total_requests: 1,
        avg_latency: latencyMs,
        success_rate: success ? 100 : 0,
        token_cost: (tokensUsed / 1000) * 0.0002,
      });
    }
  } catch (error) {
    // Non-fatal — analytics failures should never crash the conversation
    console.error("[Analytics] Failed to log:", error);
  }
}
