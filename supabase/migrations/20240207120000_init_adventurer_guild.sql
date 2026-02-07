-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Adventurers Table (Users)
CREATE TABLE IF NOT EXISTS adventurers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- In a real Supabase Auth scenario, we might link this to auth.users, 
    -- but following the spec we keep it standalone or as a profile.
    -- We will store a hash here if using custom auth, or ignore if using Supabase Auth.
    password_hash VARCHAR(255) NOT NULL, 
    environment JSONB DEFAULT '{}',
    languages JSONB DEFAULT '[]',
    interests JSONB DEFAULT '[]',
    skill_level VARCHAR(20) DEFAULT 'novice' CHECK (skill_level IN ('novice', 'intermediate', 'advanced', 'expert')),
    experience_points INTEGER DEFAULT 0,
    contribution_points INTEGER DEFAULT 0,
    skill_tree JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adventurers_username ON adventurers(username);
CREATE INDEX IF NOT EXISTS idx_adventurers_email ON adventurers(email);

-- 2. Quests Table (Tasks)
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    rank VARCHAR(10) NOT NULL CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    element VARCHAR(50) NOT NULL,
    experience_reward INTEGER DEFAULT 0,
    contribution_reward INTEGER DEFAULT 0,
    repo_url VARCHAR(500),
    requirements JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quests_rank ON quests(rank);
CREATE INDEX IF NOT EXISTS idx_quests_element ON quests(element);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);

-- 3. Quest History Table
CREATE TABLE IF NOT EXISTS quest_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventurer_id UUID REFERENCES adventurers(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    protocol_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quest_history_adventurer_id ON quest_history(adventurer_id);
CREATE INDEX IF NOT EXISTS idx_quest_history_quest_id ON quest_history(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_history_status ON quest_history(status);

-- 4. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    badge_icon VARCHAR(200),
    unlock_condition VARCHAR(200),
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Assessments Table (Questions for Quests)
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]', -- Array of strings
    correct_answer VARCHAR(255) NOT NULL,
    "order" INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_assessments_quest_id ON assessments(quest_id);

-- Initial Data for Achievements
INSERT INTO achievements (name, description, badge_icon, unlock_condition, reward_points) VALUES
('first_quest', '完成第一个任务', '🌟', 'complete_first_quest', 100),
('python_novice', 'Python初学者', '🐍', 'complete_python_quests_5', 200),
('python_intermediate', 'Python中阶', '🐍⚡', 'complete_python_quests_20', 500),
('javascript_master', 'JavaScript大师', '⚔️', 'complete_javascript_quests_30', 800),
('documentation_hero', '文档英雄', '📜', 'complete_doc_quests_15', 400)
ON CONFLICT DO NOTHING;

-- Permissions (RLS)
-- Enable RLS
ALTER TABLE adventurers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Grant access to anon and authenticated roles
GRANT SELECT ON quests TO anon, authenticated;
GRANT SELECT ON achievements TO anon, authenticated;
GRANT SELECT ON assessments TO anon, authenticated;

-- Allow insert/update for authenticated users (simplified for MVP)
GRANT ALL PRIVILEGES ON adventurers TO authenticated, anon; -- Open for registration
GRANT ALL PRIVILEGES ON quest_history TO authenticated, anon;
GRANT ALL PRIVILEGES ON quests TO authenticated, anon; -- For admin/crawler
GRANT ALL PRIVILEGES ON assessments TO authenticated, anon;

-- Policies (Simplified for MVP - allow all for now to avoid permission blocks during dev)
CREATE POLICY "Public quests are viewable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Public achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public adventurers are viewable by everyone" ON adventurers FOR SELECT USING (true);
