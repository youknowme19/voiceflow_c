"use client";

import React from "react";

interface MessageBubbleProps {
  sender: string;
  text: string;
  metadata?: any;
}

export default function MessageBubble({ sender, text, metadata }: MessageBubbleProps) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}> 
      <div
        className={`max-w-xs p-2 rounded-lg ${
          isUser ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {text}
        {metadata?.node && (
          <div className="text-xs text-gray-500 mt-1">Node: {metadata.node}</div>
        )}
      </div>
    </div>
  );
}
