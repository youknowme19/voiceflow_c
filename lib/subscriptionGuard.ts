import { getAdminClient } from "@/lib/supabaseServer";

export interface PlanLimits {
  maxAgents: number;
  maxMonthlyRequests: number;
  maxTokensPerMonth: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  starter:  { maxAgents: 2,   maxMonthlyRequests: 500,   maxTokensPerMonth: 50_000  },
  pro:      { maxAgents: 20,  maxMonthlyRequests: 10_000, maxTokensPerMonth: 500_000 },
  business: { maxAgents: 100, maxMonthlyRequests: 50_000, maxTokensPerMonth: 2_000_000 },
  enterprise: { maxAgents: 999, maxMonthlyRequests: 999_999, maxTokensPerMonth: 999_999_999 },
};

export function getPlanLimits(planName: string): PlanLimits {
  return PLAN_LIMITS[planName.toLowerCase()] || PLAN_LIMITS.starter;
}

/**
 * Get the current plan name for a team.
 */
export async function getTeamPlan(teamId: string): Promise<string> {
  // Check users table first (direct plan_id field used in codebase)
  const { data: sub } = await getAdminClient()
    .from("subscriptions")
    .select("plan_id")
    .eq("team_id", teamId)
    .single();

  return sub?.plan_id || "starter";
}

/**
 * Check if a team can create more agents.
 * Throws an error if they have hit the limit.
 */
export async function checkAgentLimit(teamId: string): Promise<void> {
  const planName = await getTeamPlan(teamId);
  const limits = getPlanLimits(planName);

  const { count } = await getAdminClient()
    .from("agents")
    .select("*", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (count !== null && count >= limits.maxAgents) {
    throw new Error(
      `Agent limit reached for ${planName} plan (${limits.maxAgents} agents max). Please upgrade your plan.`
    );
  }
}

/**
 * Check and increment usage credits for a team.
 * Throws if they've exceeded the monthly request limit.
 */
export async function checkAndIncrementUsage(teamId: string, tokensUsed = 0): Promise<void> {
  const planName = await getTeamPlan(teamId);
  const limits = getPlanLimits(planName);

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01"; // YYYY-MM-01

  // Upsert usage record for this month
  const { data: usage } = await getAdminClient()
    .from("usage_credits")
    .select("*")
    .eq("team_id", teamId)
    .eq("month", currentMonth)
    .single();

  if (usage && usage.used >= limits.maxMonthlyRequests) {
    throw new Error(
      `Monthly request limit reached for ${planName} plan (${limits.maxMonthlyRequests} requests/month). Please upgrade.`
    );
  }

  // Increment usage
  if (usage) {
    await getAdminClient()
      .from("usage_credits")
      .update({ used: usage.used + 1 })
      .eq("id", usage.id);
  } else {
    await getAdminClient()
      .from("usage_credits")
      .insert({ team_id: teamId, used: 1, month: currentMonth });
  }
}
