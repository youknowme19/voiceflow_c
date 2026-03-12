"use client";

import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";

interface ChatMessage {
  sender: string;
  text: string;
  metadata?: any;
}

interface ChatWindowProps {
  agentId: string;
}

export default function ChatWindow({ agentId }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    setMessages((m) => [...m, { sender: "user", text }]);
    setLoading(true);
    const res = await fetch(`/api/agents/${agentId}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, agentId, conversationId }),
    });
    const data = await res.json();
    if (data.reply) {
      setMessages((m) => [...m, { sender: "agent", text: data.reply, metadata: data.metadata }]);
    }
    if (data.conversationId) setConversationId(data.conversationId);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            sender={msg.sender}
            text={msg.text}
            metadata={msg.metadata}
          />
        ))}
        {loading && <p className="text-sm text-gray-500">...</p>}
      </div>
      <div className="p-4">
        <InputBox onSend={send} />
      </div>
    </div>
  );
}
