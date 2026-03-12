"use client";

import React from "react";
import { useBuilderStore, BuilderState } from "../../lib/builderStore";

const nodeTypes = [
  "start",
  "message",
  "ai",
  "condition",
  "api",
  "knowledge",
  "end",
];

export default function NodePanel() {
  const addNode = useBuilderStore((s: BuilderState) => s.addNode);

  const handleAdd = (type: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      position: { x: 250, y: 25 },
    };
    addNode(newNode as any);
  };

  return (
    <aside className="w-48 bg-gray-200 p-4 dark:bg-gray-800">
      <h3 className="font-bold mb-2">Nodes</h3>
      <ul className="space-y-2">
        {nodeTypes.map((type) => (
          <li key={type}>
            <button
              className="w-full px-3 py-2 bg-white rounded shadow text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => handleAdd(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
