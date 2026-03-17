import { NextResponse } from "next/server";
import { getRouteClient, getAdminClient } from "@/lib/supabaseServer";

export async function PATCH(request: Request) {
  try {
    const { name, phone, country_code, company } = await request.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    const supabase = getRouteClient(request);
    
    // Explicitly pass token to getUser to be 100% sure we're authenticating correctly
    const { data: { user }, error: getUserError } = (token && token !== 'undefined') 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (getUserError || !user) {
      console.error("[/api/user/profile] Auth failed. Auth header present:", !!authHeader, "Token value:", token, "Error:", getUserError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Update Auth metadata
    // We try to update via the standard user client first
    const { error: authError } = await supabase.auth.updateUser({
      data: { 
        name: name,
        phone: phone,
        country_code: country_code,
        company: company
      }
    });
    
    if (authError) {
      console.error("Auth metadata update failed:", authError);
    }

    // 2. Sync with public.users table - this is the source of truth for the platforms UI
    const adminClient = getAdminClient();
    const { error: dbError } = await adminClient
      .from('users')
      .upsert({ 
        id: user.id, 
        name: name,
        email: user.email,
        phone: phone,
        country_code: country_code,
        company: company
      });
    
    if (dbError) {
      return NextResponse.json({ error: "Database sync failed: " + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, name });
  } catch (error: any) {
    console.error("[/api/user/profile] crash:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
