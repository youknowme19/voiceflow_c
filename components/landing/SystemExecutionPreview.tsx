"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, Globe, Play, CheckCircle2, MessageSquare, Shield, ChevronRight } from 'lucide-react';

const STAGES = [
  { id: 'start', label: 'Trigger', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'input', label: 'Validation', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'ai', label: 'AI Engine', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'kb', label: 'Knowledge', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { id: 'api', label: 'Integrate', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'end', label: 'Success', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export default function SystemExecutionPreview() {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const rawLogs = [
    "Initializing secure session...",
    "Incoming request detected: 'Track #5521'",
    "Sanitizing input payload",
    "Requesting GPT-4o context",
    "Analyzing intent... Result: LOGISTICS",
    "Querying Vector Database (Pinecone)",
    "RAG Context retrieved: 3 snippets",
    "Calling FedEx Production API",
    "API Response: 200 OK | Transit",
    "Generating natural language output",
    "Execution cycle complete. 182ms"
  ];

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setActiveStage(-1);

    const steps = [
      { logIdx: 0, delay: 600 },
      { logIdx: 1, delay: 500, stage: 0 },
      { logIdx: 2, delay: 400, stage: 1 },
      { logIdx: 3, delay: 800 },
      { logIdx: 4, delay: 600, stage: 2 },
      { logIdx: 5, delay: 700 },
      { logIdx: 6, delay: 500, stage: 3 },
      { logIdx: 7, delay: 1000, stage: 4 },
      { logIdx: 8, delay: 400 },
      { logIdx: 9, delay: 800 },
      { logIdx: 10, delay: 400, stage: 5 },
    ];

    for (const step of steps) {
      if (step.stage !== undefined) setActiveStage(step.stage);
      
      // Typewriter effect for log
      const fullLog = `> ${rawLogs[step.logIdx]}`;
      setLogs(prev => [...prev, ""]); 
      
      for (let i = 0; i <= fullLog.length; i++) {
        setLogs(prev => {
          const newLogs = [...prev];
          newLogs[newLogs.length - 1] = fullLog.substring(0, i);
          return newLogs;
        });
        await new Promise(r => setTimeout(r, 15));
      }

      await new Promise(r => setTimeout(r, step.delay));
    }

    setIsRunning(false);
    await new Promise(r => setTimeout(r, 4000));
    runSimulation();
  };

  useEffect(() => {
    runSimulation();
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <section className="py-32 relative overflow-hidden bg-[#070709]">
      <div className="container mx-auto px-6">
         <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest px-4"
            >
              Backend Performance
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              See the <span className="text-gradient">magic in action.</span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed font-light">
              No diagrams. No abstractions. Watch our system process enterprise-level requests through a high-performance horizontal pipeline in real-time.
            </p>
         </div>

        <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
          {/* Left Side: Modular Status Cards */}
          <div className="flex flex-col gap-3 h-full">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.id}
                animate={{
                  backgroundColor: activeStage === i ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                  borderColor: activeStage === i ? 'rgba(108, 99, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  scale: activeStage === i ? 1.02 : 1,
                }}
                className="flex-1 flex items-center px-8 rounded-2xl border transition-all duration-300 relative overflow-hidden"
              >
                 {activeStage === i && (
                   <motion.div 
                     layoutId="stage-glow"
                     className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 to-transparent pointer-events-none" 
                   />
                 )}
                 <div className="flex items-center gap-6 relative z-10 w-full">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${activeStage === i ? stage.color : 'text-white/20'}`}>
                       <stage.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Stage {i + 1}</p>
                       <p className={`text-sm font-bold uppercase tracking-tight transition-colors ${activeStage === i ? 'text-white' : 'text-white/20'}`}>
                          {stage.label}
                       </p>
                    </div>
                    {activeStage === i && (
                      <div className="ml-auto flex items-center gap-3">
                         <span className="text-[10px] font-bold text-accent-purple uppercase tracking-[0.2em] animate-pulse">Running</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-glow-purple" />
                      </div>
                    )}
                 </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Typewriter Execution Console */}
          <div className="bg-[#0B0B0F] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.6)] h-full">
            <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-accent-purple" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Execution Console</span>
               </div>
               <div className="flex gap-1.5 opacity-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
               </div>
            </div>

            <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto scrollbar-none flex flex-col gap-2">
               <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('detected') ? 'text-accent-cyan font-bold' : log.includes('complete') ? 'text-emerald-500 font-bold' : 'text-white/60'}>
                       {log}
                    </div>
                  ))}
                  {isRunning && (
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-4 bg-accent-purple ml-1 translate-y-1"
                    />
                  )}
                  <div ref={consoleEndRef} />
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-6 shrink-0">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status: {isRunning ? 'Processing...' : 'Ready'}</p>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">99.9% Uptime</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
