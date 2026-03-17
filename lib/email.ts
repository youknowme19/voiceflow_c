import { getAdminClient } from "./supabaseServer";

export async function sendTeamInvitation(email: string, teamName: string, inviteLink: string) {
  console.log(`[EMAIL MOCK] Sending invitation to ${email} for team ${teamName}. Link: ${inviteLink}`);
  
  // In a real app, you would use Resend or SendGrid here:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'VoiceBuild <invites@voicebuild.ai>',
    to: email,
    subject: `Join ${teamName} on VoiceBuild`,
    html: `<p>You've been invited to join <strong>${teamName}</strong> on VoiceBuild.</p><p><a href="${inviteLink}">Click here to join</a></p>`
  });
  */
  
  return { success: true };
}
