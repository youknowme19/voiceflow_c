"use client";

import React, { useState, useEffect } from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";
import { Node } from "reactflow";

export default function NodeEditor() {
  const selectedNode = useBuilderStore((s: BuilderState) => s.selectedNode);
  const nodes = useBuilderStore((s: BuilderState) => s.nodes);
  const setNodes = useBuilderStore((s: BuilderState) => s.setNodes);

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || "");
    }
  }, [selectedNode]);

  const save = () => {
    if (!selectedNode) return;
    const updated: Node = {
      ...selectedNode,
      data: { ...selectedNode.data, label },
    };
    setNodes(
      nodes.map((n: Node) => (n.id === updated.id ? updated : n))
    );
  };

  if (!selectedNode) return null;

  return (
    <aside className="absolute right-0 top-0 h-full w-64 bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="font-bold mb-2">Edit Node</h3>
      <label className="block mb-2">
        Label
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>
      <button
        onClick={save}
        className="mt-2 w-full bg-indigo-600 text-white py-2 rounded"
      >
        Save
      </button>
    </aside>
  );
}
