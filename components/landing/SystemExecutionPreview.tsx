"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Globe, 
  Play, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight,
  Activity,
  Zap,
  Layout
} from 'lucide-react';
import { Reveal } from '@/components/premium/PremiumUI';

interface Log {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warning';
}

const SYSTEM_LOGS: Log[] = [
  { time: '10:24:01', msg: 'System initialization sequence initiated...', type: 'info' },
  { time: '10:24:02', msg: 'Validating security handshake [AES-256]', type: 'info' },
  { time: '10:24:03', msg: 'Network cluster [US-EAST] online', type: 'success' },
  { time: '10:24:04', msg: 'Request intercepted: Process #99182', type: 'info' },
  { time: '10:24:05', msg: 'AI Reasoning Layer: Mapping user intent', type: 'info' },
  { time: '10:24:06', msg: 'Vector database lookup return 4 matches', type: 'info' },
  { time: '10:24:07', msg: 'Executing external API bridge...', type: 'warning' },
  { time: '10:24:08', msg: 'Response received: 200 OK Status', type: 'success' },
  { time: '10:24:09', msg: 'Pipeline execution complete [12.4ms]', type: 'success' },
];

export default function SystemExecutionPreview() {
  const [logs, setLogs] = useState<Log[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLogs = [...prev, SYSTEM_LOGS[currentIdx % SYSTEM_LOGS.length]];
        return nextLogs.slice(-50); // Keep only last 50 logs
      });
      currentIdx++;
      
      if (logContainerRef.current) {
        const { scrollHeight, clientHeight } = logContainerRef.current;
        logContainerRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: 'smooth'
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing relative bg-[#070709] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual: System Execution Console (Left) - Rhythm A */}
          <div className="space-y-6">
            <Reveal direction="right">
               {/* High-Precision Metrics Graph */}
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6 overflow-hidden relative">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-accent-cyan" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Compute Infrastructure</span>
                     </div>
                     <div className="flex gap-4">
                        {[
                          { label: 'CPU', color: '#F59E0B' },
                          { label: 'MEM', color: '#F97316' },
                          { label: 'NET', color: '#EF4444' }
                        ].map(s => (
                          <div key={s.label} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-[8px] font-bold text-white/30 uppercase">{s.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="h-24 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
                      ))}
                      
                      {/* 3 Animated Lines */}
                      {[
                        { color: '#F59E0B', delay: 0, d: "M0,50 Q100,20 200,50 T400,50" },
                        { color: '#F97316', delay: 0.3, d: "M0,60 Q100,40 200,60 T400,60" },
                        { color: '#EF4444', delay: 0.6, d: "M0,70 Q100,80 200,70 T400,70" }
                      ].map((line, i) => (
                        <motion.path
                          key={i}
                          d={line.d}
                          fill="none"
                          stroke={line.color}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={isInView ? {
                            pathLength: 1,
                            opacity: 1
                          } : { 
                            pathLength: 0, 
                            opacity: 0 
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeOut",
                            delay: line.delay
                          }}
                          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        />
                      ))}
                    </svg>
                  </div>
               </div>

               {/* Constrained Console */}
               <div className="bg-[#0B0B0F] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative z-20 group">
                {/* Header */}
                <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-4">
                     <Terminal className="w-4 h-4 text-accent-cyan" />
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Infrastructure Console</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Healthy</span>
                  </div>
                </div>

                {/* Console Body */}
                <div 
                  ref={logContainerRef}
                  className="h-[320px] bg-[#070709] p-6 font-mono text-[10px] overflow-y-auto space-y-3 scrollbar-none"
                >
                  {logs.slice(-50).map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 border-l border-white/10 pl-4 py-0.5"
                    >
                      <span className="text-white/20 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'info' ? 'text-accent-cyan/60' : log.type === 'success' ? 'text-emerald-500/60' : 'text-accent-pink/60'}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Text Content (Right) */}
          <div className="space-y-8 lg:pl-12">
            <Reveal direction="left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-cyan/5 border border-accent-cyan/20 text-accent-cyan text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                System Health
              </div>
              <h2 className="text-3xl md:text-[36px] font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
                Infrastructure <br />
                <span className="text-gradient">unleashed.</span>
              </h2>
              <p className="text-base md:text-lg text-white/40 font-light leading-relaxed max-w-xl">
                Operate at the speed of thought. Our globally distributed network ensures ultra-low latency execution for every single AI agent you deploy.
              </p>
            </Reveal>

            {/* Discrete Stat Cards to avoid overlap */}
            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Precision', value: '99.8%', icon: ShieldCheck },
                 { label: 'Scale Index', value: '12.5k', icon: Activity, unit: 'TPS' },
                 { label: 'Latency', value: '<200ms', icon: Zap }
               ].map((stat, i) => (
                 <Reveal key={i} direction="up" delay={0.2 + i * 0.1}>
                   <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                      <p className="text-xl font-display font-bold text-white tracking-tight">
                        {stat.value}
                        {stat.unit && <span className="text-[8px] opacity-30 ml-0.5">{stat.unit}</span>}
                      </p>
                   </div>
                 </Reveal>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
