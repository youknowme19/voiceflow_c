'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Get user's team
    const { data: teamData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.user.id)
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

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setLoading(false);
      return;
    }

    // Get user's team
    const { data: teamData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.user.id)
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

      alert('Integration added successfully');
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
      alert('Error adding integration: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteIntegration = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    const { error } = await supabase.from('integrations').delete().eq('id', id);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadIntegrations();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">API Integrations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Integration'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddIntegration} className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="e.g., Slack API"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Endpoint URL</label>
            <input
              type="url"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="https://api.example.com/webhook"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Auth Token (Optional)</label>
              <input
                type="password"
                value={formData.auth_token}
                onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Bearer token"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
            <textarea
              value={formData.headers}
              onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20 font-mono text-sm"
              placeholder='{}'
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Body Template (JSON)</label>
            <textarea
              value={formData.body_template}
              onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20 font-mono text-sm"
              placeholder='{"message": "{userMessage}"}'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Integration'}
          </button>
        </form>
      )}

      {loading && <p>Loading...</p>}

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-gray-800 rounded-lg p-6 flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{integration.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{integration.endpoint}</p>
              <p className="text-gray-400 text-sm">
                Method: <span className="font-mono">{integration.method}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Created: {new Date(integration.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteIntegration(integration.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {!loading && integrations.length === 0 && (
        <p className="text-gray-400">No integrations yet. Create one to get started.</p>
      )}
    </div>
  );
}
