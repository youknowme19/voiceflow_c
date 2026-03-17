"use client";

import React from "react";
import { X, Copy, Check, Code, Globe, MessageSquare } from "lucide-react";
import { GlassCard, GradientText } from "../premium/PremiumUI";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export default function DeployModal({ isOpen, onClose, agentId, agentName }: DeployModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const embedCode = `<!-- VoiceBuild Chat Widget -->
<script 
  src="${process.env.NEXT_PUBLIC_SITE_URL}/widget.js" 
  data-agent-id="${agentId}"
  data-agent-name="${agentName}"
  async
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <GlassCard variant="strong" className="w-full max-w-2xl overflow-hidden border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-accent-purple/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center text-accent-purple">
                <Globe size={20} />
             </div>
             <div>
                <h3 className="text-xl font-bold">Deploy <GradientText>{agentName}</GradientText></h3>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Web Embed Configuration</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
             <GlassCard className="p-5 bg-white/[0.02] border-white/5 group hover:border-accent-purple/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                   <Code size={20} />
                </div>
                <h4 className="font-bold text-sm mb-1">Web Embed</h4>
                <p className="text-xs text-white/40 leading-relaxed">Add a floating chat bubble to your website with a single line of code.</p>
             </GlassCard>

             <GlassCard className="p-5 bg-white/[0.02] border-white/5 group hover:border-accent-cyan/20 transition-all opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                   <MessageSquare size={20} />
                </div>
                <h4 className="font-bold text-sm mb-1">WhatsApp (Coming Soon)</h4>
                <p className="text-xs text-white/40 leading-relaxed">Connect your agent directly to your WhatsApp Business account.</p>
             </GlassCard>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Embed Snippet</h4>
               {copied && (
                 <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                   <Check size={12} /> Copied to Clipboard
                 </span>
               )}
            </div>
            
            <div className="relative group">
              <pre className="p-6 rounded-2xl bg-black/60 border border-white/5 text-xs text-accent-cyan/80 font-mono overflow-x-auto custom-scrollbar">
                {embedCode}
              </pre>
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-accent-purple transition-all group-hover:scale-105 active:scale-95"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
            <p className="text-[10px] text-white/20 text-center italic">
              Paste this code before the closing &lt;/body&gt; tag of your website.
            </p>
          </div>

          <div className="pt-4">
             <button 
               onClick={onClose}
               className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-glow-white/10"
             >
               Got it, close
             </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
