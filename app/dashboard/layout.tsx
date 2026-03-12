import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: 'Dashboard | VoiceBuild',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B0B0F] text-white">
      <DashboardSidebar />

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
