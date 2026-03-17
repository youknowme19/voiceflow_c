"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../../lib/supabaseClient";
import { 
  Zap,
  Search
} from "lucide-react";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";

// load chart components client-side only
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function AnalyticsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAgents() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data: teamData } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', session.user.id)
        .single();
        
      if (teamData?.team_id) {
        const { data: agentsData } = await supabase
          .from('agents')
          .select('id, name')
          .eq('team_id', teamData.team_id);
          
        if (agentsData && agentsData.length > 0) {
          setAgents(agentsData);
          setSelectedAgent(agentsData[0].id);
        }
      }
    }
    loadAgents();
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!selectedAgent) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?agentId=${selectedAgent}`);
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
          setLogs(data.recentLogs);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedAgent]);

  const chartData = analytics?.timeSeries || [];

  return (
    <div className="space-y-10 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Performance <GradientText className="text-gradient">Analytics</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Real-time telemetry and execution history for your agents.</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Filter By Agent</label>
            <select 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent-purple transition-all"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agents.length === 0 && <option value="">No Agents Found</option>}
              {agents.map((a: any) => (
                <option key={a.id} value={a.id} className="bg-gray-900">{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </FadeInSection>

      {loading && agents.length > 0 && (
        <div className="text-white/20 py-10 text-center animate-pulse">Fetching latest metrics...</div>
      )}

      {analytics && (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FadeInSection delay={0.1}>
              <GlassCard variant="medium" className="p-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Executions</p>
                <h3 className="text-3xl font-extrabold">{analytics.total_requests}</h3>
              </GlassCard>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <GlassCard variant="medium" className="p-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Avg. Latency</p>
                <h3 className="text-3xl font-extrabold">{analytics.avg_latency} <span className="text-sm font-medium text-white/40">ms</span></h3>
              </GlassCard>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <GlassCard variant="medium" className="p-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Success Rate</p>
                <h3 className="text-3xl font-extrabold text-green-500">{analytics.success_rate.toFixed(1)}%</h3>
              </GlassCard>
            </FadeInSection>
            <FadeInSection delay={0.4}>
              <GlassCard variant="medium" className="p-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Processing Cost</p>
                <h3 className="text-3xl font-extrabold text-accent-cyan">${Number(analytics.token_cost || 0).toFixed(4)}</h3>
              </GlassCard>
            </FadeInSection>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <FadeInSection delay={0.5} className="lg:col-span-2">
              <GlassCard variant="medium" className="p-6 h-full flex flex-col min-h-[400px]">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                   <span className="w-2 h-6 bg-accent-purple rounded-full" />
                   Activity Telemetry
                </h3>
                <div className="flex-1 w-full">
                  {chartData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/10">
                      <Zap size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">No telemetry data available yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="latency" stroke="#818CF8" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </GlassCard>
            </FadeInSection>

            <FadeInSection delay={0.6} className="lg:col-span-1">
              <GlassCard variant="medium" className="p-6 min-h-[400px]">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                   <span className="w-2 h-6 bg-accent-cyan rounded-full" />
                   Historical Logs
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                      <tr>
                        <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Timestamp</th>
                        <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Level</th>
                        <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Event Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-white/20">No events recorded.</td></tr>
                      ) : logs.map((log, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-xs text-white/60 font-mono">{new Date(log.created_at).toLocaleTimeString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                              log.level === 'error' 
                                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                                : 'bg-green-500/10 border-green-500/50 text-green-500'
                            }`}>
                              {log.level}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-white/80">{log.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </FadeInSection>
          </div>
        </div>
      )}
    </div>
  );
}
