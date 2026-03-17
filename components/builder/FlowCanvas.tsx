"use client";

import React, { useCallback, useEffect } from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { supabase } from "../../lib/supabaseClient";
import CustomNode from "./CustomNode";
import DeployModal from "./DeployModal";

const nodeTypes = {
  start: CustomNode,
  message: CustomNode,
  ai: CustomNode,
  condition: CustomNode,
  api: CustomNode,
  knowledge: CustomNode,
  end: CustomNode,
  input: CustomNode,
};

interface FlowCanvasProps {
  agentId: string;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ agentId }) => {
  const nodes = useBuilderStore((s: BuilderState) => s.nodes);
  const edges = useBuilderStore((s: BuilderState) => s.edges);
  const setNodes = useBuilderStore((s: BuilderState) => s.setNodes);
  const setEdges = useBuilderStore((s: BuilderState) => s.setEdges);
  const setSelectedNode = useBuilderStore((s: BuilderState) => s.setSelectedNode);
  const [isDeployOpen, setIsDeployOpen] = React.useState(false);
  const [agentName, setAgentName] = React.useState("");

  const loadFlow = useCallback(async () => {
    const { data: nodeData, error: nodeErr } = await supabase
      .from("nodes")
      .select("*")
      .eq("agent_id", agentId);
    const { data: edgeData, error: edgeErr } = await supabase
      .from("edges")
      .select("*")
      .eq("agent_id", agentId);
    if (nodeErr || edgeErr) {
      console.error(nodeErr || edgeErr);
      return;
    }
    setNodes(
      (nodeData || []).map((n: any) => ({
        id: n.id,
        type: n.type,
        data: n.data,
        position: n.position,
      }))
    );
    setEdges(
      (edgeData || []).map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        data: e.data,
      }))
    );
  }, [agentId]);

  useEffect(() => {
    async function init() {
      const { data: agent } = await supabase.from('agents').select('name').eq('id', agentId).single();
      if (agent) setAgentName(agent.name);
      
      if (agentId) loadFlow();
    }
    init();
  }, [agentId, loadFlow]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updated = applyNodeChanges(changes, nodes);
      setNodes(updated);
    },
    [nodes, setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updated = applyEdgeChanges(changes, edges);
      setEdges(updated);
    },
    [edges, setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const updated = addEdge(connection, edges);
      setEdges(updated);
    },
    [edges, setEdges]
  );

  const saveFlow = async () => {
    // delete existing nodes/edges and upsert new ones
    await supabase.from("nodes").delete().eq("agent_id", agentId);
    await supabase.from("edges").delete().eq("agent_id", agentId);
    const nodeInserts = nodes.map((n: Node) => ({
      agent_id: agentId,
      type: n.type,
      data: n.data,
      position: n.position,
      id: n.id,
    }));
    const edgeInserts = edges.map((e: Edge) => ({
      agent_id: agentId,
      source: e.source,
      target: e.target,
      data: e.data,
      id: e.id,
    }));
    await supabase.from("nodes").insert(nodeInserts);
    await supabase.from("edges").insert(edgeInserts);
    setIsDeployOpen(true);
  };

  const loadTemplate = (type: 'support' | 'leadgen') => {
    if (type === 'support') {
      const tNodes = [
        { id: 'start', type: 'start', position: { x: 100, y: 100 }, data: { label: 'User Joins' } },
        { id: 'welcome', type: 'message', position: { x: 350, y: 100 }, data: { label: 'Welcome Message', text: 'Hi! How can I help you today?' } },
        { id: 'check_knowledge', type: 'knowledge', position: { x: 600, y: 100 }, data: { label: 'Search Docs' } },
        { id: 'ai_reply', type: 'ai', position: { x: 850, y: 100 }, data: { label: 'AI Answer', prompt: 'Answer based on context.' } },
        { id: 'end', type: 'end', position: { x: 1100, y: 100 }, data: { label: 'Done' } },
      ];
      const tEdges = [
        { id: 'e1', source: 'start', target: 'welcome' },
        { id: 'e2', source: 'welcome', target: 'check_knowledge' },
        { id: 'e3', source: 'check_knowledge', target: 'ai_reply' },
        { id: 'e4', source: 'ai_reply', target: 'end' },
      ];
      setNodes(tNodes);
      setEdges(tEdges);
    } else {
      const tNodes = [
        { id: 'start', type: 'start', position: { x: 100, y: 100 }, data: { label: 'New Lead' } },
        { id: 'ask_name', type: 'message', position: { x: 350, y: 100 }, data: { label: 'Ask Name', text: "What's your name?" } },
        { id: 'get_input', type: 'input', position: { x: 600, y: 100 }, data: { label: 'Capture Name', variable: 'lead_name' } },
        { id: 'api_save', type: 'api', position: { x: 850, y: 100 }, data: { label: 'Save to CRM', url: 'https://hooks.zapier.com/...' } },
        { id: 'end', type: 'end', position: { x: 1100, y: 100 }, data: { label: 'Success' } },
      ];
      const tEdges = [
        { id: 'e1', source: 'start', target: 'ask_name' },
        { id: 'e2', source: 'ask_name', target: 'get_input' },
        { id: 'e3', source: 'get_input', target: 'api_save' },
        { id: 'e4', source: 'api_save', target: 'end' },
      ];
      setNodes(tNodes);
      setEdges(tEdges);
    }
  };

  return (
    <div className="flex-1 relative group h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0B0B0F]"
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background 
          color="#1A1A24" 
          gap={20} 
          size={1} 
          className="opacity-50"
        />
        <Controls className="bg-white/5 border-white/10 rounded-xl overflow-hidden premium-blur" />
        <MiniMap 
          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden premium-blur"
          maskColor="rgba(0,0,0,0.5)"
          nodeColor="#6366F1"
        />
      </ReactFlow>
      
      {/* Premium Actions & Templates */}
      <div className="absolute top-6 left-6 z-10 flex gap-4">
        <div className="flex bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-1 shrink-0">
          <button 
            onClick={() => loadTemplate('support')}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-accent-purple transition-colors"
          >
            Support Template
          </button>
          <div className="w-px h-4 bg-white/5 self-center" />
          <button 
            onClick={() => loadTemplate('leadgen')}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-accent-cyan transition-colors"
          >
            Lead Gen Template
          </button>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-4">
        <button
          onClick={saveFlow}
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white font-bold text-sm tracking-widest uppercase hover:shadow-glow-purple transition-all active:scale-95 flex items-center gap-2"
        >
          <span>💾</span>
          <span>Deploy Changes</span>
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-accent-purple/5 via-transparent to-transparent opacity-30" />

      <DeployModal 
        isOpen={isDeployOpen} 
        onClose={() => setIsDeployOpen(false)} 
        agentId={agentId}
        agentName={agentName}
      />
    </div>
  );
};

export default FlowCanvas;
