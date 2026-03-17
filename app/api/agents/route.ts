import { NextResponse } from 'next/server';
import { getRouteClient } from '../../../lib/supabaseServer';

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
      console.error("[/api/agents] Auth failed. Token exists:", !!token, "Error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    let teamId = url.searchParams.get('teamId');

    if (!teamId) {
      // Auto-detect team
      const { data: teamAccess } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!teamAccess) {
        return NextResponse.json([]); // No team, no agents
      }
      teamId = teamAccess.team_id;
    }

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('team_id', teamId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    const supabase = getRouteClient(request);
    const body = await request.json();
    const { name, description, teamId, model_provider = 'openrouter', model_name = 'openai/gpt-4o-mini' } = body;

    if (!name || !teamId) {
      return NextResponse.json({ error: "Name and teamId required" }, { status: 400 });
    }

    // Explicitly pass token to getUser
    const { data: { user }, error: authError } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[/api/agents] POST Auth failed. Token exists:", !!token, "Error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check agent limits
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('team_id', teamId)
      .single();

    const plan = subData?.plan_id || 'starter';
    const limit = plan === 'starter' ? 2 : plan === 'pro' ? 10 : plan === 'business' ? 50 : 1000;

    const { count } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);

    if (count !== null && count >= limit) {
      return NextResponse.json({ error: `Agent limit reached for ${plan} plan.` }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("agents")
      .insert({
        name,
        description,
        team_id: teamId,
        model_provider,
        model_name
      })
      .select()
      .single();

    if (error) throw error;

    const agentId = data.id;

    // Create Boilerplate Workflow: START -> KNOWLEDGE -> AI -> END
    const nodes = [
      { id: 'node_start', agent_id: agentId, type: 'start', position: { x: 50, y: 250 }, data: { label: 'Start' } },
      { id: 'node_welcome', agent_id: agentId, type: 'text', position: { x: 250, y: 250 }, data: { text: "Hello! I'm your AI assistant. How can I help you today?" } },
      { id: 'node_knowledge', agent_id: agentId, type: 'knowledge', position: { x: 450, y: 250 }, data: { label: 'Knowledge Base' } },
      { id: 'node_ai', agent_id: agentId, type: 'ai', position: { x: 650, y: 250 }, data: { systemPrompt: "You are a helpful AI assistant. Use the knowledge provided to answer accurately.", outputVariable: "ai_response" } },
      { id: 'node_end', agent_id: agentId, type: 'end', position: { x: 850, y: 250 }, data: { label: 'End' } }
    ];

    const edges = [
      { id: 'edge_1', agent_id: agentId, source: 'node_start', target: 'node_welcome' },
      { id: 'edge_2', agent_id: agentId, source: 'node_welcome', target: 'node_knowledge' },
      { id: 'edge_3', agent_id: agentId, source: 'node_knowledge', target: 'node_ai' },
      { id: 'edge_4', agent_id: agentId, source: 'node_ai', target: 'node_end' }
    ];

    await supabase.from('nodes').insert(nodes);
    await supabase.from('edges').insert(edges);

    // Create Initial Version
    await supabase.from('agent_versions').insert({
      agent_id: agentId,
      version: 1,
      flow: { nodes, edges }
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getRouteClient(request);
    const url = new URL(request.url);
    const agentId = url.searchParams.get('id');

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
