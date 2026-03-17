"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";

const providerModelOptions: Record<string, string[]> = {
  "openrouter": [
    "openai/gpt-4o-mini",
    "anthropic/claude-3.5-sonnet",
    "meta-llama/llama-3.1-70b",
  ],
  "gemini": [
    "gemini-2.5-pro",
    "gemini-2.5-flash",
  ]
};

export default function AgentSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState("openai/gpt-4o-mini");

  useEffect(() => {
    if (!id) return;
    supabase
      .from("agents")
      .select("model_provider, model_name")
      .eq("id", id)
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.model_provider) setProvider(data.model_provider);
        if (data?.model_name) setModel(data.model_name);
      });
  }, [id]);

  const save = async () => {
    if (!id) return;
    const { error } = await supabase
      .from("agents")
      .update({ model_provider: provider, model_name: model })
      .eq("id", id);
    if (!error) {
      alert("Settings Saved!");
    } else {
      alert(error.message);
    }
  };

  if (!id) return <p>Invalid agent</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Settings</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">AI Provider</label>
        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            setModel(providerModelOptions[e.target.value][0]); 
          }}
          className="w-full p-2 border rounded bg-transparent"
        >
          {Object.keys(providerModelOptions).map((p: any) => (
            <option key={p} value={p}>{p.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <label className="block mb-4 font-semibold">
        Model
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full p-2 border rounded bg-transparent"
        >
          {providerModelOptions[provider]?.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={save}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}
