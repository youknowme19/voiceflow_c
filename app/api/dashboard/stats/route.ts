import { NextResponse } from 'next/server';
import { getRouteClient } from '../../../../lib/supabaseServer';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    const supabase = getRouteClient(request);
    
    // Explicitly pass token to getUser to be 100% sure we're authenticating correctly
    const { data: { user }, error: authError } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[/api/dashboard/stats] Auth failed. Token exists:", !!token, "Error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: teamAccess } = await supabase
      .from('team_members')
      .select('team_id, role, teams(name)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!teamAccess) {
      // Check for pending invites
      const { data: pendingInvites } = await supabase
        .from('team_invites')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'pending');

      if (pendingInvites && pendingInvites.length > 0) {
        // Automatically accept first invite for now
        const invite = pendingInvites[0];
        await supabase.from('team_members').insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: invite.role
        });
        await supabase.from('team_invites').update({ status: 'accepted' }).eq('id', invite.id);
        
        // Re-fetch team access
        return GET(request); 
      }

      return NextResponse.json({ error: "No team assigned" }, { status: 403 });
    }

    const teamId = teamAccess.team_id;

    // Get agents for the team
    const { count: activeAgents } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);

    // Get analytics sum/avg for team's agents
    // Need to get all agent IDs first
    const { data: agents } = await supabase
      .from('agents')
      .select('id')
      .eq('team_id', teamId);

    const agentIds = agents?.map((a: any) => a.id) || [];
    
    let totalCalls = 0;
    let avgResponseTime = 0;
    let successRate = 0;

    if (agentIds.length > 0) {
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('total_requests, avg_latency, success_rate')
        .in('agent_id', agentIds);
      
      if (analyticsData && analyticsData.length > 0) {
        let totalLatencySum = 0;
        let totalSuccessSum = 0;
        let totalAgentsWithStats = 0;

        for (const stat of analyticsData) {
          totalCalls += stat.total_requests || 0;
          if (stat.total_requests > 0) {
             totalLatencySum += stat.avg_latency || 0;
             totalSuccessSum += stat.success_rate || 0;
             totalAgentsWithStats += 1;
          }
        }
        
        if (totalAgentsWithStats > 0) {
          avgResponseTime = totalLatencySum / totalAgentsWithStats;
          successRate = totalSuccessSum / totalAgentsWithStats;
        }
      }
    }

    // Get Subscriptions / Credits
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('plan_id, status, billing_plans(name, credits)')
      .eq('team_id', teamId)
      .single();

    const planData = (subData as any)?.billing_plans;
    const totalCredits = planData?.credits || 1000;

    const { data: usageCredits } = await supabase
      .from('usage_credits')
      .select('used')
      .eq('team_id', teamId)
      .eq('month', new Date().toISOString().slice(0, 7) + '-01') // Current month
      .single();

    const usedCredits = usageCredits?.used || 0;
    const remainingCredits = Math.max(0, totalCredits - usedCredits);

    // Get Recent Conversations (actual data)
    const { data: recentConvs } = await supabase
      .from('conversations')
      .select(`
        id,
        created_at,
        agent_id,
        agents (name)
      `)
      .in('agent_id', agentIds)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get User Name with fallback to public.users table
    let displayName = user.user_metadata?.name;
    
    if (!displayName) {
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();
      displayName = userData?.name;
    }

    if (!displayName) {
      displayName = user.email?.split('@')[0] || 'User';
    }

    return NextResponse.json({
      stats: {
        activeAgents: activeAgents || 0,
        totalCalls,
        avgResponseTime: Math.round(avgResponseTime),
        successRate: successRate.toFixed(1),
        credits: remainingCredits,
        plan: (subData as any)?.billing_plans?.name?.toLowerCase() || 'starter'
      },
      team: {
        name: (teamAccess as any).teams?.name || 'My Team',
        id: teamId
      },
      user: {
        email: user.email,
        name: displayName
      },
      recentConversations: recentConvs || []
    });

  } catch (error: any) {
    console.error("[/api/dashboard/stats] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
