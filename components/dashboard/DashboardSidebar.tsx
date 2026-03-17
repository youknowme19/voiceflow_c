"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Brain, 
  Link2, 
  CreditCard, 
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { GradientText } from '@/components/premium/PremiumUI';
import { supabase } from '@/lib/supabaseClient';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/dashboard/agents', icon: Bot },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Knowledge', href: '/dashboard/knowledge', icon: Brain },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Link2 },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Profile', href: '/dashboard/profile', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<string>("Starter");

  useEffect(() => {
    const controller = new AbortController();

    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (controller.signal.aborted) return;
        setUser(session.user);
        
        try {
          const res = await fetch('/api/dashboard/stats', { 
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setPlan(data.stats.plan || "Starter");
          }
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            console.error("Sidebar stats fetch fail", e);
          }
        }
      }
    }
    getProfile();

    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <aside className="w-20 hover:w-64 transition-all duration-500 ease-in-out premium-blur bg-black/40 border-r border-white/5 z-50 group flex flex-col h-full sticky top-0">
      <div className="p-6 flex items-center justify-center group-hover:justify-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center flex-shrink-0 shadow-glow-purple">
          <span className="text-white text-lg font-bold">V</span>
        </div>
        <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <GradientText className="text-gradient">VoiceBuild</GradientText>
        </span>
      </div>
      
      <nav className="mt-10 flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-4 p-3 rounded-xl transition-all group/item ${
                isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/50 hover:text-white'
              }`}>
                <span className={`w-6 flex justify-center transition-colors ${isActive ? 'text-accent-purple' : 'group-hover/item:text-white'}`}>
                  <Icon size={20} />
                </span>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300 delay-75 pointer-events-none group-hover:pointer-events-auto">
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-4 group-hover:bg-white/10 transition-colors border border-white/5">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple/40 to-accent-cyan/40 border border-white/20 flex items-center justify-center text-[10px] font-bold">
             {userInitials}
           </div>
           <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-xs flex-1">
              <p className="font-bold truncate">{userName}</p>
              <p className="text-white/40 uppercase text-[9px] tracking-widest">{plan} Plan</p>
           </div>
           <button 
             onClick={handleLogout}
             className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"
           >
             <LogOut size={14} />
           </button>
        </div>
      </div>
    </aside>
  );
}
