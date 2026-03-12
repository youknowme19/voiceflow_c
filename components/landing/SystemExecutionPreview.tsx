"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, Globe, Play, CheckCircle2, MessageSquare, Shield } from 'lucide-react';

const STAGES = [
  { id: 'start', label: 'Trigger', icon: MessageSquare, color: 'text-blue-400' },
  { id: 'input', label: 'Input Validation', icon: Shield, color: 'text-indigo-400' },
  { id: 'ai', label: 'AI Processing', icon: Cpu, color: 'text-purple-400' },
  { id: 'kb', label: 'Knowledge Base', icon: Database, color: 'text-cyan-400' },
  { id: 'api', label: 'API Integration', icon: Globe, color: 'text-amber-400' },
  { id: 'end', label: 'Response', icon: CheckCircle2, color: 'text-emerald-400' },
];

export default function SystemExecutionPreview() {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [demoResponse, setDemoResponse] = useState(false);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setActiveStage(-1);
    setDemoResponse(false);

    const addLog = (msg: string) => {
      setLogs(prev => [...prev.slice(-12), `> ${msg}`]);
    };

    const steps = [
      { log: 'Initializing secure session...', delay: 600 },
      { log: 'Incoming request: "Where is my order #5521?"', delay: 800, stage: 0 },
      { log: 'Validating payload structure...', delay: 500, stage: 1 },
      { log: 'Analyzing intent with AI Engine (GPT-4o)...', delay: 1000, stage: 2 },
      { log: 'Detected intent: ORDER_STATUS', delay: 400 },
      { log: 'Querying vector database for shipping policy...', delay: 800, stage: 3 },
      { log: 'Found: Delivery ETA standard 3-5 days.', delay: 400 },
      { log: 'Requesting live data from FedEx API...', delay: 1200, stage: 4 },
      { log: 'API Status 200 OK | Latitude: 40.7128, Longitude: -74.0060', delay: 400 },
      { log: 'Synthesizing personalized response...', delay: 800, stage: 5 },
      { log: 'Response successfully delivered to client.', delay: 400 },
    ];

    for (const step of steps) {
      addLog(step.log);
      if (step.stage !== undefined) setActiveStage(step.stage);
      await new Promise(r => setTimeout(r, step.delay));
    }

    setDemoResponse(true);
    setIsRunning(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRunning) runSimulation();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase tracking-widest px-4"
          >
            System Execution
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            See the <span className="text-gradient">magic in action.</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed font-light">
            No flowcharts, no diagrams. Just advanced AI systems executing complex tasks with military-grade precision in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Side: Pipeline Visualization */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">System Pipeline</p>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 flex items-center gap-1.5 transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-30'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ACTIVE
                </div>
              </div>

              {STAGES.map((stage, idx) => (
                <div key={stage.id} className="relative">
                  <motion.div
                    animate={{
                      backgroundColor: activeStage === idx ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      borderColor: activeStage === idx ? 'rgba(108, 99, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    }}
                    className="flex items-center h-16 px-6 rounded-2xl border transition-all duration-300 relative z-10"
                  >
                    <div className={`p-2 rounded-lg bg-white/5 mr-4 transition-colors duration-300 ${activeStage === idx ? stage.color : 'text-white/20'}`}>
                      <stage.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-bold tracking-wide uppercase transition-colors duration-300 ${activeStage === idx ? 'text-white' : 'text-white/20'}`}>
                      {stage.label}
                    </span>
                    
                    {activeStage === idx && (
                      <motion.div
                        layoutId="active-glow"
                        className="absolute right-6 w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_15px_rgba(108,99,255,1)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                  
                  {idx < STAGES.length - 1 && (
                    <div className="h-4 w-[2px] bg-white/5 mx-auto relative z-0" />
                  )}
                </div>
              ))}
            </div>

            <button
               onClick={runSimulation}
               disabled={isRunning}
               className={`mt-12 group flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 border ${isRunning ? 'bg-white/5 text-white/20 border-white/5' : 'bg-white text-black hover:scale-[1.02] border-white'}`}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
              {isRunning ? 'Running Simulation...' : 'Reset & Re-run Demo'}
            </button>
          </div>

          {/* Right Side: Console UI */}
          <div className="bg-[#0B0B0F] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Console Header */}
            <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-accent-purple" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Execution Console</span>
              </div>
              <div className="flex gap-1.5 text-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-current" />
                <div className="w-2.5 h-2.5 rounded-full bg-current" />
                <div className="w-2.5 h-2.5 rounded-full bg-current" />
              </div>
            </div>

            {/* Console Body */}
            <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-hidden flex flex-col justify-end">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={log + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={log.startsWith('> Incoming') ? 'text-accent-cyan font-bold' : 'text-white/60'}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isRunning && (
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-accent-purple"
                  />
                )}
              </div>
            </div>

            {/* Final Chat Bubble Overlay */}
            <AnimatePresence>
              {demoResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-12 right-12 max-w-sm"
                >
                  <div className="bg-white p-6 rounded-2xl rounded-br-none shadow-2xl relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold text-black opacity-40 uppercase tracking-widest">System Response</span>
                    </div>
                    <p className="text-sm text-black leading-relaxed font-medium">
                      Order #5521 is processed and in transit from New Jersey. Expected delivery: **Tuesday, March 18th**.
                    </p>
                    <div className="absolute -bottom-3 right-0 w-6 h-6 bg-white rotate-45 transform origin-top-right scale-x-75 shadow-lg" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
