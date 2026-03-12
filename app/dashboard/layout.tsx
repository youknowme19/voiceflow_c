import React from 'react';
import Link from 'next/link';
import { GlassCard, GradientText } from '@/components/premium/PremiumUI';

export const metadata = {
  title: 'Dashboard | VoiceBuild',
};

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Agents', href: '/dashboard/agents', icon: '🤖' },
  { name: 'Conversations', href: '/dashboard/conversations', icon: '💬' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Knowledge', href: '/dashboard/knowledge', icon: '🧠' },
  { name: 'Integrations', href: '/dashboard/integrations', icon: '🔗' },
  { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { name: 'Team', href: '/dashboard/team', icon: '👥' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B0B0F] text-white">
      {/* Sidebar */}
      <aside className="w-20 hover:w-64 transition-all duration-500 ease-in-out premium-blur bg-black/40 border-r border-white/5 z-50 group flex flex-col">
        <div className="p-6 flex items-center justify-center group-hover:justify-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">V</span>
          </div>
          <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <GradientText className="text-gradient">VoiceBuild</GradientText>
          </span>
        </div>
        
        <nav className="mt-10 flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                <span className="text-xl w-6 flex justify-center text-white/50 group-hover/item:text-white transition-colors">
                  {item.icon}
                </span>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300 delay-75 pointer-events-none group-hover:pointer-events-auto">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-3 rounded-xl bg-white/5 flex items-center gap-4 group-hover:bg-white/10 transition-colors">
             <div className="w-8 h-8 rounded-full bg-accent-pink/20 border border-accent-pink/50 flex items-center justify-center text-xs">JD</div>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-xs">
                <p className="font-bold">John Doe</p>
                <p className="text-white/40">Pro Plan</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0B0B0F]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-md z-40">
           <h1 className="text-xl font-bold tracking-tight">Dashboard Overview</h1>
           <div className="flex gap-4">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
                 New Agent +
              </div>
           </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
