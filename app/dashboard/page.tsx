"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Phone, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  Code2,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { GlassCard, GradientText, FadeInSection } from '@/components/premium/PremiumUI';

export default function DashboardOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { label: 'Active Agents', value: statsData?.stats?.activeAgents ?? '0', trend: 'Online', icon: Bot, color: 'text-accent-purple' },
    { label: 'Total Calls', value: statsData?.stats?.totalCalls ?? '0', trend: 'Live Feed', icon: Phone, color: 'text-accent-cyan' },
    { label: 'Avg. Latency', value: statsData?.stats?.avgResponseTime ? `${statsData.stats.avgResponseTime}ms` : '-', trend: 'Performance', icon: Zap, color: 'text-yellow-400' },
    { label: 'Success Rate', value: statsData?.stats?.successRate ? `${statsData.stats.successRate}%` : '-', trend: 'Accuracy', icon: CheckCircle2, color: 'text-green-400' },
  ];

  const userName = statsData?.user?.name || 'User';

  return (
    <div className="space-y-10">
      <FadeInSection>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Welcome back, <GradientText className="text-gradient">{userName}</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Here's what's happening with your AI agents today.</p>
          </div>
          <div className="flex items-center gap-4">
             {loading ? (
               <div className="w-32 h-10 bg-white/5 animate-pulse rounded-xl" />
             ) : (
               <GlassCard className="px-6 py-2 border-accent-purple/30 bg-accent-purple/5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">
                  {statsData?.stats?.plan || 'Starter'} Plan
                </span>
               </GlassCard>
             )}
          </div>
        </div>
      </FadeInSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <FadeInSection key={stat.label} delay={i * 0.1}>
              <GlassCard variant="medium" className="p-6 group hover:translate-y-[-4px] transition-all duration-300" hover>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                     {stat.trend}
                  </span>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold tracking-tight">{stat.value}</h3>
              </GlassCard>
            </FadeInSection>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pb-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <FadeInSection delay={0.4}>
            <GlassCard variant="medium" className="p-8 h-full">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-2 h-6 bg-accent-purple rounded-full" />
                    Recent Conversations
                 </h3>
                 <button 
                  onClick={() => router.push('/dashboard/conversations')}
                  className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold"
                 >
                   View All
                 </button>
               </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                       {[1,2,3].map(i => <div key={i} className="w-full h-16 bg-white/5 animate-pulse rounded-xl" />)}
                    </div>
                  ) : !statsData?.recentConversations || statsData.recentConversations.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <MessageSquare size={32} className="text-white/10" />
                      </div>
                      <p className="text-white/30 text-sm font-medium">No recent conversations found.</p>
                      <button 
                        onClick={() => router.push('/dashboard/agents')}
                        className="mt-4 text-accent-purple text-xs font-bold uppercase tracking-widest hover:underline"
                      >
                        Start testing an agent
                      </button>
                    </div>
                  ) : (
                    statsData.recentConversations.map((conv: any, i: number) => (
                      <div 
                        key={conv.id} 
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group"
                        onClick={() => router.push(`/dashboard/conversations`)}
                      >
                        <div className="flex items-center gap-5">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center">
                              <MessageSquare size={18} className="text-accent-purple" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">Conversation with {conv.agents?.name || 'Agent'}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                                {new Date(conv.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-accent-purple transition-all text-white/20 group-hover:text-white">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
            </GlassCard>
          </FadeInSection>
        </div>

        {/* Quick Actions */}
        <div>
          <FadeInSection delay={0.5}>
            <GlassCard variant="strong" className="p-8 bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/20">
               <h3 className="text-xl font-bold mb-8 tracking-tight">Quick Actions</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/dashboard/agents/new')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-accent-purple text-white font-bold text-sm hover:shadow-glow-purple group transition-all active:scale-95"
                  >
                     <span>Create New Agent</span>
                     <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                  </button>
                  <button 
                    onClick={() => window.open('https://docs.voicebuild.ai', '_blank')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95 group"
                  >
                     <span>Documentation</span>
                     <FileText size={16} className="text-white/20 group-hover:text-white transition-colors" />
                  </button>
                  <button 
                    onClick={() => window.open('https://api.voicebuild.ai', '_blank')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95 group"
                  >
                     <span>API Reference</span>
                     <Code2 size={16} className="text-white/20 group-hover:text-white transition-colors" />
                  </button>
               </div>
            </GlassCard>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}