"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GlassCard } from "../premium/PremiumUI";

const CustomNode = ({ data, selected, type }: NodeProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀';
      case 'message': return '💬';
      case 'ai': return '🧠';
      case 'condition': return '💎';
      case 'api': return '🔗';
      case 'knowledge': return '📚';
      case 'end': return '🏁';
      case 'input': return '⌨️';
      default: return '📄';
    }
  };

  const getHeaderColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'message': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ai': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'condition': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'api': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'knowledge': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'end': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'input': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className={`transition-all duration-300 ${selected ? 'scale-105 shadow-glow-purple pt-1' : ''}`}>
      <GlassCard 
        variant="strong" 
        className={`w-48 overflow-hidden border ${selected ? 'border-accent-purple' : 'border-white/10'}`}
      >
        <div className={`px-3 py-2 border-b flex items-center justify-between ${getHeaderColor(type)}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{getIcon(type)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{type}</span>
          </div>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-white mb-1 truncate">{data.label}</p>
          <p className="text-[9px] text-white/30 font-medium uppercase tracking-tighter">
            {data.description || 'Configured Node'}
          </p>
        </div>
      </GlassCard>
      
      {type !== 'start' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-white border-2 border-accent-purple !left-[-6px]"
        />
      )}
      
      {type !== 'end' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-white border-2 border-accent-purple !right-[-6px]"
        />
      )}
    </div>
  );
};

export default memo(CustomNode);
