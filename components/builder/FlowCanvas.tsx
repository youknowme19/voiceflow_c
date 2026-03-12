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
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <button
        onClick={saveFlow}
        className="absolute top-4 right-4 z-10 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default FlowCanvas;
