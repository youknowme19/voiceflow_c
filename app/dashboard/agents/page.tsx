"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bot, 
  Settings as SettingsIcon, 
  MessageSquare, 
  ChevronRight,
  Plus,
  Play,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { GlassCard, FadeInSection, GradientText } from '@/components/premium/PremiumUI';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAgents() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("/api/agents", {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (e) {
        console.error("Failed to load agents", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!id || id === "undefined") {
      alert("Error: Invalid Agent ID. Please refresh the page.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}"? All associated data will be permanently removed.`)) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Your session has expired. Please sign in again.");
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      if (res.ok) {
        setAgents(prev => prev.filter(a => a.id !== id));
      } else {
        const data = await res.json();
        if (res.status === 401) {
          alert("Unauthorized. Your session may have expired.");
        } else {
          alert(data.error || "Failed to delete agent");
        }
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Agents</h1>
        <button
          onClick={() => router.push('/dashboard/agents/new')}
          className="px-6 py-2 rounded-xl bg-accent-purple text-white font-bold text-sm hover:shadow-glow-purple shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} />
          Create Agent
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-white/50">
          Loading agents...
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Bot size={40} className="text-white/10" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Agents Found</h3>
          <p className="text-white/40 mb-8">You haven't created any AI agents yet for this team.</p>
          <button
            onClick={() => router.push('/dashboard/agents/new')}
            className="px-8 py-3 rounded-[1.25rem] bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
          >
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent: any) => (
            <div key={agent.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group relative flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex flex-shrink-0 items-center justify-center text-white shadow-lg">
                  <Bot size={24} />
                </div>
                <div className="flex gap-2">
                   <Link
                    href={`/dashboard/agents/${agent.id}/settings`}
                    className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white/60 hover:text-white transition-colors"
                    title="Settings"
                  >
                    <SettingsIcon size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(agent.id, agent.name)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 transition-colors"
                    title="Delete Agent"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2 truncate">{agent.name || "Unnamed"}</h2>
              <p className="text-white/40 text-sm mb-6 flex-grow">
                {agent.model_provider || 'openrouter'} • {agent.model_name || 'gpt-4o-mini'}
              </p>

              <div className="flex gap-3 mt-auto">
                <Link
                  href={`/dashboard/agents/${agent.id}/test`}
                  className="flex-1 text-center py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                >
                  Test Chat
                </Link>
                <Link
                  href={`/dashboard/builder/${agent.id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-accent-purple hover:bg-indigo-500 text-white text-sm font-bold shadow-glow-purple transition-colors"
                >
                  Open Builder
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
