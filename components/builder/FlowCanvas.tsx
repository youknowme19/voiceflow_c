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

interface FlowCanvasProps {
  agentId: string;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ agentId }) => {
  const nodes = useBuilderStore((s: BuilderState) => s.nodes);
  const edges = useBuilderStore((s: BuilderState) => s.edges);
  const setNodes = useBuilderStore((s: BuilderState) => s.setNodes);
  const setEdges = useBuilderStore((s: BuilderState) => s.setEdges);
  const setSelectedNode = useBuilderStore((s: BuilderState) => s.setSelectedNode);

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
    if (agentId) loadFlow();
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
    alert("Flow saved");
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
          nodeColor="#6C63FF"
        />
      </ReactFlow>
      
      {/* Premium Actions */}
      <div className="absolute top-6 right-6 z-10 flex gap-4">
        <button
          onClick={saveFlow}
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white font-bold text-sm tracking-widest uppercase hover:shadow-glow-purple transition-all active:scale-95 flex items-center gap-2"
        >
          <span>💾</span>
          <span>Deploy Changes</span>
        </button>
      </div>

      {/* Grid Overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-accent-purple/5 via-transparent to-transparent opacity-30" />
    </div>
  );
};

export default FlowCanvas;
