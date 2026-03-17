"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FadeInSection } from "@/components/premium/PremiumUI";

export default function EmbeddableChat() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const agentName = searchParams.get("name") || "AI Assistant";

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !agentId) return;

    const userMsg = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/chat/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, userMessage: input.trim() })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'assistant', content: data.reply }]);
      }
    } catch (e) {
       setMessages(prev => [...prev, { sender: 'assistant', content: "Sorry, I'm having trouble connecting." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] text-white">
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
         <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple">
            <Bot size={18} />
         </div>
         <span className="font-bold text-sm">{agentName}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/20 text-center px-4">
             <Bot size={40} className="mb-4 opacity-50" />
             <p className="text-sm font-medium">Hello! How can I help you today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <FadeInSection key={i} delay={0}>
            <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                m.sender === 'user' 
                  ? 'bg-accent-purple text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-sm'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </FadeInSection>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="p-3 bg-white/5 border border-white/10 rounded-2xl animate-pulse">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75" />
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-150" />
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
         <div className="flex items-center gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-colors"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-3 rounded-xl bg-accent-purple hover:bg-accent-purple/80 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
         </div>
         <p className="text-[9px] text-center text-white/10 mt-3 uppercase tracking-widest font-bold">
           Powered by VoiceBuild AI
         </p>
      </div>
    </div>
  );
}
