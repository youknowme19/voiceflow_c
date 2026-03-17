"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function CreateAgentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState("openai/gpt-4o-mini");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamId, setTeamId] = useState("");

  const providerModelOptions: Record<string, string[]> = {
    "openrouter": [
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-sonnet",
      "meta-llama/llama-3.1-70b",
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "stepfun/step-3.5-flash:free",
      "qwen/qwen3-coder:free",
    ],
    "gemini": [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
    ]
  };

  useEffect(() => {
    const controller = new AbortController();
    
    async function getTeam() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', session.user.id);
        
      if (controller.signal.aborted) return;

      if (teamData && teamData.length > 0) {
        setTeamId(teamData[0].team_id);
      } else {
        setError("You are not assigned to any team. Please ask an owner to invite you.");
      }
    }
    getTeam();

    return () => controller.abort();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teamId) {
      setError("Name is required and team must be loaded.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          name,
          description,
          teamId,
          model_provider: provider,
          model_name: model
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create agent");
      }

      router.push(`/dashboard/agents`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Create New Agent</h1>
      
      <form onSubmit={handleCreate} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Agent Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all outline-none"
            placeholder="e.g. Customer Support Bot"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
          <textarea
            className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all outline-none h-24"
            placeholder="What does this agent do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">AI Provider</label>
            <select
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all outline-none"
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setModel(providerModelOptions[e.target.value][0]);
              }}
            >
              <option value="openrouter">OpenRouter</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Default Model</label>
            <select
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all outline-none"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {providerModelOptions[provider]?.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !teamId}
            className="px-6 py-3 rounded-xl bg-accent-purple hover:bg-indigo-500 transition-all font-medium flex items-center shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
