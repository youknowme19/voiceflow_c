import { createClient } from "@supabase/supabase-js";
import { generateAIResponse, generateEmbedding } from "@/lib/openrouter";

interface Node {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface Edge {
  source: string;
  target: string;
  data?: Record<string, any>;
}

interface ExecutionContext {
  agentId: string;
  conversationId: string;
  userMessage: string;
  nodeStates: Map<string, any>;
  logs: string[];
  supabase: any;
}

interface NodeExecutionResult {
  output: string;
  nextNodeId?: string;
  error?: string;
}

export class AgentRunner {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  /**
   * Load all nodes and edges for an agent
   */
  async loadWorkflow(agentId: string) {
    const { data: nodes, error: nodesError } = await this.supabase
      .from("nodes")
      .select("*")
      .eq("agent_id", agentId);

    const { data: edges, error: edgesError } = await this.supabase
      .from("edges")
      .select("*")
      .eq("agent_id", agentId);

    if (nodesError || edgesError) {
      throw new Error("Failed to load workflow");
    }

    return { nodes: nodes || [], edges: edges || [] };
  }

  /**
   * Find the START node
   */
  findStartNode(nodes: Node[]): Node | null {
    return nodes.find((n) => n.type === "start") || null;
  }

  /**
   * Find the next node by following edges
   */
  findNextNode(
    currentNodeId: string,
    nodes: Node[],
    edges: Edge[],
    condition?: boolean
  ): Node | null {
    const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

    if (outgoingEdges.length === 0) {
      return null;
    }

    // If multiple edges (e.g., from condition), pick based on condition
    let targetId = outgoingEdges[0].target;

    if (condition !== undefined && outgoingEdges.length > 1) {
      const edgeForCondition = outgoingEdges.find(
        (e) => e.data?.label === (condition ? "true" : "false")
      );
      if (edgeForCondition) {
        targetId = edgeForCondition.target;
      }
    }

    return nodes.find((n) => n.id === targetId) || null;
  }

  /**
   * Execute a message node
   */
  async executeMessageNode(
    node: Node,
    _context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const message = node.data?.message || "";
    return {
      output: message,
    };
  }

  /**
   * Execute an AI node
   */
  async executeAINode(
    node: Node,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    try {
      // Get agent settings for model
      const { data: agent } = await this.supabase
        .from("agents")
        .select("model_id")
        .eq("id", context.agentId)
        .single();

      const model = agent?.model_id || "openai/gpt-4o-mini";

      // Build messages for OpenRouter
      const messages = [
        {
          role: "user",
          content: context.userMessage,
        },
      ];

      // Call AI
      const response = await generateAIResponse(messages, model);

      // Log execution
      context.logs.push(`AI Node executed with model: ${model}`);

      return {
        output: response,
      };
    } catch (error: any) {
      context.logs.push(`AI Node error: ${error.message}`);
      return {
        output: "I encountered an error processing your request.",
        error: error.message,
      };
    }
  }

  /**
   * Execute a condition node
   */
  async executeConditionNode(
    node: Node,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    try {
      const logic = node.data?.logic || "";
      // Simple evaluation - in production, use safer expression evaluator
      const condition = this.evaluateCondition(logic, context.userMessage);

      context.logs.push(`Condition evaluated: ${condition}`);

      return {
        output: "",
        nextNodeId: undefined, // Signal next node finder to use condition
      };
    } catch (error: any) {
      context.logs.push(`Condition error: ${error.message}`);
      return {
        output: "",
        error: error.message,
      };
    }
  }

