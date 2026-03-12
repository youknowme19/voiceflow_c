import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(request: Request) {
  const { email, role, teamId } = await request.json();
  if (!email || !role || !teamId) {
    return NextResponse.json({ error: "email, role, teamId required" }, { status: 400 });
  }
  // lookup user by email
  const { data } = await supabase.auth.admin.listUsers();
  const users = data?.users || [];
  const user = users.find((u: any) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  const { error } = await supabase.from("team_members").insert({
    team_id: teamId,
    user_id: user.id,
    role,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
