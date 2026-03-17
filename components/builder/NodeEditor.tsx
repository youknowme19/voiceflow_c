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
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || "");
      setData(selectedNode.data || {});
    }
  }, [selectedNode]);

  const updateData = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    if (!selectedNode) return;
    const updated: Node = {
      ...selectedNode,
      data: { ...data, label },
    };
    setNodes(
      nodes.map((n: Node) => (n.id === updated.id ? updated : n))
    );
  };

  if (!selectedNode) return null;

  return (
    <aside className="absolute right-0 top-0 h-full w-80 border-l border-white/5 bg-black/40 backdrop-blur-xl z-50 flex flex-col shadow-2xl overflow-hidden">
       <div className="p-6 border-b border-white/5 flex items-center justify-between">
         <div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-1">Properties</h3>
           <p className="text-xs text-white/30 font-medium">{selectedNode.type} Node Settings</p>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <section>
            <label className="block text-[10px] font-bold text-accent-cyan uppercase tracking-widest mb-3">Display Name</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Welcome Message"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner"
            />
          </section>

          {(selectedNode.type === 'message' || selectedNode.type === 'text') && (
            <section>
              <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">Message Content</label>
              <textarea
                value={data.text || data.message || ""}
                onChange={(e) => updateData('text', e.target.value)}
                placeholder="What should the agent say?"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner resize-none"
              />
            </section>
          )}

          {selectedNode.type === 'ai' && (
            <>
              <section>
                <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">System Prompt</label>
                <textarea
                  value={data.prompt || data.systemPrompt || ""}
                  onChange={(e) => updateData('prompt', e.target.value)}
                  placeholder="Instructions for the AI..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner resize-none"
                />
              </section>
              <section>
                <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">Output Variable</label>
                <input
                  value={data.outputVariable || ""}
                  onChange={(e) => updateData('outputVariable', e.target.value)}
                  placeholder="e.g. user_intent"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner"
                />
              </section>
            </>
          )}

          {selectedNode.type === 'condition' && (
            <section>
              <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">Logical Condition</label>
              <input
                value={data.logic || data.condition || ""}
                onChange={(e) => updateData('logic', e.target.value)}
                placeholder='e.g. contains("yes")'
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner"
              />
              <p className="text-[10px] text-white/30 mt-2">Use contains(), variable["name"] === "value", etc.</p>
            </section>
          )}

          {selectedNode.type === 'api' && (
            <>
              <section>
                <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">Endpoint URL</label>
                <input
                  value={data.url || ""}
                  onChange={(e) => updateData('url', e.target.value)}
                  placeholder="https://api.example.com/data"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20 shadow-inner"
                />
              </section>
              <section>
                <label className="block text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-3">Method</label>
                <select
                  value={data.method || "GET"}
                  onChange={(e) => updateData('method', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all text-white shadow-inner"
                >
                  <option value="GET" className="bg-gray-900 border-none">GET</option>
                  <option value="POST" className="bg-gray-900 border-none">POST</option>
                  <option value="PUT" className="bg-gray-900 border-none">PUT</option>
                </select>
              </section>
            </>
          )}

          <section className="space-y-4">
             <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Metadata</label>
             <GlassCard variant="light" className="p-4 space-y-3 bg-white/[0.02]">
                <div className="flex justify-between text-xs">
                   <span className="text-white/30 font-medium">Node ID</span>
                   <span className="text-white/60 font-mono text-[10px]">{selectedNode.id.length > 20 ? selectedNode.id.slice(0, 8) + '...' : selectedNode.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-white/30 font-medium">Type</span>
                   <span className="text-white/60 font-bold uppercase tracking-tighter">{selectedNode.type}</span>
                </div>
             </GlassCard>
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
