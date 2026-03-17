export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getRouteClient } from "@/lib/supabaseServer";
import { retrieveContext } from "@/lib/rag_engine";

// GET /api/knowledge/search?agentId=...&query=...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const agentId = url.searchParams.get("agentId");
    const query = url.searchParams.get("query");

    if (!agentId || !query) {
      return NextResponse.json({ error: "agentId and query are required" }, { status: 400 });
    }

    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const context = await retrieveContext(query, agentId, 5, supabase);
    return NextResponse.json({ results: context, query });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Also support the embed endpoint used by knowledge page
export async function POST(request: Request) {
  try {
    const supabase = getRouteClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { agentId, query, limit = 5 } = body;

    if (!agentId || !query) {
      return NextResponse.json({ error: "agentId and query are required" }, { status: 400 });
    }

    const context = await retrieveContext(query, agentId, limit, supabase);
    return NextResponse.json({ results: context, query });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
