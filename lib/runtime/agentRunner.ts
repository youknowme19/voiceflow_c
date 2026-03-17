import { createClient } from "@supabase/supabase-js";
import { routeAIRequest, ChatMessage } from "@/lib/ai_router";
import { retrieveContext, buildAugmentedPrompt } from "@/lib/rag_engine";
import { logExecutionAnalytics } from "@/lib/analytics_engine";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, any>;
  position?: { x: number; y: number };
}

interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
  data?: Record<string, any>;
  label?: string;
}

interface WorkflowState {
  user_message: string;
  ai_response: string;
  api_data: Record<string, any>;
  knowledge_context: string;
  variables: Record<string, any>;
}

interface ExecutionContext {
  agentId: string;
  conversationId: string;
  userMessage: string;
  state: WorkflowState;
  nodeStates: Map<string, any>;
  logs: Array<{ nodeId: string; nodeType: string; status: "ok" | "error"; message: string; ms: number }>;
  supabase: any;
  conversationHistory: ChatMessage[];
}

interface NodeResult {
  output: string;
  conditionResult?: boolean;
  error?: string;
}

// ─── AgentRunner class ───────────────────────────────────────────────────────

export class AgentRunner {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  // ── Workflow Loading ──────────────────────────────────────────────────────

  /**
   * Load workflow nodes + edges. If a conversation is pinned to a version,
   * load from that version's snapshot instead of the live nodes/edges.
   */
  async loadWorkflow(agentId: string, conversationId?: string) {
    // Check if conversation is pinned to a specific workflow version
    if (conversationId) {
      const { data: conv } = await this.supabase
        .from("conversations")
        .select("workflow_version")
        .eq("id", conversationId)
        .single();

      if (conv?.workflow_version != null) {
        const { data: version } = await this.supabase
          .from("agent_versions")
          .select("flow")
          .eq("agent_id", agentId)
          .eq("version", conv.workflow_version)
          .single();

        if (version?.flow) {
          return {
            nodes: (version.flow.nodes || []) as WorkflowNode[],
            edges: (version.flow.edges || []) as WorkflowEdge[],
          };
        }
      }
    }

    // Load live nodes and edges
    const { data: nodes, error: nodesError } = await this.supabase
      .from("nodes")
      .select("*")
      .eq("agent_id", agentId);

    const { data: edges, error: edgesError } = await this.supabase
      .from("edges")
      .select("*")
      .eq("agent_id", agentId);

    if (nodesError || edgesError) {
      throw new Error(`Failed to load workflow: ${nodesError?.message || edgesError?.message}`);
    }

    return {
      nodes: (nodes || []) as WorkflowNode[],
      edges: (edges || []) as WorkflowEdge[],
    };
  }

  // ── Memory / Variables ────────────────────────────────────────────────────

  async loadVariables(conversationId: string): Promise<Record<string, any>> {
    const { data } = await this.supabase
      .from("conversation_memory")
      .select("variables_json")
      .eq("conversation_id", conversationId)
      .single();
    return data?.variables_json || {};
  }

  async saveVariables(conversationId: string, agentId: string, variables: Record<string, any>) {
    await this.supabase
      .from("conversation_memory")
      .upsert(
        { conversation_id: conversationId, agent_id: agentId, variables_json: variables, updated_at: new Date().toISOString() },
        { onConflict: "conversation_id" }
      );
  }

  // ── Conversation History ──────────────────────────────────────────────────

