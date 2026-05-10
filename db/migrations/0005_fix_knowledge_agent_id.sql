-- 0005_fix_knowledge_agent_id.sql
-- Add missing agent_id column to knowledge_documents table
-- The RLS policies and match_knowledge_documents function both reference
-- kd.agent_id, but the original CREATE TABLE in 0001 never added it.
-- The dashboard UI also inserts agent_id when uploading.

ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES agents(id) ON DELETE CASCADE;

-- Recreate the match function to use the correct column name (e.vector, not e.embedding)
-- and accept the parameter name that matches the code's RPC call.
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
    AND kd.agent_id = $4
  ORDER BY e.vector <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
