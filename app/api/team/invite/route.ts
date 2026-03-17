export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getRouteClient, getAdminClient } from "@/lib/supabaseServer";
import { sendTeamInvitation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, role, teamId } = await request.json();
    if (!email || !role || !teamId) {
      return NextResponse.json({ error: "email, role, teamId required" }, { status: 400 });
    }

    // Use admin client to look up or create user to avoid RLS restrictions on auth.users
    const adminClient = getAdminClient();
    const { data: { users }, error: searchError } = await adminClient.auth.admin.listUsers();
    
    // Fallback: check if we can add to team_members directly if user exists
    let existingUser = users?.find((u: any) => u.email === email);
    
    if (existingUser) {
      const { error: memberError } = await adminClient
        .from('team_members')
        .insert({ team_id: teamId, user_id: existingUser.id, role: role });
      if (memberError && memberError.code !== '23505') throw memberError; // Ignore unique constraint if already in team
    }

    // 2. Always create/upsert a record in team_invites for tracking
    const { error: inviteError } = await adminClient.from("team_invites").upsert({
      team_id: teamId,
      email,
      role,
      status: existingUser ? 'accepted' : 'pending'
    });

    if (inviteError) throw inviteError;

    // 3. "Send" the invitation email (simulated for now)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/signup?invite=${email}&teamId=${teamId}`;
    
    const { data: teamData } = await adminClient.from('teams').select('name').eq('id', teamId).single();
    await sendTeamInvitation(email, teamData?.name || "the team", inviteLink);

    return NextResponse.json({ 
      success: true, 
      message: existingUser ? "User added to team" : "Invitation sent via email" 
    });
  } catch (error: any) {
    console.error("Invitation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
