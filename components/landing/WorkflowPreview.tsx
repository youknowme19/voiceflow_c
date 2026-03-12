"use client";

import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position,
  MarkerType,
  Edge,
  Node,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, MessageSquare, Bot, Globe, CheckCircle } from 'lucide-react';

// Custom Node Styling
const NodeWrapper = ({ children, title, icon: Icon, color }: any) => (
  <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-glass-lg min-w-[150px] group transition-all duration-300 hover:border-accent-purple/50">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{title}</p>
        <p className="text-xs font-semibold text-white">{children}</p>
      </div>
    </div>
  </div>
);

const CustomNode = ({ data }: any) => (
  <div className="relative">
    <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-accent-purple border-none" />
    <NodeWrapper title={data.type} icon={data.icon} color={data.color}>
      {data.label}
    </NodeWrapper>
    <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-accent-purple border-none" />
    {data.active && (
      <div className="absolute inset-0 rounded-xl ring-2 ring-accent-purple animate-pulse-glow pointer-events-none" />
    )}
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'custom', 
    position: { x: 0, y: 100 }, 
    data: { label: 'User Trigger', type: 'Trigger', icon: MessageSquare, color: 'bg-blue-500' } 
  },
  { 
    id: '2', 
    type: 'custom', 
    position: { x: 250, y: 100 }, 
    data: { label: 'Analyze Intent', type: 'AI Agent', icon: Bot, color: 'bg-purple-500' } 
  },
  { 
    id: '3', 
    type: 'custom', 
    position: { x: 500, y: 100 }, 
    data: { label: 'Fetch Order', type: 'API Call', icon: Globe, color: 'bg-cyan-500' } 
  },
  { 
    id: '4', 
    type: 'custom', 
    position: { x: 750, y: 100 }, 
    data: { label: 'Final Response', type: 'Complete', icon: CheckCircle, color: 'bg-green-500' } 
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: false, 
    style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.1)' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: false,
    style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.1)' }
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    animated: false,
    style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.1)' }
  },
];

export default function WorkflowPreview() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [chatMessage, setChatMessage] = useState<string | null>(null);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setChatMessage(null);

    const stepDelay = 800;

    // Reset everything
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, active: false } })));
    setEdges(eds => eds.map(e => ({ ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 } })));

    // Step 1
    setNodes(nds => nds.map(n => n.id === '1' ? { ...n, data: { ...n.data, active: true } } : n));
    await new Promise(r => setTimeout(r, stepDelay));

    // Edge 1-2
    setEdges(eds => eds.map(e => e.id === 'e1-2' ? { ...e, animated: true, style: { stroke: '#6C63FF', strokeWidth: 3 } } : e));
    await new Promise(r => setTimeout(r, stepDelay));

    // Step 2
    setNodes(nds => nds.map(n => n.id === '2' ? { ...n, data: { ...n.data, active: true } } : n));
    await new Promise(r => setTimeout(r, stepDelay));

    // Edge 2-3
    setEdges(eds => eds.map(e => e.id === 'e2-3' ? { ...e, animated: true, style: { stroke: '#00D4FF', strokeWidth: 3 } } : e));
    await new Promise(r => setTimeout(r, stepDelay));

    // Step 3
    setNodes(nds => nds.map(n => n.id === '3' ? { ...n, data: { ...n.data, active: true } } : n));
    await new Promise(r => setTimeout(r, stepDelay));

    // Edge 3-4
    setEdges(eds => eds.map(e => e.id === 'e3-4' ? { ...e, animated: true, style: { stroke: '#FF6B9D', strokeWidth: 3 } } : e));
    await new Promise(r => setTimeout(r, stepDelay));

    // Step 4
    setNodes(nds => nds.map(n => n.id === '4' ? { ...n, data: { ...n.data, active: true } } : n));
    await new Promise(r => setTimeout(r, stepDelay));

    setChatMessage("Your order #1234 is currently in transit and will arrive by Tuesday.");
    setIsRunning(false);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#0B0B0F]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold uppercase tracking-widest"
            >
              Live Workflow
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Build workflows that <br />
              <span className="text-gradient">actually work.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              Experience the power of a visual builder that connects your AI agents to real-world APIs and knowledge bases in seconds.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onClick={runSimulation}
              disabled={isRunning}
              className={`
                group flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300
                ${isRunning ? 'bg-white/5 cursor-not-allowed text-white/40' : 'bg-white text-black hover:scale-105 active:scale-95'}
              `}
            >
              <Play className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
              {isRunning ? 'Running Demo...' : 'Run Simulation'}
            </motion.button>

            <AnimatePresence>
              {chatMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-glass-lg max-w-sm mt-8 relative"
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-accent-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/40 mb-1">AI Assistant</p>
                      <p className="text-sm text-white/90 leading-relaxed">{chatMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden glass-card border-white/5 group shadow-2xl">
            <div className="absolute inset-0 bg-black/40 z-0" />
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnDrag={false}
              style={{ zIndex: 1 }}
              className="pointer-events-none"
            >
              <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
            </ReactFlow>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-accent-purple/5 to-transparent z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
