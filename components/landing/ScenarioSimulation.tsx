"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Cpu, Database, Globe, User, Send, CheckCircle2 } from 'lucide-react';

const TASKS = [
  { id: 'ai', label: 'AI Intent Analysis', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'kb', label: 'Vector DB Search', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { id: 'api', label: 'Shipping API Link', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

export default function ScenarioSimulation() {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [status, setStatus] = useState('Idle');

  const runScenario = async () => {
    setActiveTask(null);
    setMessages([]);
    setStatus('Ready');
    await new Promise(r => setTimeout(r, 1500));

    // User message
    setMessages([{ role: 'user', text: 'Track order #5521' }]);
    setStatus('User Input Received');
    await new Promise(r => setTimeout(r, 1000));

    // AI Step
    setActiveTask('ai');
    setStatus('Analyzing intent...');
    await new Promise(r => setTimeout(r, 1200));

    // DB Step
    setActiveTask('kb');
    setStatus('Searching knowledge base...');
    await new Promise(r => setTimeout(r, 1000));

    // API Step
    setActiveTask('api');
    setStatus('Querying shipping service...');
    await new Promise(r => setTimeout(r, 1500));

    // Success
    setActiveTask(null);
    setStatus('Completed');
    setMessages(prev => [...prev, { role: 'assistant', text: 'Order #5521 is in transit. Estimated delivery: Tuesday.' }]);

    await new Promise(r => setTimeout(r, 4000));
    runScenario();
  };

  useEffect(() => {
    runScenario();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[10px] font-bold uppercase tracking-widest px-4"
            >
              Enterprise Workflows
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Build workflows that <br />
              <span className="text-gradient">actually work.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed font-light">
              Stop fighting with diagrams. Our system uses a high-performance execution engine that connects your reasoning to production data instantly.
            </p>
            
            <div className="space-y-6 pt-6">
               {TASKS.map((task) => (
                 <motion.div
                   key={task.id}
                   animate={{
                     opacity: activeTask === task.id ? 1 : 0.3,
                     scale: activeTask === task.id ? 1.02 : 1,
                     borderColor: activeTask === task.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                   }}
                   className="p-5 rounded-2xl bg-white/[0.02] border flex items-center gap-5 transition-all duration-300"
                 >
                    <div className={`p-3 rounded-xl ${task.bg}`}>
                       <task.icon className={`w-5 h-5 ${task.color}`} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">System Task</p>
                       <p className="text-sm font-bold text-white uppercase tracking-wider">{task.label}</p>
                    </div>
                    {activeTask === task.id && (
                      <div className="ml-auto">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-accent-pink shadow-[0_0_10px_#FF6B9D]" 
                        />
                      </div>
                    )}
                 </motion.div>
               ))}
            </div>
          </div>

          <div className="relative">
             {/* Mock App Interface */}
             <div className="bg-[#0B0B0F] rounded-[40px] border-[8px] border-white/5 shadow-2xl overflow-hidden aspect-[9/16] max-w-[340px] mx-auto relative">
                {/* Status Bar */}
                <div className="h-10 px-8 flex items-center justify-between opacity-30">
                   <span className="text-[10px] font-bold text-white">9:41</span>
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full border border-white" />
                      <div className="w-3 h-3 rounded-full border border-white" />
                   </div>
                </div>

                {/* App Header */}
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                     <Cpu className="w-5 h-5 text-accent-purple" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">Support Bot</p>
                     <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                     </p>
                   </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 p-6 space-y-6 overflow-hidden">
                   <AnimatePresence>
                      {messages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                           <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-accent-purple text-white rounded-br-none font-medium' : 'bg-white/5 text-white/50 border border-white/10 rounded-bl-none'}`}>
                              {m.text}
                           </div>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
                
                {/* Status bar */}
                <div className="absolute bottom-24 left-0 right-0 px-8">
                   <AnimatePresence>
                      {status !== 'Idle' && status !== 'Completed' && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-[9px] font-bold text-accent-pink uppercase tracking-widest"
                        >
                           <span className="w-1 h-1 rounded-full bg-accent-pink animate-ping" />
                           {status}
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0B0F] to-transparent">
                   <div className="h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 justify-between">
                      <div className="w-20 h-2 bg-white/10 rounded" />
                      <Send className="w-4 h-4 text-white/20" />
                   </div>
                </div>
             </div>
             
             {/* Floating Badge */}
             <div className="absolute -top-6 -right-6 lg:-right-12 p-6 bg-white rounded-3xl shadow-2xl max-w-[180px]">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span className="text-[10px] font-bold text-black opacity-30 uppercase tracking-widest">Efficiency</span>
                </div>
                <p className="text-sm font-bold text-black tracking-tight leading-none mb-1">98.4% Accuracy</p>
                <p className="text-[10px] text-black/40">Measured on live production agents.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
