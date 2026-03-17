"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";

interface Member {
  id: string;
  role: string;
  user: { email: string };
}

export default function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [members, setMembers] = useState<Member[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", session.user.id)
          .single();
        if (data?.team_id) {
          setTeamId(data.team_id);
          loadMembers(data.team_id);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const loadMembers = async (tid: string) => {
    const { data } = await supabase
      .from("team_members")
      .select("id,role,user:user_id(email)")
      .eq("team_id", tid);
    setMembers(data as any || []);
  };

  const [inviting, setInviting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const invite = async () => {
    if (!teamId || !email) return;
    setInviting(true);
    setMsg(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email, role, teamId }),
      });
      const data = await res.json();
      if (data.success) {
        setEmail("");
        setMsg({ type: 'success', text: `Invitation sent to ${email}` });
        loadMembers(teamId);
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to send invitation' });
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: 'Network error or server unavailable' });
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-12 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Team <GradientText className="text-gradient">Management</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Collaborate and manage access levels for your workspace.</p>
          </div>
        </div>
      </FadeInSection>

      <div className="grid lg:grid-cols-3 gap-10">
        <FadeInSection delay={0.1} className="lg:col-span-1">
          <GlassCard variant="medium" className="p-8 border-accent-cyan/20 bg-accent-cyan/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <span className="w-2 h-6 bg-accent-cyan rounded-full" />
               Invite Member
            </h3>
            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="collaborator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Workspace Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan outline-none transition-all"
                >
                  <option value="owner" className="bg-gray-900 text-white">Owner</option>
                  <option value="editor" className="bg-gray-900 text-white">Editor</option>
                  <option value="viewer" className="bg-gray-900 text-white">Viewer</option>
                </select>
              </div>

              {msg && (
                <div className={`p-3 rounded-lg text-xs font-medium border ${
                  msg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {msg.text}
                </div>
              )}

              <button
                onClick={invite}
                disabled={inviting || !email}
                className="w-full py-4 mt-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                {inviting ? "Processing..." : "Send Invitation"}
              </button>
            </div>
          </GlassCard>
        </FadeInSection>

        <FadeInSection delay={0.2} className="lg:col-span-2">
          <div className="space-y-4">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <span className="w-2 h-6 bg-accent-purple rounded-full" />
               Workspace Members
            </h3>

            {loading ? (
              <div className="text-white/20 py-10">Syncing team records...</div>
            ) : (
              <div className="grid gap-3">
                {members.map((m, i) => (
                  <GlassCard key={m.id} variant="medium" className="p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center font-bold text-xs">
                          {m.user?.email?.[0].toUpperCase() || '?'}
                       </div>
                       <div>
                          <p className="font-bold text-sm">{m.user?.email || 'Unknown User'}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">Invited • {i === 0 ? 'Workspace Admin' : 'Active Member'}</p>
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      m.role === 'owner' ? 'border-accent-purple/50 text-accent-purple bg-accent-purple/5' : 'border-white/10 text-white/40 bg-white/5'
                    }`}>
                       {m.role}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
