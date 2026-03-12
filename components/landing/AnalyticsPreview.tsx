"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  PieChart, 
  MousePointer2,
  Clock,
  ArrowUpRight,
  Bot
} from 'lucide-react';

const LOG_ENTRIES = [
  { intent: 'Sales', count: 85, color: 'bg-accent-purple' },
  { intent: 'Support', count: 62, color: 'bg-accent-cyan' },
  { intent: 'General', count: 44, color: 'bg-accent-pink' },
];

export default function AnalyticsPreview() {
  return (
    <section className="py-40 relative overflow-hidden bg-[#0A0A0F]">
       <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <div>
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase tracking-widest px-4 mb-6"
                   >
                     Intelligence Dashboard
                   </motion.div>
                   <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-8">
                     Real-time <br />
                     <span className="text-gradient">Intelligence.</span>
                   </h2>
                   <p className="text-white/40 text-xl font-light leading-relaxed max-w-lg">
                     Track every conversation, monitor response times, and optimize your flows with our built-in analytics suite.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   {[
                     { label: 'Avg Latency', val: '< 180ms', icon: Clock },
                     { label: 'Success Rate', val: '99.9%', icon: Activity },
                   ].map((stat, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                     >
                       <div className="flex items-center gap-3 mb-4">
                          <stat.icon className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
                       </div>
                       <p className="text-3xl font-display font-bold text-white mb-2">{stat.val}</p>
                       <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                          <TrendingUp className="w-3 h-3" />
                          Optimal
                       </div>
                     </motion.div>
                   ))}
                </div>
             </div>

             <div className="relative">
                {/* Dashboard Screenshot Simulation */}
                <div className="bg-[#0B0B0F] border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 flex flex-col aspect-[4/3]">
                   {/* Header */}
                   <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                         <TrendingUp className="w-4 h-4 text-accent-purple" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Analytics Overview</span>
                      </div>
                      <div className="h-7 px-3 rounded bg-accent-purple/10 border border-accent-purple/20 flex items-center gap-1.5">
                         <span className="w-1 h-1 rounded-full bg-accent-purple animate-pulse" />
                         <span className="text-[9px] font-bold text-accent-purple tracking-widest uppercase">Live Sync</span>
                      </div>
                   </div>

                   <div className="flex-1 p-8 grid grid-cols-2 gap-6 overflow-hidden">
                      {/* Line Chart Area (Response Latency) */}
                      <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group overflow-hidden">
                         <div className="flex justify-between items-center mb-6">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/30">System Latency (ms)</h5>
                            <span className="text-[10px] font-bold text-white/60">128ms Avg</span>
                         </div>
                         <div className="flex-1 flex items-end gap-2 h-24">
                            {[40, 65, 30, 80, 50, 95, 45, 70, 55, 60, 40, 85].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 + 0.5 }}
                                className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan opacity-40 rounded-t-sm group-hover:opacity-80 transition-opacity"
                              />
                            ))}
                         </div>
                      </div>

                      {/* Bar Chart (Daily Requests) */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                         <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">Throughput</h5>
                         <div className="space-y-4">
                            {[
                               { d: 'Mon', p: 80, c: 'bg-accent-purple' },
                               { d: 'Tue', p: 95, c: 'bg-accent-cyan' },
                               { d: 'Wed', p: 70, c: 'bg-accent-purple' },
                            ].map((day, i) => (
                               <div key={i} className="space-y-1.5">
                                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                                   <span>{day.d}</span>
                                   <span>{day.p}k</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${day.p}%` }}
                                      transition={{ duration: 1, delay: i * 0.1 + 0.8 }}
                                      className={`h-full ${day.c}`} 
                                    />
                                 </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Pie Chart Representation (Intent Distribution) */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative group">
                         <h5 className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-white/30">Intents</h5>
                         <div className="w-24 h-24 rounded-full border-[10px] border-white/5 relative flex items-center justify-center">
                            <motion.div
                              initial={{ rotate: 180, opacity: 0 }}
                              whileInView={{ rotate: 0, opacity: 1 }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="absolute inset-[-10px] rounded-full border-[10px] border-accent-purple border-l-transparent border-b-transparent"
                            />
                            <Bot className="w-5 h-5 text-white/20" />
                         </div>
                         <div className="mt-6 flex gap-3">
                            <div className="flex items-center gap-1.5 grayscale opacity-30">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                               <span className="text-[8px] font-bold uppercase">Sales</span>
                            </div>
                            <div className="flex items-center gap-1.5 grayscale opacity-30">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                               <span className="text-[8px] font-bold uppercase">Support</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Mock UI Labels */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                      <div className="w-20 h-20 bg-accent-purple/10 rounded-full blur-[40px]" />
                   </div>
                </div>

                {/* Accuracy Badge (Secondary) */}
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: 1 }}
                   className="absolute -bottom-8 -left-8 p-6 bg-white rounded-2xl shadow-2xl z-20 max-w-[140px]"
                >
                   <p className="text-[9px] font-black uppercase text-black/30 tracking-widest mb-1 leading-none">Insight</p>
                   <p className="text-sm font-bold text-black leading-tight">Conversation optimized.</p>
                </motion.div>
             </div>
          </div>
       </div>
    </section>
  );
}
