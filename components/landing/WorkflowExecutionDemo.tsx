"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Globe, 
  Send, 
  CheckCircle2, 
  Mic,
  Search,
  Zap,
  Bot
} from 'lucide-react';

import { Reveal, GlassCard } from '@/components/premium/PremiumUI';

const SYSTEM_TASKS = [
  { id: 'ai', label: 'AI Intent Analysis', desc: 'GPT-4o Reasoning', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'kb', label: 'Vector Database Search', desc: 'RAG Knowledge Lookup', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { id: 'api', label: 'Shipping API Query', desc: 'Live Logistics Sync', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

export default function WorkflowExecutionDemo() {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<number>(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const runDemo = async () => {
    setMessages([]);
    setActiveTask(-1);
    setIsProcessing(false);
    await new Promise(r => setTimeout(r, 1000));

    // User Message
    setMessages([{ role: 'user', text: "Where is my order #5521?" }]);
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));

    // AI Step
    setActiveTask(0);
    await new Promise(r => setTimeout(r, 1200));

    // DB Step
    setActiveTask(1);
    await new Promise(r => setTimeout(r, 1000));

    // API Step
    setActiveTask(2);
    await new Promise(r => setTimeout(r, 1500));

    // Assistant Message
    setActiveTask(-1);
    setIsProcessing(false);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      text: "Order #5521 is in transit. Estimated delivery: Tuesday, March 18th." 
    }]);

    await new Promise(r => setTimeout(r, 4000));
    runDemo();
  };

  useEffect(() => {
    runDemo();
  }, []);

  return (
    <section className="section-spacing relative bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          {/* Visual: Real Chat UI Frame (Left) */}
          <Reveal direction="right" className="relative group lg:order-first">
            <div className="bg-[#0B0B0F] rounded-[48px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden min-h-[640px] max-w-[380px] mx-auto flex flex-col relative z-20 transition-all duration-700 group-hover:shadow-[0_60px_120px_rgba(108,99,255,0.2)]">
               {/* Mobile Status Bar */}
               <div className="h-12 px-10 flex items-center justify-between opacity-30">
                  <span className="text-[11px] font-bold text-white leading-none">9:41</span>
                  <div className="flex gap-2 h-2.5 items-center">
                     <div className="w-5 h-2 rounded-full bg-white" />
                     <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
               </div>

               {/* App Header */}
               <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/20 flex items-center justify-center border border-accent-purple/10">
                    <Bot className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">AI Assistant</h4>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       System Active
                    </p>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 p-8 space-y-8 overflow-hidden flex flex-col">
                  <AnimatePresence>
                     {messages.map((m, i) => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, y: 20, scale: 0.9 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                         className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                          <div className={`p-5 rounded-[24px] text-[14px] leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-white text-black rounded-br-none font-bold shadow-2xl' : 'bg-white/[0.05] text-white/80 border border-white/10 rounded-bl-none italic'}`}>
                             {m.text}
                          </div>
                       </motion.div>
                     ))}
                  </AnimatePresence>

                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex gap-1.5 items-center">
                         <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                         <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                         <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </motion.div>
                  )}
               </div>

               {/* Input Bar */}
               <div className="p-8 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F] to-transparent">
                  <div className="h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center px-6 justify-between group-hover:border-white/20 transition-colors">
                     <span className="text-sm text-white/20 font-medium tracking-wide">Type a message...</span>
                     <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shadow-2xl">
                        <Send className="w-5 h-5" />
                     </div>
                  </div>
               </div>
            </div>

          {/* Stats Overlay - rhythm A */}
          <div className="absolute -bottom-10 -right-10 z-30">
            <Reveal direction="up" delay={0.6}>
              <GlassCard 
                variant="strong" 
                className="p-6 w-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00D4FF]" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Precision</span>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-white leading-none mb-1">99.8%</div>
                    <div className="text-[10px] text-white/30 font-medium">Reasoning Success Rate</div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
          </Reveal>

          {/* Text Content (Right) */}
          <div className="space-y-8 lg:pl-12">
            <Reveal direction="left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-pink/5 border border-accent-pink/20 text-accent-pink text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                Live Execution
              </div>
              <h2 className="text-3xl md:text-[36px] font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
                Watch logic <br />
                <span className="text-gradient">in motion.</span>
              </h2>
              <p className="text-base md:text-lg text-white/40 font-light leading-relaxed max-w-xl">
                Experience crystal-clear AI execution. We don't just show outputs; we surface the underlying intelligence that powers every interaction.
              </p>
            </Reveal>

             <div className="space-y-6">
                {SYSTEM_TASKS.map((task, i) => (
                  <Reveal key={task.id} direction="left" delay={0.2 + i * 0.1}>
                    <motion.div
                      animate={{
                        opacity: activeTask === i ? 1 : 0.3,
                        scale: activeTask === i ? 1.02 : 1,
                        x: activeTask === i ? 12 : 0,
                        borderColor: activeTask === i ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        backgroundColor: activeTask === i ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                      }}
                      className="p-8 rounded-[24px] border flex items-center gap-8 transition-all duration-500 backdrop-blur-3xl group"
                    >
                       <div className={`p-4 rounded-[18px] ${task.bg} ring-1 ring-white/10 group-hover:ring-white/20 transition-all`}>
                          <task.icon className={`w-6 h-6 ${task.color}`} />
                       </div>
                       <div>
                          <p className="text-[12px] font-bold text-white uppercase tracking-[0.2em] mb-1.5 leading-none">{task.label}</p>
                          <p className="text-[11px] text-white/30 font-medium tracking-tight uppercase leading-none">{task.desc}</p>
                       </div>
                       {activeTask === i && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="ml-auto w-3 h-3 rounded-full bg-accent-pink shadow-[0_0_20px_#FF6B9D]"
                         />
                       )}
                    </motion.div>
                  </Reveal>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
