"use client";

import { GlassCard, GradientText, FadeInSection } from '@/components/premium/PremiumUI';

export default function DashboardOverview() {
  const stats = [
    { label: 'Active Agents', value: '12', trend: '+20%', icon: '🤖' },
    { label: 'Total Calls', value: '2.4k', trend: '+12%', icon: '📞' },
    { label: 'Avg. Response Time', value: '850ms', trend: '-50ms', icon: '⚡' },
    { label: 'Success Rate', value: '99.2%', trend: '+0.4%', icon: '✅' },
  ];

  return (
    <div className="space-y-10">
      <FadeInSection>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back, <GradientText className="text-gradient">John</GradientText></h1>
            <p className="text-white/40 text-lg">Here's what's happening with your AI agents today.</p>
          </div>
          <GlassCard className="px-6 py-3 border-accent-purple/30 bg-accent-purple/5">
             <span className="text-xs font-bold uppercase tracking-widest text-accent-purple">Pro Member</span>
          </GlassCard>
        </div>
      </FadeInSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeInSection key={stat.label} delay={i * 0.1}>
            <GlassCard variant="medium" className="p-6 group hover:translate-y-[-4px] transition-all duration-300" hover>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                   {stat.trend}
                </span>
              </div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-extrabold tracking-tight">{stat.value}</h3>
            </GlassCard>
          </FadeInSection>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <FadeInSection delay={0.4}>
            <GlassCard variant="medium" className="p-8 h-full">
               <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-2 h-6 bg-accent-purple rounded-full" />
                  Recent Conversations
               </h3>
               <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xs font-bold">U{i}</div>
                          <div>
                             <p className="font-bold text-sm">Customer Inquiry #{1042 + i}</p>
                             <p className="text-xs text-white/40">2 minutes ago • Service Agent</p>
                          </div>
                       </div>
                       <div className="text-white/40 text-xs font-medium group-hover:text-white transition-colors">View Session →</div>
                    </div>
                  ))}
               </div>
            </GlassCard>
          </FadeInSection>
        </div>

        {/* Quick Actions */}
        <div>
          <FadeInSection delay={0.5}>
            <GlassCard variant="strong" className="p-8 bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/20">
               <h3 className="text-xl font-bold mb-8 tracking-tight">Quick Actions</h3>
               <div className="grid grid-cols-1 gap-4">
                  <button className="w-full p-4 rounded-xl bg-accent-purple text-white font-bold text-sm hover:shadow-glow-purple transition-all active:scale-95">
                     Create New Agent
                  </button>
                  <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95">
                     Documentation
                  </button>
                  <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95">
                     API Reference
                  </button>
               </div>
            </GlassCard>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}