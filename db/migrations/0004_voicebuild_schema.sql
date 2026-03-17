-- 0004_voicebuild_schema.sql
-- Add VoiceBuild specific tables and extensions

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- projects (mapped to existing teams concept, but specific table as requested)
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- update agents to include project_id (while keeping team_id for frontend compatibility)
-- also add model routing fields
ALTER TABLE agents ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS model_provider text DEFAULT 'openrouter';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS model_name text DEFAULT 'google/gemini-pro-1.5';

-- update conversations with requested fields
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_message text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_response text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS latency_ms integer;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS tokens_used integer;

-- analytics
CREATE TABLE IF NOT EXISTS analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    success_rate numeric DEFAULT 0,
    avg_latency integer DEFAULT 0,
    total_requests integer DEFAULT 0,
    token_cost numeric DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- api_logs
CREATE TABLE IF NOT EXISTS api_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    request_payload jsonb,
    response_payload jsonb,
    latency_ms integer,
    created_at timestamptz DEFAULT now()
);

-- users (public profile extension of auth.users)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    name text,
    subscription_plan text DEFAULT 'Starter',
    created_at timestamptz DEFAULT now()
);

-- adjust embeddings table to use vector format for pgvector if not already
ALTER TABLE embeddings ALTER COLUMN vector TYPE vector(1536) USING (vector::vector);

-- Enable RLS and create policies for new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- PROJECTS RLS
CREATE POLICY projects_user_access ON projects
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY projects_user_insert ON projects
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY projects_user_update ON projects
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY projects_user_delete ON projects
  FOR DELETE USING (user_id = auth.uid());

-- ANALYTICS RLS
CREATE POLICY analytics_agent_access ON analytics
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      ) OR project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

-- API LOGS RLS
CREATE POLICY api_logs_agent_access ON api_logs
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      ) OR project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

-- USERS RLS
CREATE POLICY users_own_access ON users
  FOR SELECT USING (id = auth.uid());
CREATE POLICY users_own_update ON users
  FOR UPDATE USING (id = auth.uid());

-- Create a helper function to match pgvector documents
CREATE OR REPLACE FUNCTION match_knowledge_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  agent_id uuid
) RETURNS TABLE(id uuid, text text, similarity float) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.text,
    1 - (e.vector <=> query_embedding) as similarity
  FROM embeddings e
  JOIN knowledge_documents kd ON e.document_id = kd.id
  WHERE 1 - (e.vector <=> query_embedding) > match_threshold
    AND kd.agent_id = agent_id
  ORDER BY e.vector <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
