"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  PieChart, 
  MousePointer2,
  Clock,
  ArrowUpRight,
  Bot,
  Zap,
  ShieldCheck,
  Globe,
  Cpu
} from 'lucide-react';
import { Reveal } from '@/components/premium/PremiumUI';

export default function AnalyticsPreview() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  return (
    <section ref={sectionRef} className="section-spacing relative bg-[#0B0B0F] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content (Left) - Rhythm B: Text Left / Visual Right */}
          <div className="space-y-8 max-w-2xl">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-cyan/5 border border-accent-cyan/20 text-accent-cyan text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                Intelligence
              </div>
              <h2 className="text-3xl md:text-[36px] font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
                Insights <br />
                <span className="text-gradient">revealed.</span>
              </h2>
              <p className="text-base md:text-lg text-white/40 font-light leading-relaxed">
                Measure what matters. Our deeply integrated analytics engine surfaces subtle patterns in agent behavior, allowing you to optimize performance with surgical precision.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 pt-4">
               {[
                 { label: 'Avg Latency', value: '42ms', change: '-12%' },
                 { label: 'Success Rate', value: '99.8%', change: '+0.2%' },
                 { label: 'Token Cost', value: '$0.4/k', change: '-8%' },
                 { label: 'Retention', value: '84%', change: '+5%' }
               ].map((stat, i) => (
                 <Reveal key={i} direction="up" delay={0.2 + i * 0.1}>
                   <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-display font-bold text-white tracking-tight">{stat.value}</span>
                         <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-accent-cyan'}`}>{stat.change}</span>
                      </div>
                   </div>
                 </Reveal>
               ))}
            </div>
          </div>

          {/* Visual: Analytics Dashboard (Right) */}
          <Reveal direction="left" className="relative lg:order-last">
            <div className="bg-[#0B0B0F] rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[520px] flex flex-col relative z-20 group">
              {/* Toolbar */}
              <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                   <div className="flex gap-2 opacity-30 grayscale">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                   </div>
                   <div className="h-2 w-24 bg-white/5 rounded-full" />
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 rounded bg-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/5">Live Monitoring</div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                 {/* Precision Line Graph Simulation */}
                 <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden min-h-[240px]">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                       <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Agent Performance</h4>
                       <div className="flex gap-4">
                        {[
                          { label: 'Latency', color: '#00E5FF' },
                          { label: 'Load', color: '#FF6B9D' },
                          { label: 'Efficiency', color: '#6C63FF' }
                        ].map(l => (
                          <div key={l.label} className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: l.color, color: l.color }} />
                             <span className="text-[9px] text-white/30 font-bold uppercase">{l.label}</span>
                          </div>
                        ))}
                       </div>
                    </div>
                    
                    {/* SVG Line Graph */}
                    <div className="flex-1 relative w-full h-full">
                       <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          {[0, 1, 2, 3].map((i) => (
                            <line key={i} x1="0" y1={50 * i} x2="400" y2={50 * i} stroke="white" strokeOpacity="0.03" strokeWidth="1" />
                          ))}
                          
                          {/* 3 Animated Lines - Draw once and stay */}
                          {[
                            { color: '#00E5FF', d: "M0,75 L40,85 L80,70 L120,95 L160,80 L200,90 L240,75 L280,85 L400,80" },
                            { color: '#FF6B9D', d: "M0,100 L50,90 L100,110 L150,95 L200,105 L250,90 L300,110 L400,100" },
                            { color: '#6C63FF', d: "M0,50 L60,40 L120,60 L180,45 L240,55 L300,40 L400,50" }
                          ].map((line, i) => (
                            <motion.path
                              key={i}
                              d={line.d}
                              fill="none"
                              stroke={line.color}
                              strokeWidth={i === 0 ? "1.5" : "1"}
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={isInView ? { 
                                pathLength: 1, 
                                opacity: i === 0 ? 1 : 0.5
                              } : {
                                pathLength: 0,
                                opacity: 0
                              }}
                              transition={{ 
                                duration: 2.5, 
                                ease: "easeOut",
                                delay: i * 0.2
                              }}
                              filter={i === 0 ? "drop-shadow(0 0 4px currentColor)" : "none"}
                              style={{ color: line.color }}
                            />
                          ))}
                       </svg>
                    </div>
                 </div>

                 {/* Metrics Row */}
                 <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'Efficiency', value: '99.9%' },
                      { label: 'Throughput', value: '12.5k', unit: 'TPS' },
                      { label: 'Uptime', value: '100.0%' }
                    ].map((m, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col justify-center gap-2 min-w-0">
                         <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] truncate">{m.label}</p>
                         <p className="text-xl lg:text-2xl font-display font-bold text-white truncate">
                           {m.value}
                           {m.unit && <span className="text-[10px] opacity-30 ml-0.5">{m.unit}</span>}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      
      {/* Visual Accents */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[150px] -z-10" />
    </section>
  );
}
