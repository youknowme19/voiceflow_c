"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Settings, 
  MessageSquare, 
  Bot, 
  Zap, 
  Globe, 
  Play,
  Share2,
  ChevronRight,
  Layout,
  Layers,
  Activity,
  Box
} from 'lucide-react';

const COMPONENTS = [
  { id: 'msg', label: 'Message', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Send text response' },
  { id: 'ai', label: 'AI Model', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'Process intelligence' },
  { id: 'cond', label: 'Condition', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', desc: 'Internal logic branch' },
  { id: 'api', label: 'Integrate', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10', desc: 'Connect external data' },
];

export default function BuilderUIPreview() {
  const [activeTab, setActiveTab] = useState('logic');
  const [pipelineNodes, setPipelineNodes] = useState<any[]>([]);

  const animatePipeline = async () => {
    setPipelineNodes([]);
    await new Promise(r => setTimeout(r, 1000));
    
    const sequence = [
      { ...COMPONENTS[0], id: 1 },
      { ...COMPONENTS[1], id: 2 },
      { ...COMPONENTS[3], id: 3 },
    ];

    for (const item of sequence) {
      setPipelineNodes(prev => [...prev, item]);
      await new Promise(r => setTimeout(r, 1200));
    }

    await new Promise(r => setTimeout(r, 3000));
    animatePipeline();
  };

  useEffect(() => {
    animatePipeline();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase tracking-widest px-4"
            >
              Visual Logic
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              A builder that feels <br />
              <span className="text-gradient">like professional IDE.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed font-light max-w-lg">
              Stop fighting with diagram lines. Our structured pipeline approach gives you the clarity of high-level logic with the precision of raw code.
            </p>
            
            <div className="space-y-4 pt-4">
               {[
                 'Type-safe module connections',
                 'Real-time dependency validation',
                 'Versioned pipeline deployments',
                 'Production-ready API bridging'
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 text-white/80 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium tracking-wide">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative">
            {/* App UI Frame */}
            <div className="bg-[#0B0B0F] rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden aspect-[1.4/1] flex flex-col relative z-10 font-sans">
              {/* Toolbar */}
              <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-5">
                   <div className="flex gap-1.5 opacity-30 grayscale items-center mr-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                   </div>
                   <div className="flex gap-1 h-8 items-center bg-white/5 rounded-lg p-1">
                      <button className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${activeTab === 'logic' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Logic</button>
                      <button className="px-3 py-1 text-[10px] font-bold uppercase text-white/30">Data</button>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-white/20 transition-colors">
                      <Search className="w-3.5 h-3.5 text-white/40" />
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-white/20 transition-colors">
                      <Settings className="w-3.5 h-3.5 text-white/40" />
                   </div>
                   <div className="h-8 px-4 rounded-lg bg-white text-black text-[10px] font-bold uppercase tracking-widest flex items-center">
                      Deploy
                   </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Library */}
                <div className="w-64 border-r border-white/5 bg-[#09090D] p-5 space-y-6 shrink-0">
                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Components</p>
                      {COMPONENTS.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-all flex items-center gap-3 group">
                           <div className={`p-2 rounded-lg ${c.bg}`}>
                              <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                           </div>
                           <div className="flex-1">
                              <p className="text-[11px] font-bold text-white tracking-tight">{c.label}</p>
                              <p className="text-[9px] text-white/30 font-medium">{c.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-6 space-y-4">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Execution Settings</p>
                      <div className="p-3 space-y-3">
                        <div className="h-1.5 w-full bg-white/5 rounded" />
                        <div className="h-1.5 w-2/3 bg-white/5 rounded" />
                        <div className="flex justify-between items-center pt-2">
                           <div className="h-3 w-10 bg-accent-purple/20 rounded" />
                           <div className="w-6 h-3 bg-white/5 rounded-full" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Main Workspace - Pipeline view */}
                <div className="flex-1 bg-[#070709] p-10 overflow-auto scrollbar-none relative">
                   {/* Centered Structured Pipeline */}
                   <div className="max-w-md mx-auto space-y-6">
                      <AnimatePresence>
                        {pipelineNodes.map((node, i) => (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative"
                          >
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${node.bg} ring-1 ring-white/5`}>
                                   <node.icon className={`w-5 h-5 ${node.color}`} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Step {i + 1}</p>
                                   <p className="text-sm font-bold text-white tracking-tight italic uppercase">{node.label}</p>
                                </div>
                              </div>
                              <div className="flex gap-1.5 grayscale opacity-20">
                                 <Plus className="w-4 h-4 text-white" />
                                 <Activity className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Aligned connector */}
                            {i < sequence.length - 1 && (
                              <div className="h-6 w-px bg-white/10 mx-auto" />
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {pipelineNodes.length === 0 && (
                         <div className="h-64 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                            <Box className="w-10 h-10 text-white" />
                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Simulation</p>
                         </div>
                      )}
                   </div>

                   {/* Fixed Canvas Hint */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/5">
                       <Layout className="w-3.5 h-3.5 text-white/20" />
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Structured Pipeline Mode</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Glowing Accent */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent-purple/20 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

const sequence = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];
