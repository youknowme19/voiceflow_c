"use client";

import React, { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0B0B0F] items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B0B0F] text-white">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0B0B0F]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-md z-40">
           <h1 className="text-xl font-bold tracking-tight">Dashboard Overview</h1>
           <div className="flex gap-4">
              <Link
                href="/dashboard/agents/new"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple text-white text-xs font-bold uppercase tracking-widest hover:shadow-glow-purple transition-all active:scale-95"
              >
                 <Plus size={14} />
                 New Agent
              </Link>
           </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
