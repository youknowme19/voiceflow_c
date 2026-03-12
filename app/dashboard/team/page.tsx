"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Member {
  id: string;
  role: string;
  user: { id: string; email: string };
}

export default function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [members, setMembers] = useState<Member[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    // fetch teamId for current user via team_members
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user?.id;
      if (userId) {
        supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", userId)
          .limit(1)
          .single()
          .then(({ data }) => {
            if (data?.team_id) {
              setTeamId(data.team_id);
              loadMembers(data.team_id);
            }
          });
      }
    });
  }, []);

  const loadMembers = (tid: string) => {
    supabase
      .from("team_members")
      .select("id,role,user:user_id(email)")
      .eq("team_id", tid)
      .then(({ data }) => {
        setMembers(data as any);
      });
  };

  const invite = async () => {
    if (!teamId) return;
    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, teamId }),
    });
    const data = await res.json();
    if (data.success) {
      setEmail("");
      loadMembers(teamId);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team</h1>
      {!teamId && <p>Loading team info...</p>}
      {teamId && (
        <>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 mr-2"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="owner">Owner</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={invite}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Invite
            </button>
          </div>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex justify-between border p-2 rounded">
                <span>{m.user?.email || 'Unknown'}</span>
                <span className="capitalize">{m.role}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
