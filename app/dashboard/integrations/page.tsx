"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";
import { Trash2, Plus, Globe, Link as LinkIcon, Database, ExternalLink, Search } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  auth_token?: string;
  body_template?: string;
  created_at: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    method: 'GET' as const,
    headers: '{}',
    auth_token: '',
    body_template: '{}',
  });

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: teamData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', session.user.id)
      .single();

    if (teamData) {
      const { data } = await supabase
        .from('integrations')
        .select('*')
        .eq('team_id', teamData.team_id);
      setIntegrations(data || []);
    }
    setLoading(false);
  };

  const handleAddIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: teamData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', session.user.id)
      .single();

    if (!teamData) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('integrations').insert({
        team_id: teamData.team_id,
        name: formData.name,
        endpoint: formData.endpoint,
        method: formData.method,
        headers: formData.headers ? JSON.parse(formData.headers) : {},
        auth_token: formData.auth_token,
        body_template: formData.body_template || '{}',
      });

      if (error) throw error;

      setFormData({
        name: '',
        endpoint: '',
        method: 'GET',
        headers: '{}',
        auth_token: '',
        body_template: '{}',
      });
      setShowForm(false);
      loadIntegrations();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteIntegration = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('integrations').delete().eq('id', id);
    loadIntegrations();
  };

  return (
    <div className="space-y-12 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              API <GradientText className="text-gradient">Integrations</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Connect external systems to your AI agent workflows.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-purple text-white font-bold text-sm hover:shadow-glow-purple shadow-lg transition-all active:scale-95"
          >
            {showForm ? 'Cancel' : (
              <>
                <Plus size={18} />
                New Integration
              </>
            )}
          </button>
        </div>
      </FadeInSection>

      {showForm && (
        <FadeInSection>
          <GlassCard variant="medium" className="p-8 border-accent-purple/20">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
               <Globe size={20} className="text-accent-purple" />
               Register API Endpoint
            </h3>
            <form onSubmit={handleAddIntegration} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">System Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-purple transition-all"
                  placeholder="e.g. Slack Webhook"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Endpoint URL</label>
                <input
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-purple transition-all"
                  placeholder="https://api.yourdomain.com/v1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-purple transition-all"
                >
                  <option className="bg-gray-900 text-white">GET</option>
                  <option className="bg-gray-900 text-white">POST</option>
                  <option className="bg-gray-900 text-white">PUT</option>
                  <option className="bg-gray-900 text-white">DELETE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Auth Header (Optional)</label>
                <input
                  type="password"
                  value={formData.auth_token}
                  onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-purple transition-all"
                  placeholder="Bearer token..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 rounded-xl bg-accent-purple text-white font-bold text-sm shadow-glow-purple disabled:opacity-50 transition-all font-sans"
                >
                  {loading ? 'Registering...' : 'Create Integration'}
                </button>
              </div>
            </form>
          </GlassCard>
        </FadeInSection>
      )}

      <div className="grid gap-6">
        {loading && integrations.length === 0 ? (
          <div className="text-white/20 py-20 text-center animate-pulse flex flex-col items-center gap-4">
             <Database size={40} className="text-white/10" />
             <span className="text-xs uppercase tracking-[0.2em] font-bold">Syncing connections...</span>
          </div>
        ) : integrations.length === 0 ? (
          <div className="p-32 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center bg-white/[0.01]">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
               <LinkIcon size={24} className="text-white/10" />
            </div>
            <p className="text-white/30 font-medium font-sans">No external APIs registered yet.</p>
          </div>
        ) : (
          integrations.map((int, i) => (
            <FadeInSection key={int.id} delay={i * 0.05}>
              <GlassCard variant="medium" className="p-6 flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-accent-cyan transition-colors">
                    <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-tighter">{int.method}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-white transition-colors">{int.name}</h3>
                    <p className="text-[10px] text-white/40 font-mono mt-1 break-all flex items-center gap-2">
                       <ExternalLink size={10} />
                       {int.endpoint}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDeleteIntegration(int.id)}
                    className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </GlassCard>
            </FadeInSection>
          ))
        )}
      </div>
    </div>
  );
}
