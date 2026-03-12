"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, Bot, Zap, Plus, ArrowRight } from 'lucide-react';

const NodeItem = ({ icon: Icon, label, color, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg group cursor-grab active:cursor-grabbing hover:border-accent-purple/50 transition-colors"
  >
    <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
      <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
    </div>
    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{label}</span>
  </motion.div>
);

const CanvasNode = ({ icon: Icon, label, color, position, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: -50, y: -50 }}
    animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
    transition={{ 
      type: 'spring', 
      stiffness: 200, 
      damping: 20,
      delay 
    }}
    className="absolute p-4 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-glass-lg min-w-[140px] z-10"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
    </div>
    
    {/* Port dots */}
    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple border-2 border-[#0B0B0F]" />
    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple border-2 border-[#0B0B0F]" />
  </motion.div>
);

const Connection = ({ start, end, delay }: any) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
    <motion.path
      d={`M ${start.x + 140} ${start.y + 24} L ${end.x} ${end.y + 24}`}
      fill="none"
      stroke="url(#gradient-line)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6C63FF" />
        <stop offset="100%" stopColor="#00D4FF" />
      </linearGradient>
    </defs>
  </svg>
);

export default function DragBuilderPreview() {
  const [showNodes, setShowNodes] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNodes(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#0B0B0F]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center flex-row-reverse lg:flex-row">
          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden glass-card border-white/5 flex shadow-2xl">
            {/* Sidebar Simulation */}
            <div className="w-1/3 border-r border-white/5 bg-white/[0.02] p-6 space-y-4 relative z-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Components</p>
              <NodeItem icon={MessageSquare} label="Message" color="bg-blue-500" delay={0.1} />
              <NodeItem icon={Bot} label="AI Model" color="bg-purple-500" delay={0.2} />
              <NodeItem icon={Zap} label="Condition" color="bg-amber-500" delay={0.3} />
              <NodeItem icon={Plus} label="Integrate" color="bg-emerald-500" delay={0.4} />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                <p className="text-[10px] text-accent-purple font-bold">PRO TIP</p>
                <p className="text-[11px] text-white/50 mt-1">Drag nodes to build logic</p>
              </div>
            </div>

            {/* Canvas Simulation */}
            <div className="flex-1 relative bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] overflow-hidden">
              <AnimatePresence>
                {showNodes && (
                  <>
                    <CanvasNode 
                      icon={MessageSquare} 
                      label="Input" 
                      color="bg-blue-500" 
                      position={{ x: 40, y: 150 }} 
                      delay={0.5} 
                    />
                    <Connection 
                      start={{ x: 40, y: 150 }} 
                      end={{ x: 230, y: 180 }} 
                      delay={1.2} 
                    />
                    <CanvasNode 
                      icon={Bot} 
                      label="Process" 
                      color="bg-purple-500" 
                      position={{ x: 230, y: 180 }} 
                      delay={1.0} 
                    />
                    <Connection 
                      start={{ x: 230, y: 180 }} 
                      end={{ x: 420, y: 120 }} 
                      delay={2.0} 
                    />
                    <CanvasNode 
                      icon={Zap} 
                      label="Route" 
                      color="bg-amber-500" 
                      position={{ x: 420, y: 120 }} 
                      delay={1.8} 
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Fake cursor animation */}
              <motion.div
                initial={{ opacity: 0, x: 100, y: 300 }}
                animate={{ 
                  opacity: [0, 1, 1, 0, 0],
                  x: [100, 50, 400, 400, 100], 
                  y: [300, 100, 180, 180, 300] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute z-50 pointer-events-none"
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-2xl mix-blend-difference border-2 border-black" />
              </motion.div>
            </div>
          </div>

          <div className="space-y-8 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold uppercase tracking-widest"
            >
              Intuitive Interface
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Design like a pro, <br />
              <span className="text-gradient">no code required.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              Our drag-and-drop builder makes it incredibly easy to map out complex AI reasoning. Simply drag nodes, connect them, and watch your agent come to life.
            </motion.p>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {[
                "Instant node snapping & alignment",
                "Automatic logical connection mapping",
                "Real-time state validation",
                "Version-controlled workspace"
              ].map((text, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span className="text-sm">{text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4"
            >
              <button className="group flex items-center gap-2 text-white font-bold hover:text-accent-cyan transition-colors">
                Try the builder
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
