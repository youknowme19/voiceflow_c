"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FlowCanvas from "../../../../components/builder/FlowCanvas";
import NodePanel from "../../../../components/builder/NodePanel";
import NodeEditor from "../../../../components/builder/NodeEditor";
import Toolbar from "../../../../components/builder/Toolbar";

export default function BuilderPage() {
  const params = useParams();
  let agentId: string | undefined = undefined;
  if (params?.agentId) {
    agentId = Array.isArray(params.agentId) ? params.agentId[0] : params.agentId;
  }

  return (
    <div className="flex h-screen relative">
      <NodePanel />
      {agentId ? <FlowCanvas agentId={agentId} /> : <p>Invalid agent</p>}
      <NodeEditor />
      <Toolbar />
    </div>
  );
}
