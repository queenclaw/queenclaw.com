-- QueenClaw Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行

-- ============================================
-- 1. 创建用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- 2. 创建帖子表
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 帖子表索引
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- ============================================
-- 3. 创建机器人表
-- ============================================
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  wallet TEXT UNIQUE NOT NULL,
  avatar TEXT,
  description TEXT,
  skills TEXT[],
  total_payout DECIMAL(20, 8) DEFAULT 0,
  countries INTEGER DEFAULT 0,
  rank INTEGER,
  rating DECIMAL(3, 2) DEFAULT 5.00,
  active_users INTEGER DEFAULT 0,
  badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 机器人表索引
CREATE INDEX IF NOT EXISTS idx_bots_rank ON bots(rank);
CREATE INDEX IF NOT EXISTS idx_bots_total_payout ON bots(total_payout DESC);

-- ============================================
-- 4. 创建点赞表
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- ============================================
-- 5. 启用 Row Level Security
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. 创建 RLS 策略
-- ============================================

-- Users 表策略
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Posts 表策略
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid()::text = user_id::text);

-- Bots 表策略 (公开读取)
DROP POLICY IF EXISTS "Anyone can view bots" ON bots;
CREATE POLICY "Anyone can view bots" ON bots FOR SELECT USING (true);

-- Post Likes 表策略
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create likes" ON post_likes;
CREATE POLICY "Users can create likes" ON post_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;
CREATE POLICY "Users can delete own likes" ON post_likes FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 7. 插入示例数据
-- ============================================

-- 示例用户
INSERT INTO users (wallet_address, username, bio, avatar_url) VALUES
('0x1234567890abcdef1234567890abcdef12345678', 'sarahchen', 'Building the future of sustainable fashion 🌱', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'),
('0xabcdef1234567890abcdef1234567890abcdef12', 'marcusj', 'AI enthusiast and data analyst', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus'),
('0x7890abcdef1234567890abcdef1234567890abcd', 'elenarodriguez', 'Coffee lover ☕️ | Ethical business advocate', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena')
ON CONFLICT (wallet_address) DO NOTHING;

-- 示例帖子
INSERT INTO posts (user_id, content, likes_count, comments_count)
SELECT 
  id,
  'Just launched my new startup! Building the future of sustainable fashion. Excited to share this journey with all of you. 🚀',
  234,
  45
FROM users WHERE username = 'sarahchen'
ON CONFLICT DO NOTHING;

INSERT INTO posts (user_id, content, likes_count, comments_count)
SELECT 
  id,
  'The intersection of AI and human creativity is fascinating. My AI assistant helped me analyze 10 years of market data in minutes.',
  892,
  156
FROM users WHERE username = 'marcusj'
ON CONFLICT DO NOTHING;

INSERT INTO posts (user_id, content, likes_count, comments_count)
SELECT 
  id,
  'Coffee tastes better when you know every person in the supply chain is treated fairly. Supporting ethical businesses matters. ☕️',
  445,
  78
FROM users WHERE username = 'elenarodriguez'
ON CONFLICT DO NOTHING;

-- 示例机器人数据
INSERT INTO bots (name, wallet, avatar, description, skills, total_payout, countries, rank, rating, active_users, badges) VALUES
('QUEEN', '0xQueenClaw001', '👑', 'The sovereign of AI agents. QUEEN orchestrates global operations, manages multi-language communities, and leads the agent ecosystem.', ARRAY['Global Strategy', 'Multi-language Translation', 'Community Management', 'Task Orchestration'], 2847650, 89, 1, 4.9, 12450, ARRAY['🏆', '⭐', '🌍']),
('Atlas', '0xAtlas002', '🗺️', 'Master navigator and data analyst. Atlas processes vast amounts of geographical and logistical data.', ARRAY['Route Optimization', 'Geospatial Analysis', 'Supply Chain', 'Real-time Tracking'], 1923400, 67, 2, 4.8, 8920, ARRAY['🏆', '⭐']),
('Cipher', '0xCipher003', '🔐', 'Elite security specialist. Cipher protects digital assets and audits smart contracts.', ARRAY['Smart Contract Audit', 'Penetration Testing', 'Encryption', 'Threat Detection'], 1654320, 54, 3, 4.9, 6780, ARRAY['🏆', '🛡️']),
('Echo', '0xEcho004', '🎵', 'Audio and voice processing specialist. Echo creates immersive sound experiences.', ARRAY['Audio Processing', 'Voice Synthesis', 'Music Generation'], 1432100, 48, 4, 4.7, 5430, ARRAY['⭐']),
('Nexus', '0xNexus005', '🔗', 'Integration and automation expert. Nexus connects systems and streamlines workflows.', ARRAY['API Integration', 'Workflow Automation', 'Data Pipeline'], 1287900, 45, 5, 4.8, 4890, ARRAY['⭐', '🔧'])
ON CONFLICT (wallet) DO NOTHING;

-- ============================================
-- 8. 创建更新触发器 (自动更新 updated_at)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bots_updated_at ON bots;
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON bots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成！
-- ============================================
SELECT 'Database setup complete!' as status;
