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
  BarChart3,
  Activity,
  Database,
  ShieldCheck,
  Split,
  CheckCircle,
  Layers,
  Box
} from 'lucide-react';

import { Reveal } from '@/components/premium/PremiumUI';

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
    <section className="section-spacing relative bg-[#0B0B0F]">
      <div className="container mx-auto px-6 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content: (Left) - Rhythm B: Text Left / Visual Right */}
          <div className="space-y-8 max-w-2xl mx-auto lg:mx-0">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-purple/5 border border-accent-purple/20 text-accent-purple text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                Visual Orchestration
              </div>
              <h2 className="text-3xl md:text-[36px] font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
                Builder for <br />
                <span className="text-gradient">Architects.</span>
              </h2>
              <p className="text-base md:text-lg text-white/40 font-light leading-relaxed">
                Stop fighting with diagram lines. Our structured pipeline approach gives you the clarity of high-level logic with the precision of raw code.
              </p>
            </Reveal>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
               {[
                 'Type-safe connections',
                 'Real-time validation',
                 'Versioned deployments',
                 'Internal API bridging'
               ].map((item, i) => (
                 <Reveal key={i} direction="right" delay={0.2 + i * 0.1}>
                   <div className="flex items-center gap-3 text-white/50 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(108,99,255,0.5)]" />
                      <span className="text-sm font-medium tracking-tight group-hover:text-white transition-colors">{item}</span>
                   </div>
                 </Reveal>
               ))}
            </div>
          </div>

          {/* Visual: Laptop Preview (Right) */}
          <Reveal direction="left" className="relative">
            <div className="relative mx-auto w-full max-w-[600px]">
              {/* Laptop Body */}
              <div className="relative aspect-[16/10] bg-[#070709] rounded-2xl border-[8px] border-[#1A1A24] shadow-2xl overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-6 bg-[#1A1A24] flex items-center px-4 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/30" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                </div>
                
                {/* Screen Content */}
                <div className="absolute inset-0 top-6 flex bg-[#070709]">
                  {/* Dashboard Sidebar */}
                  <div className="w-32 border-r border-white/5 bg-white/[0.01] flex flex-col p-2 gap-2 shrink-0">
                    <div className="text-[7px] font-bold text-white/20 uppercase tracking-widest mb-1 px-1">Library</div>
                    {COMPONENTS.map((node) => (
                      <div key={node.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col gap-1.5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
                        <node.icon className={`w-3.5 h-3.5 ${node.color}`} />
                        <span className="text-[7px] font-bold text-white/40 uppercase tracking-tight">{node.label}</span>
                      </div>
                    ))}
                    <div className="mt-auto pt-2 border-t border-white/5">
                       <div className="w-full h-4 rounded bg-white/5 border border-white/5 flex items-center justify-center">
                          <Plus className="w-2.5 h-2.5 text-white/40" />
                       </div>
                    </div>
                  </div>

                  {/* Canvas Area */}
                  <div className="flex-1 p-4 flex flex-col relative overflow-hidden bg-[url('/grid.svg')] bg-[size:16px_16px] bg-opacity-[0.02]">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 shrink-0">
                      <div className="flex gap-4">
                         <div className="w-16 h-2 bg-white/10 rounded-full" />
                         <div className="w-12 h-2 bg-white/5 rounded-full" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-4 rounded bg-white/5 border border-white/5" />
                        <div className="w-12 h-4 rounded bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
                           <span className="text-[6px] font-bold text-accent-purple uppercase tracking-widest">Live</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual Flow Nodes */}
                    <div className="flex-1 relative flex items-center justify-center gap-4">
                      {[
                        { id: 'start', title: 'Start', icon: Zap, color: '#00D4FF' },
                        { id: 'msg', title: 'Message', icon: MessageSquare, color: '#6C63FF' },
                        { id: 'ai', title: 'AI Reasoning', icon: Bot, color: '#00D4FF' },
                        { id: 'api', title: 'Sync API', icon: Globe, color: '#FF6B9D' }
                      ].map((node, i, arr) => (
                        <React.Fragment key={node.id}>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            className="w-24 bg-white/[0.03] border border-white/10 rounded-xl p-3 flex flex-col gap-2 shadow-xl backdrop-blur-md relative z-10"
                          >
                             <div className="flex items-center justify-between">
                                <node.icon className="w-4 h-4" style={{ color: node.color }} />
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                             </div>
                             <div className="text-[9px] font-bold text-white tracking-tight">{node.title}</div>
                             <div className="h-0.5 w-full bg-white/5 rounded-full" />
                          </motion.div>
                          {i < arr.length - 1 && (
                            <div className="w-4 h-px bg-white/10 relative">
                               <motion.div 
                                 animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                 className="absolute top-1/2 -translate-y-1/2 w-2 h-0.5 bg-white/40 shadow-[0_0_8px_white]"
                               />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {/* Properties Panel (Partial) */}
                    <div className="absolute right-0 top-0 bottom-0 w-24 border-l border-white/5 bg-white/[0.01] p-3 flex flex-col gap-3">
                       <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                       <div className="space-y-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="h-3 rounded bg-white/5 border border-white/5" />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop Screen Accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
              
              {/* Floating Labels */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-3 glass-card border-white/10 shadow-xl rounded-xl"
              >
                <Layers className="w-4 h-4 text-accent-cyan" />
              </motion.div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -inset-20 bg-accent-purple/10 blur-[100px] rounded-full -z-10" />
          </Reveal>
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
