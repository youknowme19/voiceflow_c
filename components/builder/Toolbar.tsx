"use client";

import React from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";
import { supabase } from "../..//lib/supabaseClient";

export default function Toolbar() {
  const nodes = useBuilderStore((s: BuilderState) => s.nodes);
  const edges = useBuilderStore((s: BuilderState) => s.edges);
  const setNodes = useBuilderStore((s: BuilderState) => s.setNodes);
  const setEdges = useBuilderStore((s: BuilderState) => s.setEdges);

  const saveFlow = async () => {
    const agentId = window.location.pathname.split("/")[3];
    if (!agentId) return;
    await supabase.from("nodes").delete().eq("agent_id", agentId);
    await supabase.from("edges").delete().eq("agent_id", agentId);
    const nodeInserts = nodes.map((n: any) => ({
      agent_id: agentId,
      type: n.type,
      data: n.data,
      position: n.position,
      id: n.id,
    }));
    const edgeInserts = edges.map((e: any) => ({
      agent_id: agentId,
      source: e.source,
      target: e.target,
      data: e.data,
      id: e.id,
    }));
    await supabase.from("nodes").insert(nodeInserts);
    await supabase.from("edges").insert(edgeInserts);
    // also create a version snapshot
    const { data: existing } = await supabase
      .from("agent_versions")
      .select("version")
      .eq("agent_id", agentId)
      .order("version", { ascending: false })
      .limit(1);
    const nextVersion = (existing && existing[0]?.version + 1) || 1;
    await supabase.from("agent_versions").insert({
      agent_id: agentId,
      version: nextVersion,
      flow: { nodes, edges },
    });
    alert("Saved");
  };

  const loadFlow = async () => {
    const agentId = window.location.pathname.split("/")[3];
    if (!agentId) return;
    const { data: nodeData } = await supabase
      .from("nodes")
      .select("*")
      .eq("agent_id", agentId);
    const { data: edgeData } = await supabase
      .from("edges")
      .select("*")
      .eq("agent_id", agentId);
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
  };

  const clear = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
      <button
        onClick={saveFlow}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <button
        onClick={loadFlow}
        className="bg-gray-600 text-white px-4 py-2 rounded"
      >
        Load
      </button>
      <button
        onClick={clear}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Clear
      </button>
    </div>
  );
}
