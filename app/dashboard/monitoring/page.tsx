"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Conversation {
  id: string;
  status: string;
}

interface AgentLog {
  id: string;
  agent_id: string;
  level: string;
  message: string;
}

export default function MonitoringPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);

  useEffect(() => {
    // initial load
    supabase
      .from("conversations")
      .select("id,status")
      .then(({ data }) => data && setConversations(data as Conversation[]));

    supabase
      .from("agent_logs")
      .select("id,agent_id,level,message")
      .then(({ data }) => data && setLogs((data as AgentLog[]).slice(-20)));

    // subscribe to changes
    const convSub = supabase
      .channel("public:conversations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" },
        (payload) => {
          setConversations((c) => [...c, payload.new as Conversation]);
        }
      )
      .subscribe();

    const logSub = supabase
      .channel("public:agent_logs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "agent_logs" },
        (payload) => {
          setLogs((l) => [...l, payload.new as AgentLog].slice(-50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(convSub);
      supabase.removeChannel(logSub);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monitoring</h1>
      <div className="mb-4">
        <h2 className="font-semibold">Active Conversations</h2>
        <ul>
          {conversations.map((c) => (
            <li key={c.id}>{c.id} - {c.status}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Recent Logs</h2>
        <ul>
          {logs.map((l) => (
            <li key={l.id} className="text-sm">
              [{l.level}] {l.agent_id}: {l.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
