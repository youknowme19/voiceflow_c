export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getRouteClient } from "@/lib/supabaseServer";

// GET /api/agents/[id]/workflow — load current nodes + edges
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [{ data: nodes, error: nodesErr }, { data: edges, error: edgesErr }] = await Promise.all([
      supabase.from("nodes").select("*").eq("agent_id", id).order("created_at"),
      supabase.from("edges").select("*").eq("agent_id", id).order("created_at"),
    ]);

    if (nodesErr) throw nodesErr;
    if (edgesErr) throw edgesErr;

    // Also return the latest version number for reference
    const { data: latestVer } = await supabase
      .from("agent_versions")
      .select("version")
      .eq("agent_id", id)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      nodes: nodes || [],
      edges: edges || [],
      latestVersion: latestVer?.version ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/agents/[id]/workflow — save workflow + create version snapshot
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: agentId } = await params;
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { nodes, edges } = body as { nodes: any[]; edges: any[] };

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: "nodes and edges arrays are required" }, { status: 400 });
    }

    // Determine next version number
    const { data: lastVer } = await supabase
      .from("agent_versions")
      .select("version")
      .eq("agent_id", agentId)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const nextVersion = (lastVer?.version ?? 0) + 1;

    // Create version snapshot BEFORE overwriting nodes/edges
    await supabase.from("agent_versions").insert({
      agent_id: agentId,
      version: nextVersion,
      flow: { nodes, edges, savedAt: new Date().toISOString() },
    });

    // Delete existing nodes and edges, then re-insert
    await supabase.from("edges").delete().eq("agent_id", agentId);
    await supabase.from("nodes").delete().eq("agent_id", agentId);

    if (nodes.length > 0) {
      const { error: nodesErr } = await supabase.from("nodes").insert(
        nodes.map((n: any) => ({
          id: n.id, // Use the frontend's node ID so they stay consistent
          agent_id: agentId,
          type: n.type,
          data: n.data || {},
          position: n.position || { x: 0, y: 0 },
        }))
      );
      if (nodesErr) throw nodesErr;
    }

    if (edges.length > 0) {
      const { error: edgesErr } = await supabase.from("edges").insert(
        edges.map((e: any) => ({
          agent_id: agentId,
          source: e.source || e.from,
          target: e.target || e.to,
          data: e.data || {},
        }))
      );
      if (edgesErr) throw edgesErr;
    }

    return NextResponse.json({ success: true, version: nextVersion, nodeCount: nodes.length, edgeCount: edges.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
