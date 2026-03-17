"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  sender: string;
  text: string;
  metadata?: any;
}

export default function MessageBubble({ sender, text, metadata }: MessageBubbleProps) {
  const isUser = sender === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}> 
      <div
        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg transition-all duration-300 ${
          isUser 
            ? "bg-gradient-to-br from-accent-purple to-indigo-600 text-white rounded-tr-sm shadow-accent-purple/20" 
            : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md"
        }`}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        </div>
        
        {metadata?.node && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-3 pt-3 border-t border-white/5">
            Step: {metadata.node}
          </div>
        )}
      </div>
    </div>
  );
}
