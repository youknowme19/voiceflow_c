"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Database, Globe, CheckCircle, Send, User } from 'lucide-react';

const Node = ({ id, label, icon: Icon, active, color }: any) => (
  <div className="relative group">
    <motion.div
      animate={{ 
        scale: active ? 1.05 : 1,
        borderColor: active ? 'rgba(108, 99, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        backgroundColor: active ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)'
      }}
      className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 min-w-[160px] flex items-center gap-3 relative z-10`}
    >
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-white' : 'text-white/40'}`}>
        {label}
      </span>
      
      {active && (
        <motion.div
          layoutId="highlight"
          className="absolute inset-0 rounded-2xl ring-2 ring-accent-purple shadow-[0_0_20px_rgba(108,99,255,0.3)] pointer-events-none"
        />
      )}
    </motion.div>
    
    {/* Port dots */}
    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/10" />
    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/10" />
  </div>
);

const Line = ({ active }: { active: boolean }) => (
  <div className="h-[2px] w-8 relative overflow-hidden bg-white/5 mx-2">
    {active && (
      <motion.div
        initial={{ left: '-100%' }}
        animate={{ left: '100%' }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-purple to-transparent opacity-50"
      />
    )}
  </div>
);

export default function AutomationPreview() {
  const [activeStep, setActiveStep] = useState(0);
  const [chatSteps, setChatSteps] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const steps = [
    { label: 'Start', icon: User, color: 'bg-blue-500' },
    { label: 'Input', icon: MessageSquare, color: 'bg-indigo-500' },
    { label: 'AI Agent', icon: Bot, color: 'bg-purple-500' },
    { label: 'Knowledge', icon: Database, color: 'bg-cyan-500' },
    { label: 'API Call', icon: Globe, color: 'bg-amber-500' },
    { label: 'End', icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  const runAutomation = async () => {
    if (activeStep !== 0) return;
    
    // User message
    setChatSteps([{ role: 'user', text: 'Where is my order #5521?' }]);
    
    // Sequence
    for (let i = 1; i <= steps.length; i++) {
      setActiveStep(i);
      if (i === 2) setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsTyping(false);
    setChatSteps(prev => [...prev, { role: 'bot', text: 'Order #5521 is processed and in transit from Jersey City. Expected delivery: Mar 15.' }]);
    
    await new Promise(r => setTimeout(r, 3000));
    setActiveStep(0);
    setChatSteps([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeStep === 0) runAutomation();
    }, 8000);
    return () => clearInterval(interval);
  }, [activeStep]);

  return (
    <section className="py-24 relative overflow-hidden bg-[#0B0B0F]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-xs font-bold uppercase tracking-widest"
          >
            Real-time Execution
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            See the <span className="text-gradient">magic in action.</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Every conversation is a live execution. Watch how your flows process data, query knowledge, and respond instantly with high precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workflow column */}
          <GlassCard className="p-10 flex flex-col justify-center gap-6 overflow-hidden min-h-[500px]">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-12 items-center mx-auto max-w-sm">
              <div className="flex items-center">
                <Node label={steps[0].label} icon={steps[0].icon} color={steps[0].color} active={activeStep === 1} />
                <Line active={activeStep === 1} />
              </div>
              <div className="flex items-center">
                <Node label={steps[1].label} icon={steps[1].icon} color={steps[1].color} active={activeStep === 2} />
                <Line active={activeStep === 2} />
              </div>
              <div className="flex items-center">
                <Node label={steps[2].label} icon={steps[2].icon} color={steps[2].color} active={activeStep === 3} />
                <Line active={activeStep === 3} />
              </div>
              <div className="flex items-center">
                <Node label={steps[3].label} icon={steps[3].icon} color={steps[3].color} active={activeStep === 4} />
                <Line active={activeStep === 4} />
              </div>
              <div className="flex items-center">
                <Node label={steps[4].label} icon={steps[4].icon} color={steps[4].color} active={activeStep === 5} />
                <Line active={activeStep === 5} />
              </div>
              <div className="flex items-center">
                <Node label={steps[5].label} icon={steps[5].icon} color={steps[5].color} active={activeStep === 6} />
              </div>
            </div>
          </GlassCard>

          {/* Chat column */}
          <GlassCard className="flex flex-col h-[500px] lg:h-[600px] overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight text-white">Live Console</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Agent Active
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-auto space-y-6 scrollbar-none">
              <AnimatePresence>
                {chatSteps.map((chat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                      ${chat.role === 'user' 
                        ? 'bg-accent-purple/20 border border-accent-purple/30 text-white' 
                        : 'bg-white/5 border border-white/10 text-white/80'}
                    `}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between opacity-50">
                <span className="text-xs text-white/40 font-medium">Auto-simulating user interaction...</span>
                <Send className="w-4 h-4 text-white/20" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// Internal GlassCard component since we are using 'use client' and it's self-contained
const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/5 shadow-2xl ${className}`}>
    {children}
  </div>
);
