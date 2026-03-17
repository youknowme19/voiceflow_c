"use client";

import React from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";
import { GlassCard, GradientText } from '../premium/PremiumUI';

const nodeTypes = [
  { type: "start", icon: "🚀", color: "from-green-500/20 to-emerald-500/20" },
  { type: "message", icon: "💬", color: "from-blue-500/20 to-indigo-500/20" },
  { type: "ai", icon: "🧠", color: "from-purple-500/20 to-pink-500/20" },
  { type: "condition", icon: "💎", color: "from-yellow-500/20 to-orange-500/20" },
  { type: "api", icon: "🔗", color: "from-cyan-500/20 to-blue-500/20" },
  { type: "knowledge", icon: "📚", color: "from-indigo-500/20 to-purple-500/20" },
  { type: "input", icon: "⌨️", color: "from-pink-500/20 to-rose-500/20" },
  { type: "end", icon: "🏁", color: "from-red-500/20 to-orange-500/20" },
];

export default function NodePanel() {
  const addNode = useBuilderStore((s: BuilderState) => s.addNode);

  const handleAdd = (type: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      position: { x: 250, y: 100 },
    };
    addNode(newNode as any);
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl h-full flex flex-col">
       <div className="p-6 border-b border-white/5">
         <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-1">Components</h3>
         <p className="text-xs text-white/30 font-medium">Drag or click to add nodes</p>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         {nodeTypes.map((item) => (
           <button
             key={item.type}
             className="w-full group relative text-left transition-all duration-300 active:scale-95"
             onClick={() => handleAdd(item.type)}
           >
             <GlassCard 
               variant="light" 
               className="p-4 border-white/5 group-hover:border-white/20 group-hover:bg-white/5 transition-all flex items-center gap-4"
             >
               <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform`}>
                 {item.icon}
               </div>
               <div>
                  <p className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-tighter">Action Node</p>
               </div>
             </GlassCard>
           </button>
         ))}
       </div>

       <div className="p-4 border-t border-white/5">
          <GlassCard className="p-4 bg-accent-purple/5 border-accent-purple/20">
             <p className="text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-1">Pro Tip</p>
             <p className="text-[11px] text-white/50 leading-relaxed font-medium">Use AI nodes to handle complex customer queries dynamically.</p>
          </GlassCard>
       </div>
    </aside>
  );
}
