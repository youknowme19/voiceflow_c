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
    <section className="py-32 relative bg-[#070709]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Real Chat UI Frame */}
          <div className="relative group">
            <div className="bg-[#0B0B0F] rounded-[32px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/14] max-w-[360px] mx-auto flex flex-col relative z-20">
               {/* Mobile Status Bar */}
               <div className="h-10 px-8 flex items-center justify-between opacity-30">
                  <span className="text-[10px] font-bold text-white leading-none">9:41</span>
                  <div className="flex gap-1.5 h-2 items-center">
                     <div className="w-4 h-1.5 rounded-full bg-white" />
                     <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
               </div>

               {/* App Header */}
               <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center border border-accent-purple/10">
                    <Bot className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">AI Assistant</h4>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       System Active
                    </p>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
                  <AnimatePresence>
                     {messages.map((m, i) => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                          <div className={`p-4 rounded-2xl text-[13px] leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-accent-purple text-white rounded-br-none shadow-glow-purple font-medium' : 'bg-white/5 text-white/70 border border-white/10 rounded-bl-none'}`}>
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
                      <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex gap-1 items-center">
                         <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce" />
                         <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                         <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </motion.div>
                  )}
               </div>

               {/* Input Bar */}
               <div className="p-6 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F] to-transparent">
                  <div className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center px-4 justify-between group-hover:border-white/20 transition-colors">
                     <span className="text-xs text-white/20 font-medium">Type a message...</span>
                     <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center shadow-glow-purple">
                        <Send className="w-4 h-4 text-white" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Efficiency Block - Animated */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -bottom-6 -right-6 lg:-right-12 p-8 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-[200px] z-30 group"
            >
               <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2.5 rounded-xl bg-emerald-500/10">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                     </div>
                     <span className="text-[10px] font-bold text-black opacity-30 uppercase tracking-widest">Efficiency</span>
                  </div>
                  <h5 className="text-2xl font-display font-bold text-black tracking-tight mb-1">98.4%</h5>
                  <p className="text-[10px] text-black/50 font-bold uppercase tracking-wider leading-none">Reasoning Accuracy</p>
                  <div className="mt-4 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: '98.4%' }}
                       transition={{ duration: 1.5, delay: 0.5 }}
                       className="h-full bg-emerald-500" 
                     />
                  </div>
               </div>
            </motion.div>
          </div>

          <div className="space-y-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[10px] font-bold uppercase tracking-widest px-4"
              >
                Real-time Execution
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mt-6 mb-8">
                Watch the magic <br />
                <span className="text-gradient">happening live.</span>
              </h2>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Connect your users to intelligence they can trust. Our platform visualizes the internal reasoning process without the complexity of diagrams.
              </p>
            </div>

            <div className="space-y-4">
               {SYSTEM_TASKS.map((task, i) => (
                 <motion.div
                   key={task.id}
                   animate={{
                     opacity: activeTask === i ? 1 : 0.25,
                     scale: activeTask === i ? 1.02 : 1,
                     x: activeTask === i ? 10 : 0,
                     borderColor: activeTask === i ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                     backgroundColor: activeTask === i ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                   }}
                   className="p-5 rounded-2xl border flex items-center gap-6 transition-all duration-300 backdrop-blur-md"
                 >
                    <div className={`p-4 rounded-xl ${task.bg}`}>
                       <task.icon className={`w-6 h-6 ${task.color}`} />
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">{task.label}</p>
                       <p className="text-[11px] text-white/30 font-medium tracking-tight uppercase">{task.desc}</p>
                    </div>
                    {activeTask === i && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-accent-pink shadow-[0_0_15px_#FF6B9D]"
                      />
                    )}
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