  async loadConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const { data } = await this.supabase
      .from("messages")
      .select("sender, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20); // Last 20 messages for context window

    if (!data) return [];
    return data.map((m: any) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.content,
    }));
  }

  // ── Node Finders ──────────────────────────────────────────────────────────

  findStartNode(nodes: WorkflowNode[]): WorkflowNode | null {
    return nodes.find((n) => n.type === "start" || n.type === "startNode") || null;
  }

  findNextNode(
    currentNodeId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    conditionResult?: boolean
  ): WorkflowNode | null {
    const outgoing = edges.filter((e) => e.source === currentNodeId);
    if (outgoing.length === 0) return null;

    // Condition branching
    if (conditionResult !== undefined && outgoing.length > 1) {
      const trueEdge = outgoing.find(
        (e) => e.data?.label === "true" || e.data?.condition === "true" || e.label === "true"
      );
      const falseEdge = outgoing.find(
        (e) => e.data?.label === "false" || e.data?.condition === "false" || e.label === "false"
      );
      const target = conditionResult ? trueEdge?.target : falseEdge?.target;
      if (target) return nodes.find((n) => n.id === target) || null;
    }

    return nodes.find((n) => n.id === outgoing[0].target) || null;
  }

  // ── Node Executors ────────────────────────────────────────────────────────

  async executeMessageNode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    let message = node.data?.message || node.data?.text || node.data?.label || "";
    // Interpolate variables: {{variable_name}}
    message = this.interpolate(message, context.state.variables);
    context.state.ai_response = message;
    return { output: message };
  }

  async executeAINode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    const { data: agent } = await this.supabase
      .from("agents")
      .select("model_provider, model_name")
      .eq("id", context.agentId)
      .single();

    const provider = agent?.model_provider || "openrouter";
    const model = agent?.model_name || "google/gemini-2.0-flash-exp:free";
    const systemPrompt = node.data?.systemPrompt || node.data?.prompt || "You are a helpful AI assistant.";

    // Build user content — augment with knowledge if retrieved
    let userContent = context.userMessage;
    if (context.state.knowledge_context) {
      userContent = buildAugmentedPrompt(context.userMessage, context.state.knowledge_context);
    }

    // Add any variables context
    const varKeys = Object.keys(context.state.variables);
    if (varKeys.length > 0) {
      const varContext = varKeys.map(k => `${k}: ${context.state.variables[k]}`).join(", ");
      userContent += `\n\n[Context: ${varContext}]`;
    }

    const { aiResponse, tokensUsed, latencyMs } = await routeAIRequest(
      [{ role: "user", content: userContent }],
      {
        provider,
        model,
        systemPrompt,
        conversationHistory: context.conversationHistory,
      }
    );

    context.nodeStates.set("last_tokens_used", (context.nodeStates.get("last_tokens_used") || 0) + tokensUsed);
    context.nodeStates.set("last_latency_ms", latencyMs);
    context.state.ai_response = aiResponse;

    // Write AI response to variables if node specifies an output variable
    if (node.data?.outputVariable) {
      context.state.variables[node.data.outputVariable] = aiResponse;
    }

    return { output: aiResponse };
  }

  async executeKnowledgeNode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    const context_text = await retrieveContext(context.userMessage, context.agentId, 4, this.supabase);
    if (!context_text) {
      return { output: "No relevant knowledge found." };
    }
    context.state.knowledge_context = context_text;
    return { output: "Knowledge retrieved." };
  }

  async executeAPINode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    const integrationId = node.data?.integration_id || node.data?.integrationId;
    const method = (node.data?.method || "GET").toUpperCase();
    const bodyTemplate = node.data?.body_template || node.data?.bodyTemplate || "{}";
    const urlTemplate = node.data?.url || "";

    let endpoint = "";
    let integration: any = null;

    // Load from integrations table if ID provided
    if (integrationId) {
      const { data } = await this.supabase
        .from("integrations")
        .select("*")
        .eq("id", integrationId)
        .single();
      integration = data;
      endpoint = integration?.endpoint || "";
    } else if (urlTemplate) {
      endpoint = this.interpolate(urlTemplate, context.state.variables);
    }

    if (!endpoint) {
      return { output: "", error: "No API endpoint configured" };
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (integration?.auth_token) {
      headers["Authorization"] = `Bearer ${integration.auth_token}`;
    }
    if (integration?.headers && typeof integration.headers === "object") {
      Object.assign(headers, integration.headers);
    }

    const bodyObj = method !== "GET" ? this.interpolateObject(bodyTemplate, context) : undefined;

    const apiResponse = await fetch(endpoint, {
      method,
      headers,
      body: bodyObj ? JSON.stringify(bodyObj) : undefined,
    });

    const responseData = await apiResponse.json().catch(() => ({ raw: null }));

    // Store API response in state
    context.state.api_data[node.id] = responseData;

    // Write to variable if specified
    if (node.data?.outputVariable) {
      context.state.variables[node.data.outputVariable] = responseData;
    }

    // Log the API call
    await this.supabase.from("api_calls").insert({
      agent_id: context.agentId,
      integration_id: integrationId || null,
      request: { method, url: endpoint },
      response: responseData,
      status: String(apiResponse.status),
    });

    return { output: JSON.stringify(responseData) };
  }

  async executeConditionNode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    const logic = node.data?.logic || node.data?.condition || "";
    const conditionResult = this.evaluateCondition(logic, context);
    context.nodeStates.set(`condition_${node.id}`, conditionResult);
    return { output: "", conditionResult };
  }

  async executeInputNode(node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    // Extract entity from user message into a variable
    const varName = node.data?.variableName || node.data?.variable || "user_input";
    context.state.variables[varName] = context.userMessage;
    return { output: "" };
  }

  async executeEndNode(_node: WorkflowNode, context: ExecutionContext): Promise<NodeResult> {
    return { output: context.state.ai_response || "" };
  }

  // ── Condition Evaluator ───────────────────────────────────────────────────

  private evaluateCondition(logic: string, context: ExecutionContext): boolean {
    if (!logic) return true;
    const msg = context.userMessage.toLowerCase();
    const variables = context.state.variables;

    // contains("keyword")
    const containsMatch = logic.match(/contains\s*\(\s*["']([^"']+)["']\s*\)/i);
    if (containsMatch) return msg.includes(containsMatch[1].toLowerCase());

    // variable[key] === value or variable[key] exists
    const varExistsMatch = logic.match(/variable\[["']([^"']+)["']\]\s*exists/i);
    if (varExistsMatch) return variables[varExistsMatch[1]] !== undefined;

    const varEqualsMatch = logic.match(/variable\[["']([^"']+)["']\]\s*===?\s*["']([^"']+)["']/i);
    if (varEqualsMatch) return String(variables[varEqualsMatch[1]]) === varEqualsMatch[2];

    // regex(/pattern/)
    const regexMatch = logic.match(/regex\s*\(\s*\/([^/]+)\/([gimsuy]*)\s*\)/i);
    if (regexMatch) {
      try {
        return new RegExp(regexMatch[1], regexMatch[2]).test(msg);
      } catch {
        return false;
      }
    }

    // intent: keyword list "order,track,status"
    const intentMatch = logic.match(/intent:\s*["']([^"']+)["']/i);
    if (intentMatch) {
      const keywords = intentMatch[1].split(",").map((k) => k.trim().toLowerCase());
      return keywords.some((k) => msg.includes(k));
    }

    return true; // Default to true if logic not recognized
  }

  // ── Template Interpolation ────────────────────────────────────────────────

  private interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
      variables[key] !== undefined ? String(variables[key]) : `{{${key}}}`
    );
  }

  private interpolateObject(template: string, context: ExecutionContext): any {
    try {
      let json = this.interpolate(template, context.state.variables);
      json = json.replace(/\{userMessage\}/g, context.userMessage);
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  // ── Per-node execution dispatcher ─────────────────────────────────────────

  async executeNode(
    node: WorkflowNode,
    context: ExecutionContext,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[]
  ): Promise<{ output: string; conditionResult?: boolean }> {
    const t = Date.now();
    let output = "";
    let conditionResult: boolean | undefined;
    let status: "ok" | "error" = "ok";
    let errorMsg = "";

    try {
      let result: NodeResult;
      switch (node.type) {
        case "message":
        case "messageNode":
        case "textNode":
        case "text":
          result = await this.executeMessageNode(node, context); break;
        case "ai":
        case "aiNode":
        case "llmNode":
          result = await this.executeAINode(node, context); break;
        case "knowledge":
        case "knowledgeNode":
          result = await this.executeKnowledgeNode(node, context); break;
        case "api":
        case "apiNode":
          result = await this.executeAPINode(node, context); break;
        case "condition":
        case "conditionNode":
          result = await this.executeConditionNode(node, context); break;
        case "input":
        case "inputNode":
          result = await this.executeInputNode(node, context); break;
        case "end":
        case "endNode":
          result = await this.executeEndNode(node, context); break;
        case "start":
        case "startNode":
          result = { output: "" }; break;
        default:
          result = { output: "", error: `Unknown node type: ${node.type}` };
      }
      output = result.output;
      conditionResult = result.conditionResult;
      if (result.error) { status = "error"; errorMsg = result.error; }
    } catch (err: any) {
      status = "error";
      errorMsg = err.message;
      output = "";
    }

    // Log per-node execution
    context.logs.push({
      nodeId: node.id,
      nodeType: node.type,
      status,
      message: errorMsg || output.slice(0, 200),
      ms: Date.now() - t,
    });

    return { output, conditionResult };
  }

  // ── Main Run ─────────────────────────────────────────────────────────────

  async run(
    agentId: string,
    userMessage: string,
    conversationId: string
  ): Promise<{ output: string; logs: any[] }> {
    console.log("[AgentRunner] Starting run:", { agentId, conversationId });

    // Load conversation history and variables
    const [conversationHistory, variables] = await Promise.all([
      this.loadConversationHistory(conversationId),
      this.loadVariables(conversationId),
    ]);

    const context: ExecutionContext = {
      agentId,
      conversationId,
      userMessage,
      state: {
        user_message: userMessage,
        ai_response: "",
        api_data: {},
        knowledge_context: "",
        variables,
      },
      nodeStates: new Map(),
      logs: [],
      supabase: this.supabase,
      conversationHistory,
    };

    const { nodes, edges } = await this.loadWorkflow(agentId, conversationId);

    if (nodes.length === 0) {
      return { output: "No workflow defined. Please build a workflow first.", logs: [] };
    }

    let currentNode = this.findStartNode(nodes);
    console.log("[AgentRunner] Start node found:", !!currentNode);
    if (!currentNode) {
      console.warn("[AgentRunner] No start node for agent:", agentId);
      return { output: "Workflow has no start node.", logs: [] };
    }

    let finalOutput = "";
    const MAX_NODES = 50;
    let iterations = 0;

    // 5-second timeout
    const deadline = Date.now() + 5000;

    while (currentNode && iterations < MAX_NODES) {
      if (Date.now() > deadline) {
        context.logs.push({ nodeId: "timeout", nodeType: "system", status: "error", message: "Execution timeout (5s)", ms: 0 });
        break;
      }

      iterations++;

      // TURN DETECTION: Skip introductory 'text' nodes if this is a follow-up message 
      // i.e. conversation history already exists. 
      if (
        context.conversationHistory.length > 0 && 
        iterations === 2 && 
        ["text", "message", "messageNode", "textNode"].includes(currentNode.type)
      ) {
        console.log("[AgentRunner] Skipping greeting node on follow-up turn:", currentNode.id);
        const nextNode = this.findNextNode(currentNode.id, nodes, edges, undefined);
        if (nextNode) {
          currentNode = nextNode;
          continue; 
        }
      }

      const { output, conditionResult } = await this.executeNode(currentNode, context, nodes, edges);

      // SIGNIFICANT FIX: Only update finalOutput for nodes that are MEANT to speak.
      // And if an AI node executes, it should usually be the final word if it's the last vocal node.
      if (output && ["ai", "aiNode", "llmNode", "message", "messageNode", "textNode", "text"].includes(currentNode.type)) {
        finalOutput = output;
      }

      if (currentNode.type === "end" || currentNode.type === "endNode") break;

      const nextNode = this.findNextNode(currentNode.id, nodes, edges, conditionResult);
      
      // If no next node and we haven't reached an 'end' node, 
      // the last vocal output remains as finalOutput.
      if (!nextNode) break;

      currentNode = nextNode;
    }

    // Save updated variables back to memory
    if (Object.keys(context.state.variables).length > 0) {
      await this.saveVariables(conversationId, agentId, context.state.variables);
    }

    const totalTokens = context.nodeStates.get("last_tokens_used") || 0;
    const totalLatency = context.nodeStates.get("last_latency_ms") || 0;

    // Persist analytics
    await logExecutionAnalytics({
      agentId,
      conversationId,
      userMessage,
      aiResponse: finalOutput,
      latencyMs: totalLatency || 200,
      tokensUsed: totalTokens,
      success: true,
    });

    // Persist execution logs to DB
    if (context.logs.length > 0) {
      await this.supabase.from("agent_logs").insert(
        context.logs.map((log) => ({
          agent_id: agentId,
          level: log.status === "error" ? "error" : "info",
          message: `[${log.nodeType}:${log.nodeId}] ${log.message}`,
          data: { conversationId, nodeId: log.nodeId, ms: log.ms },
        }))
      );
    }

    return {
      output: finalOutput || "I'm sorry, I couldn't generate a response based on the current workflow. Please check your agent configuration.",
      logs: context.logs,
    };
  }
}

// ── Exported convenience function ─────────────────────────────────────────────

export async function runAgent(
  agentId: string,
  userMessage: string,
  conversationId: string,
  supabaseClient: any
) {
  const runner = new AgentRunner(supabaseClient);
  return runner.run(agentId, userMessage, conversationId);
}
