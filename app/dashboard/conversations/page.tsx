"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { MessageSquare, ChevronRight, Search, Bot } from "lucide-react";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: teamData } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', session.user.id)
        .single();

      if (teamData?.team_id) {
        const { data: agents } = await supabase
          .from('agents')
          .select('id')
          .eq('team_id', teamData.team_id);

        const agentIds = agents?.map((a: any) => a.id) || [];

        if (agentIds.length > 0) {
          const { data, error } = await supabase
            .from('conversations')
            .select(`
              id,
              created_at,
              agent_id,
              agents (name)
            `)
            .in('agent_id', agentIds)
            .order('created_at', { ascending: false });

          if (!error && data) {
            setConversations(data);
          }
        }
      }
      setLoading(false);
    }
    fetchConversations();
  }, []);

  return (
    <div className="space-y-8 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Agent <GradientText className="text-gradient">Conversations</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Review and analyze interactions with your AI agents.</p>
          </div>
        </div>
      </FadeInSection>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 text-white/20 gap-4 animate-pulse">
           <Search size={40} className="opacity-20" />
           <p className="text-sm font-medium tracking-widest uppercase">Fetching interaction logs...</p>
        </div>
      ) : conversations.length === 0 ? (
        <FadeInSection>
          <GlassCard variant="medium" className="p-20 text-center bg-white/[0.01] border-dashed border-2 border-white/5 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6 text-white/10">
               <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white/80">No Conversations Yet</h3>
            <p className="text-white/30 text-sm max-w-sm mx-auto">Deploy your agent or use the built-in test chat to start generating interaction data.</p>
            <button 
              onClick={() => window.location.href = '/dashboard/agents'}
              className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-sans"
            >
              Go to Agents
            </button>
          </GlassCard>
        </FadeInSection>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conv, i) => (
            <FadeInSection key={conv.id} delay={i * 0.05}>
              <GlassCard variant="medium" className="p-6 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center">
                    <Bot size={20} className="text-accent-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-accent-purple transition-colors">Session #{conv.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1 font-sans">
                      Agent: <span className="text-white/60">{(conv.agents as any)?.name || 'Unnamed Agent'}</span> • 
                      {new Date(conv.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-accent-purple transition-all text-white/20 group-hover:text-white">
                     <ChevronRight size={18} />
                   </div>
                </div>
              </GlassCard>
            </FadeInSection>
          ))}
        </div>
      )}
    </div>
  );
}
