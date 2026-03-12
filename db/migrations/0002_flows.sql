-- add tables for visual builder nodes and edges

CREATE TABLE nodes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    type text NOT NULL,
    data jsonb,
    position jsonb,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE edges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
    source text NOT NULL,
    target text NOT NULL,
    data jsonb,
    created_at timestamptz DEFAULT now()
);
