-- PHASE 16: Row Level Security (RLS) Policies
-- Protect sensitive data with Supabase RLS

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_calls ENABLE ROW LEVEL SECURITY;

-- AGENTS: Users can only access agents from their team
CREATE POLICY agents_team_access ON agents
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY agents_team_insert ON agents
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY agents_team_update ON agents
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY agents_team_delete ON agents
  FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- CONVERSATIONS: Users can access conversations from their agents
CREATE POLICY conversations_agent_access ON conversations
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY conversations_agent_insert ON conversations
  FOR INSERT
  WITH CHECK (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- MESSAGES: Users can access messages from their conversations
CREATE POLICY messages_conversation_access ON messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE agent_id IN (
        SELECT id FROM agents WHERE team_id IN (
          SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY messages_conversation_insert ON messages
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE agent_id IN (
        SELECT id FROM agents WHERE team_id IN (
          SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
      )
    )
  );

-- KNOWLEDGE_DOCUMENTS: Users can access docs from their agents
CREATE POLICY knowledge_docs_agent_access ON knowledge_documents
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY knowledge_docs_agent_insert ON knowledge_documents
  FOR INSERT
  WITH CHECK (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY knowledge_docs_agent_delete ON knowledge_documents
  FOR DELETE
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- INTEGRATIONS: Users can access integrations from their team
CREATE POLICY integrations_team_access ON integrations
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY integrations_team_insert ON integrations
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY integrations_team_delete ON integrations
  FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- SUBSCRIPTIONS & CREDITS: Users can only access their own
CREATE POLICY subscriptions_own_access ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY credits_own_access ON usage_credits
  FOR SELECT
  USING (user_id = auth.uid());

-- TEAM_MEMBERS: Users can see members of their team
CREATE POLICY team_members_team_access ON team_members
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- LOGS: Users can access logs from their agents
CREATE POLICY logs_agent_access ON agent_logs
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- API_CALLS: Users can access calls from their integrations
CREATE POLICY api_calls_agent_access ON api_calls
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- NODES & EDGES: Users can access nodes/edges from their agents
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY nodes_agent_access ON nodes
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY nodes_agent_insert ON nodes
  FOR INSERT
  WITH CHECK (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY nodes_agent_update ON nodes
  FOR UPDATE
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY nodes_agent_delete ON nodes
  FOR DELETE
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY edges_agent_access ON edges
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY edges_agent_insert ON edges
  FOR INSERT
  WITH CHECK (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY edges_agent_update ON edges
  FOR UPDATE
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY edges_agent_delete ON edges
  FOR DELETE
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- Create vector search function for knowledge base
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  agent_id uuid
) RETURNS TABLE(id uuid, content text, similarity float) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.content,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    AND e.agent_id = agent_id
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
