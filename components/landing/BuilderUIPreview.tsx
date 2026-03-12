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
  Monitor
} from 'lucide-react';

const COMPONENTS = [
  { id: 'msg', label: 'Message', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'ai', label: 'AI Model', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'cond', label: 'Condition', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'api', label: 'Integrate', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export default function BuilderUIPreview() {
  const [placedNodes, setPlacedNodes] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { type: 'msg', pos: { x: 50, y: 100 } },
    { type: 'ai', pos: { x: 280, y: 150 } },
    { type: 'api', pos: { x: 510, y: 80 } },
  ];

  const animateBuilder = async () => {
    setPlacedNodes([]);
    setActiveStep(0);
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i + 1);
      const component = COMPONENTS.find(c => c.id === steps[i].type);
      setPlacedNodes(prev => [...prev, { ...component, ...steps[i] }]);
      await new Promise(r => setTimeout(r, 1500));
    }

    await new Promise(r => setTimeout(r, 3000));
    animateBuilder();
  };

  useEffect(() => {
    animateBuilder();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Realistic App Frame */}
            <div className="bg-[#0B0B0F] rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden aspect-[16/10] flex flex-col">
              {/* Header */}
              <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                  <div className="flex gap-1.5 grayscale opacity-30">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="h-4 w-[1px] bg-white/10 mx-2" />
                  <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">VoiceBuild / Project Alpha</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="px-3 py-1 rounded bg-accent-purple/10 border border-accent-purple/20">
                     <span className="text-[10px] font-bold text-accent-purple tracking-widest uppercase">Draft</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                     <Share2 className="w-3.5 h-3.5 text-white/40" />
                   </div>
                   <div className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest">
                     Publish
                   </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 border-r border-white/5 bg-[#09090D] p-5 space-y-6">
                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Library</p>
                      {COMPONENTS.map((c, i) => (
                        <div key={c.id} className="relative">
                          <div className={`p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3 opacity-40`}>
                            <div className={`p-1.5 rounded-lg ${c.bg}`}>
                              <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                            </div>
                            <span className="text-[11px] font-bold text-white/60 tracking-tight">{c.label}</span>
                          </div>
                          
                          {/* Animated Drag Ghost */}
                          {activeStep === i + 1 && (
                            <motion.div
                              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                              animate={{ 
                                opacity: [1, 1, 0],
                                scale: [1, 1.05, 0.95],
                                x: steps[i].pos.x + 100, // Relative to sidebar
                                y: steps[i].pos.y - 0, 
                              }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                              className={`absolute inset-0 p-3 rounded-xl border border-accent-purple/50 bg-accent-purple/10 flex items-center gap-3 z-50`}
                            >
                               <div className={`p-1.5 rounded-lg ${c.bg}`}>
                                <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                              </div>
                              <span className="text-[11px] font-bold text-white tracking-tight">{c.label}</span>
                            </motion.div>
                          )}
                        </div>
                      ))}
                   </div>

                   <div className="pt-8 space-y-4">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Settings</p>
                      <div className="h-2 w-full bg-white/5 rounded" />
                      <div className="h-2 w-2/3 bg-white/5 rounded" />
                   </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]">
                  <AnimatePresence>
                    {placedNodes.map((node, i) => (
                      <React.Fragment key={i}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          style={{ left: node.pos.x, top: node.pos.y }}
                          className="absolute w-44 p-4 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl z-10"
                        >
                           <div className="flex items-center gap-3 mb-3">
                              <div className={`p-1.5 rounded-lg ${node.bg}`}>
                                <node.icon className={`w-3.5 h-3.5 ${node.color}`} />
                              </div>
                              <span className="text-[10px] font-bold text-white uppercase tracking-widest">{node.label}</span>
                           </div>
                           <div className="space-y-1.5">
                              <div className="h-1.5 w-full bg-white/5 rounded" />
                              <div className="h-1.5 w-4/5 bg-white/5 rounded" />
                           </div>

                           <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple border-4 border-[#09090D]" />
                           <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple border-4 border-[#09090D]" />
                        </motion.div>

                        {/* Connection Line */}
                        {i > 0 && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <motion.path
                              d={`M ${placedNodes[i-1].pos.x + 176} ${placedNodes[i-1].pos.y + 40} L ${node.pos.x} ${node.pos.y + 40}`}
                              stroke="rgba(108, 99, 255, 0.2)"
                              strokeWidth="2"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.8 }}
                            />
                             <motion.path
                              d={`M ${placedNodes[i-1].pos.x + 176} ${placedNodes[i-1].pos.y + 40} L ${node.pos.x} ${node.pos.y + 40}`}
                              stroke="#6C63FF"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="4 4"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                          </svg>
                        )}
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                  
                  {/* Floating Prompt */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                     <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Drag components to build logic</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-purple/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-cyan/10 rounded-full blur-[80px] -z-10" />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest px-4"
            >
              Visual Orchestration
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Design like a pro, <br />
              <span className="text-gradient">shipped instantly.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed font-light">
              Our intuitive builder dashboard isn&apos;t just a playground—it&apos;s a production environment. 
              Drag, connect, and deploy complex AI flows with the speed of thought.
            </p>
            
            <div className="space-y-4 pt-4">
               {[
                 'Native support for 100+ API integrations',
                 'Automatic logical error detection',
                 'Live preview of node output data',
                 'Collaborative multi-user editing'
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 text-white/80 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium tracking-wide">{item}</span>
                 </div>
               ))}
            </div>

            <div className="pt-8">
               <button className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[11px] hover:text-accent-cyan transition-colors">
                 Explore the builder
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
