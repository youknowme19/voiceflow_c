import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

export default async function AgentsPage() {
  if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <p>Supabase not configured</p>;
  }
  const { data: agents, error } = await supabase.from("agents").select("id,name");
  if (error) {
    return <p>Error loading agents: {error.message}</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
      <ul className="space-y-2">
        {(agents || []).map((agent: any) => (
          <li key={agent.id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <span>{agent.name || "Unnamed"}</span>
              <div className="space-x-2">
                <Link
                  href={`/dashboard/agents/${agent.id}/test`}
                  className="text-indigo-600 hover:underline"
                >
                  Test
                </Link>
                <Link
                  href={`/dashboard/agents/${agent.id}/settings`}
                  className="text-indigo-600 hover:underline"
                >
                  Settings
                </Link>
                <Link
                  href={`/dashboard/builder/${agent.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  Builder
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
