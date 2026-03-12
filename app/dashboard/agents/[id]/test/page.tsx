"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../../../../../components/chat/ChatWindow";

export default function AgentTestPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return <p>Agent not specified</p>;

  return (
    <div className="h-full bg-white dark:bg-gray-800">
      <ChatWindow agentId={id} />
    </div>
  );
}
