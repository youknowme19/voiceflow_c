import { create } from "zustand";
import { Node, Edge } from "reactflow";

export interface BuilderState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge) =>
    set((state) => ({ edges: [...state.edges, edge] })),
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}));
