export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getRouteClient } from "@/lib/supabaseServer";

// GET /api/analytics?teamId=... OR /api/analytics?agentId=...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const teamId = url.searchParams.get("teamId");
    const agentId = url.searchParams.get("agentId");

    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // First get the user's agents
    let agentIds: string[] = [];

    if (agentId) {
      agentIds = [agentId];
    } else if (teamId) {
      const { data: agents } = await supabase
        .from("agents")
        .select("id")
        .eq("team_id", teamId);
      agentIds = (agents || []).map((a: any) => a.id);
    } else {
      // Get all agents for this user's teams
      const { data: memberships } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id);
      const teamIds = (memberships || []).map((m: any) => m.team_id);
      if (teamIds.length > 0) {
        const { data: agents } = await supabase
          .from("agents")
          .select("id, name")
          .in("team_id", teamIds);
        agentIds = (agents || []).map((a: any) => a.id);
      }
    }

    if (agentIds.length === 0) {
      return NextResponse.json({ analytics: [], summary: { totalRequests: 0, avgLatency: 0, successRate: 0 } });
    }

    const { data: analytics, error } = await supabase
      .from("analytics")
      .select("*")
      .in("agent_id", agentIds);

    if (error) throw error;

    // Compute summary
    const summary = (analytics || []).reduce(
      (acc: any, row: any) => ({
        totalRequests: acc.totalRequests + (row.total_requests || 0),
        totalLatency: acc.totalLatency + (row.avg_latency || 0) * (row.total_requests || 0),
        totalSuccess: acc.totalSuccess + (row.success_rate || 0) * (row.total_requests || 0),
        totalCost: acc.totalCost + (row.token_cost || 0),
      }),
      { totalRequests: 0, totalLatency: 0, totalSuccess: 0, totalCost: 0 }
    );

    const avgLatency = summary.totalRequests > 0 ? Math.round(summary.totalLatency / summary.totalRequests) : 0;
    const successRate = summary.totalRequests > 0 ? Math.round(summary.totalSuccess / summary.totalRequests) : 0;

    // Also get recent conversations
    const { data: recentConvs } = await supabase
      .from("conversations")
      .select("id, agent_id, status, started_at, latency_ms, tokens_used")
      .in("agent_id", agentIds)
      .order("started_at", { ascending: false })
      .limit(20);

    // Also get recent conversation telemetry for time-series
    const { data: telemetry } = await supabase
      .from("conversations")
      .select("started_at, latency_ms")
      .in("agent_id", agentIds)
      .order("started_at", { ascending: true })
      .limit(100);

    const timeSeries = (telemetry || []).map((t: any) => ({
      name: new Date(t.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: t.latency_ms,
    }));

    return NextResponse.json({
      analytics: analytics && analytics.length > 0 ? analytics[0] : null,
      recentConversations: recentConvs || [],
      timeSeries,
      summary: {
        totalRequests: summary.totalRequests,
        avgLatencyMs: avgLatency,
        successRate,
        totalCost: summary.totalCost.toFixed(4),
        activeAgents: agentIds.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