  /**
   * Execute an API call node
   */
  async executeAPINode(
    node: Node,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    try {
      const integrationId = node.data?.integration_id;
      const method = node.data?.method || "GET";
      const bodyTemplate = node.data?.body_template || "{}";

      // Load integration
      const { data: integration } = await this.supabase
        .from("integrations")
        .select("*")
        .eq("id", integrationId)
        .single();

      if (!integration) {
        throw new Error("Integration not found");
      }

      // Build request
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (integration.auth_token) {
        headers["Authorization"] = `Bearer ${integration.auth_token}`;
      }

      if (integration.headers) {
        Object.assign(headers, JSON.parse(integration.headers));
      }

      const body =
        method !== "GET" ? this.interpolateTemplate(bodyTemplate, context) : undefined;

      const response = await fetch(integration.endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      // Log API call
      await this.supabase.from("api_calls").insert({
        agent_id: context.agentId,
        integration_id: integrationId,
        request: { method, url: integration.endpoint },
        response: data,
        status: response.status,
      });

      context.logs.push(`API call to ${integration.endpoint} completed`);

      return {
        output: JSON.stringify(data),
      };
    } catch (error: any) {
      context.logs.push(`API Node error: ${error.message}`);
      return {
        output: "",
        error: error.message,
      };
    }
  }

  /**
   * Execute a knowledge node
   */
  async executeKnowledgeNode(
    node: Node,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    try {
      // Generate embedding for user message
      const embedding = await generateEmbedding([context.userMessage]);

      if (!embedding || embedding.length === 0) {
        throw new Error("Failed to generate embedding");
      }

      // Query knowledge base for similar documents
      const { data: results } = await this.supabase.rpc(
        "match_documents",
        {
          query_embedding: embedding[0],
          match_threshold: 0.7,
          match_count: 3,
          agent_id: context.agentId,
        }
      );

      const knowledge = results
        ?.map((r: any) => r.content)
        .join("\n---\n") || "No relevant knowledge found";

      context.logs.push(
        `Knowledge search returned ${results?.length || 0} documents`
      );

      return {
        output: knowledge,
      };
    } catch (error: any) {
      context.logs.push(`Knowledge Node error: ${error.message}`);
      return {
        output: "",
        error: error.message,
      };
    }
  }

  /**
   * Execute an end node
   */
  async executeEndNode(
    node: Node,
    _context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    return {
      output: "",
      nextNodeId: undefined, // Signal end of execution
    };
  }

  /**
   * Execute a single node
   */
  async executeNode(
    node: Node,
    context: ExecutionContext,
    nodes: Node[],
    edges: Edge[]
  ): Promise<string> {
    context.logs.push(`Executing node: ${node.id} (type: ${node.type})`);

    let result: NodeExecutionResult;

    switch (node.type) {
      case "message":
        result = await this.executeMessageNode(node, context);
        break;
      case "ai":
        result = await this.executeAINode(node, context);
        break;
      case "condition":
        result = await this.executeConditionNode(node, context);
        break;
      case "api":
        result = await this.executeAPINode(node, context);
        break;
      case "knowledge":
        result = await this.executeKnowledgeNode(node, context);
        break;
      case "end":
        result = await this.executeEndNode(node, context);
        break;
      default:
        result = { output: "", error: `Unknown node type: ${node.type}` };
    }

    if (result.error) {
      context.logs.push(`Error in node ${node.id}: ${result.error}`);
    }

    return result.output;
  }

  /**
   * Run the complete workflow
   */
  async run(
    agentId: string,
    userMessage: string,
    conversationId: string
  ): Promise<{ output: string; logs: string[] }> {
    const context: ExecutionContext = {
      agentId,
      conversationId,
      userMessage,
      nodeStates: new Map(),
      logs: [],
      supabase: this.supabase,
    };

    try {
      // Load workflow
      const { nodes, edges } = await this.loadWorkflow(agentId);

      if (nodes.length === 0) {
        return {
          output: "No workflow defined for this agent.",
          logs: ["No nodes found"],
        };
      }

      let currentNode = this.findStartNode(nodes);

      if (!currentNode) {
        return {
          output: "No start node found in workflow.",
          logs: ["No start node found"],
        };
      }

      let output = "";
      const maxIterations = 50; // Prevent infinite loops
      let iterations = 0;

      while (
        currentNode &&
        currentNode.type !== "end" &&
        iterations < maxIterations
      ) {
        iterations++;

        // Execute current node
        output = await this.executeNode(
          currentNode,
          context,
          nodes,
          edges
        );

        if (currentNode.type === "end") {
          break;
        }

        // Find next node
        const nextNode = this.findNextNode(
          currentNode.id,
          nodes,
          edges
        );

        if (!nextNode) {
          context.logs.push("No next node found, stopping execution");
          break;
        }

        currentNode = nextNode;
      }

      if (iterations >= maxIterations) {
        context.logs.push("Max iterations reached, stopping execution");
      }

      return {
        output,
        logs: context.logs,
      };
    } catch (error: any) {
      return {
        output: "An error occurred during workflow execution.",
        logs: [...context.logs, `Fatal error: ${error.message}`],
      };
    }
  }

  /**
   * Simple condition evaluator
   */
  private evaluateCondition(logic: string, userMessage: string): boolean {
    // Very basic evaluation - in production use safer expression evaluator
    if (logic.includes("contains")) {
      const match = logic.match(/contains\(['"]([^'"]+)['"]\)/);
      if (match) {
        return userMessage.toLowerCase().includes(match[1].toLowerCase());
      }
    }
    return true;
  }

  /**
   * Interpolate template with context variables
   */
  private interpolateTemplate(template: string, context: ExecutionContext): any {
    try {
      let result = template;
      result = result.replace(/\{userMessage\}/g, context.userMessage);
      return JSON.parse(result);
    } catch {
      return {};
    }
  }
}

/**
 * Create and run agent
 */
export async function runAgent(
  agentId: string,
  userMessage: string,
  conversationId: string,
  supabaseClient: any
) {
  const runner = new AgentRunner(supabaseClient);
  return runner.run(agentId, userMessage, conversationId);
}
