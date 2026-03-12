import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">VoiceBuild</div>
        <nav className="mt-6 flex flex-col space-y-2">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-700">
            Overview
          </Link>
          <Link href="/dashboard/agents" className="px-4 py-2 hover:bg-gray-700">
            Agents
          </Link>
          <Link href="/dashboard/conversations" className="px-4 py-2 hover:bg-gray-700">
            Conversations
          </Link>
          <Link href="/dashboard/analytics" className="px-4 py-2 hover:bg-gray-700">
            Analytics
          </Link>
          <Link href="/dashboard/knowledge" className="px-4 py-2 hover:bg-gray-700">
            Knowledge
          </Link>
          <Link href="/dashboard/integrations" className="px-4 py-2 hover:bg-gray-700">
            Integrations
          </Link>
          <Link href="/dashboard/billing" className="px-4 py-2 hover:bg-gray-700">
            Billing
          </Link>
          <Link href="/dashboard/team" className="px-4 py-2 hover:bg-gray-700">
            Team
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-100 p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
}
