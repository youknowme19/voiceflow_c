-- initial schema for VoiceBuild

/* Auth users table handled by Supabase auth */

-- teams
CREATE TABLE teams (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- team_members
CREATE TABLE team_members (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner','editor','viewer')),
    created_at timestamptz DEFAULT now()
);

-- agents
CREATE TABLE agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    settings jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- agent_versions
CREATE TABLE agent_versions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    version integer NOT NULL,
    flow jsonb,
    created_at timestamptz DEFAULT now()
);

-- agent_flows (could be separate nodes/edges but store as json)
CREATE TABLE agent_flows (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    data jsonb,
    created_at timestamptz DEFAULT now()
);

-- conversations
CREATE TABLE conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    status text,
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz
);

-- messages
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    sender text,
    content text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- agent_logs
CREATE TABLE agent_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    level text,
    message text,
    data jsonb,
    created_at timestamptz DEFAULT now()
);

-- knowledge_documents
CREATE TABLE knowledge_documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    name text,
    type text,
    url text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- embeddings
CREATE TABLE embeddings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id uuid REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    vector float8[],
    text text,
    created_at timestamptz DEFAULT now()
);

-- integrations
CREATE TABLE integrations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    name text,
    type text,
    config jsonb,
    created_at timestamptz DEFAULT now()
);

-- api_calls
CREATE TABLE api_calls (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    integration_id uuid REFERENCES integrations(id) ON DELETE SET NULL,
    request jsonb,
    response jsonb,
    status text,
    created_at timestamptz DEFAULT now()
);

-- billing_plans
CREATE TABLE billing_plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text,
    price numeric,
    credits integer,
    max_agents integer,
    created_at timestamptz DEFAULT now()
);

-- subscriptions
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    plan_id uuid REFERENCES billing_plans(id) ON DELETE SET NULL,
    status text,
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now()
);

-- usage_credits
CREATE TABLE usage_credits (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    used integer DEFAULT 0,
    month date,
    created_at timestamptz DEFAULT now()
);
