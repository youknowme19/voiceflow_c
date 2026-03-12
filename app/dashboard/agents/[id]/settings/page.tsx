"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";

const modelOptions = [
  "openai/gpt-4o-mini",
  "anthropic/claude-3.5-sonnet",
  "meta-llama/llama-3.1-70b",
];

export default function AgentSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [model, setModel] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase
      .from("agents")
      .select("settings")
      .eq("id", id)
      .single()
      .then(({ data }: { data: any }) => {
        const settings = data?.settings;
        if (settings?.model) setModel(settings.model);
      });
  }, [id]);

  const save = async () => {
    if (!id) return;
    const { error } = await supabase
      .from("agents")
      .update({ settings: { model } })
      .eq("id", id);
    if (!error) {
      alert("Saved");
    } else {
      alert(error.message);
    }
  };

  if (!id) return <p>Invalid agent</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Settings</h1>
      <label className="block mb-4">
        Model
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        >
          <option value="">Select a model</option>
          {modelOptions.map((m) => (
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
