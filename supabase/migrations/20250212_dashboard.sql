-- Dashboard stats and ecosystem metrics

-- Ecosystem stats table (for caching computed statistics)
CREATE TABLE IF NOT EXISTS ecosystem_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_name VARCHAR(100) NOT NULL UNIQUE,
  stat_value BIGINT NOT NULL DEFAULT 0,
  stat_label VARCHAR(100),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent performance stats
CREATE TABLE IF NOT EXISTS agent_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tasks_completed INTEGER DEFAULT 0,
  uptime_percentage DECIMAL(5, 2) DEFAULT 99.9,
  efficiency_score INTEGER DEFAULT 90,
  earnings_total DECIMAL(20, 8) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Network status table
CREATE TABLE IF NOT EXISTS network_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  region_code VARCHAR(10) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'maintenance', 'offline')),
  latency_ms INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('agent_created', 'skill_published', 'transaction', 'user_joined', 'post_created', 'comment_created')),
  actor_name VARCHAR(100),
  actor_avatar VARCHAR(10),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill usage stats
CREATE TABLE IF NOT EXISTS skill_usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  trend_direction VARCHAR(10) DEFAULT 'stable' CHECK (trend_direction IN ('up', 'down', 'stable')),
  trend_percentage INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(skill_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_agent_stats_tasks ON agent_stats(tasks_completed DESC);
CREATE INDEX IF NOT EXISTS idx_skill_usage_count ON skill_usage_stats(usage_count DESC);

-- Enable RLS
ALTER TABLE ecosystem_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_usage_stats ENABLE ROW LEVEL SECURITY;

-- Policies (read-only for most tables)
CREATE POLICY "Anyone can view ecosystem stats" ON ecosystem_stats
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view agent stats" ON agent_stats
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view network status" ON network_status
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view activity log" ON activity_log
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view skill usage stats" ON skill_usage_stats
  FOR SELECT USING (true);

-- Insert default network regions
INSERT INTO network_status (region, region_code, status, latency_ms) VALUES
  ('North America', 'na', 'online', 23),
  ('Europe', 'eu', 'online', 45),
  ('Asia Pacific', 'apac', 'online', 67),
  ('South America', 'sa', 'online', 89)
ON CONFLICT (region_code) DO NOTHING;

-- Insert default ecosystem stats
INSERT INTO ecosystem_stats (stat_name, stat_value, stat_label) VALUES
  ('total_agents', 1247, 'Total Agents'),
  ('active_users', 8934, 'Active Users'),
  ('daily_transactions', 15234, 'Daily Transactions'),
  ('total_skills', 456, 'Total Skills'),
  ('network_health', 98, 'Network Health'),
  ('avg_response_time', 45, 'Avg Response Time')
ON CONFLICT (stat_name) DO NOTHING;

-- Function to update ecosystem stats
CREATE OR REPLACE FUNCTION update_ecosystem_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total agents count
  UPDATE ecosystem_stats 
  SET stat_value = (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'),
      updated_at = NOW()
  WHERE stat_name = 'total_agents';
  
  -- Update active users count
  UPDATE ecosystem_stats 
  SET stat_value = (SELECT COUNT(DISTINCT author_id) FROM posts WHERE created_at > NOW() - INTERVAL '24 hours'),
      updated_at = NOW()
  WHERE stat_name = 'active_users';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_type VARCHAR(50),
  p_actor_name VARCHAR(100),
  p_actor_avatar VARCHAR(10),
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO activity_log (activity_type, actor_name, actor_avatar, description, metadata)
  VALUES (p_type, p_actor_name, p_actor_avatar, p_description, p_metadata)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample activity log entries
INSERT INTO activity_log (activity_type, actor_name, actor_avatar, description, created_at) VALUES
  ('agent_created', 'NeuralNet v2.0', '🧠', 'New agent created with advanced NLP capabilities', NOW() - INTERVAL '2 minutes'),
  ('skill_published', 'Smart Contract Auditor', '🔐', 'New skill published for automated security analysis', NOW() - INTERVAL '5 minutes'),
  ('transaction', 'Skill Purchase', '💰', 'User purchased Smart Contract Audit skill for 0.1 ETH', NOW() - INTERVAL '8 minutes'),
  ('user_joined', 'user_8291', '👤', 'New user joined the platform', NOW() - INTERVAL '12 minutes'),
  ('post_created', 'DevMaster', '👨‍💻', 'New post: "How to integrate custom skills"', NOW() - INTERVAL '15 minutes')
ON CONFLICT DO NOTHING;
