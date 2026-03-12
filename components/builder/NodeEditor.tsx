"use client";

import React, { useState, useEffect } from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";
import { Node } from "reactflow";
import { GlassCard, GradientText } from '../premium/PremiumUI';

export default function NodeEditor() {
  const selectedNode = useBuilderStore((s: BuilderState) => s.selectedNode);
  const nodes = useBuilderStore((s: BuilderState) => s.nodes);
  const setNodes = useBuilderStore((s: BuilderState) => s.setNodes);

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || "");
    }
  }, [selectedNode]);

  const save = () => {
    if (!selectedNode) return;
    const updated: Node = {
      ...selectedNode,
      data: { ...selectedNode.data, label },
    };
    setNodes(
      nodes.map((n: Node) => (n.id === updated.id ? updated : n))
    );
  };

  if (!selectedNode) return null;

  return (
    <aside className="absolute right-0 top-0 h-full w-80 border-l border-white/5 bg-black/40 backdrop-blur-xl z-50 flex flex-col shadow-2xl">
       <div className="p-6 border-b border-white/5 flex items-center justify-between">
         <div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-1">Properties</h3>
           <p className="text-xs text-white/30 font-medium">Configure node settings</p>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <section>
            <label className="block text-[10px] font-bold text-accent-cyan uppercase tracking-widest mb-3">Node Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node title..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner"
            />
          </section>

          <section className="space-y-4">
             <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest">Metadata</label>
             <GlassCard variant="light" className="p-4 space-y-3 bg-white/[0.02]">
                <div className="flex justify-between text-xs">
                   <span className="text-white/30 font-medium">Node ID</span>
                   <span className="text-white/60 font-mono text-[10px]">{selectedNode.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-white/30 font-medium">Type</span>
                   <span className="text-white/60 font-bold uppercase tracking-tighter">{selectedNode.type}</span>
                </div>
             </GlassCard>
          </section>

          <section>
             <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">AI Configuration</label>
             <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-2">
                <span className="text-xl">✨</span>
                <p className="text-[11px] text-white/40 font-medium leading-relaxed">Advanced AI tuning available in <span className="text-accent-purple">Pro Version</span></p>
             </div>
          </section>
       </div>

       <div className="p-6 border-t border-white/5">
          <button
            onClick={save}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold text-sm tracking-widest uppercase hover:shadow-glow-purple transition-all active:scale-95 shadow-lg"
          >
            Update Node
          </button>
       </div>
    </aside>
  );
}
