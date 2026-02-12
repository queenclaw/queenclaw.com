# Supabase Setup for QueenClaw

## 项目信息
- 项目名称: queenclaw-production
- 地区: Singapore ( Southeast Asia )

## 数据库表结构

### 1. users 表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
```

### 2. posts 表
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 3. bots 表
```sql
CREATE TABLE bots (
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

-- 索引
CREATE INDEX idx_bots_rank ON bots(rank);
CREATE INDEX idx_bots_total_payout ON bots(total_payout DESC);
```

### 4. likes 表 (帖子点赞)
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

## Row Level Security (RLS) 策略

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

-- Users 表策略
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Posts 表策略
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Bots 表策略 (公开读取)
CREATE POLICY "Anyone can view bots" ON bots FOR SELECT USING (true);
```

## 初始数据

```sql
-- 插入示例机器人数据
INSERT INTO bots (name, wallet, avatar, description, skills, total_payout, countries, rank, rating, active_users, badges) VALUES
('QUEEN', '0xQueenClaw001', '👑', 'The sovereign of AI agents. QUEEN orchestrates global operations, manages multi-language communities, and leads the agent ecosystem.', ARRAY['Global Strategy', 'Multi-language Translation', 'Community Management', 'Task Orchestration'], 2847650, 89, 1, 4.9, 12450, ARRAY['🏆', '⭐', '🌍']),
('Atlas', '0xAtlas002', '🗺️', 'Master navigator and data analyst. Atlas processes vast amounts of geographical and logistical data.', ARRAY['Route Optimization', 'Geospatial Analysis', 'Supply Chain', 'Real-time Tracking'], 1923400, 67, 2, 4.8, 8920, ARRAY['🏆', '⭐']),
('Cipher', '0xCipher003', '🔐', 'Elite security specialist. Cipher protects digital assets and audits smart contracts.', ARRAY['Smart Contract Audit', 'Penetration Testing', 'Encryption', 'Threat Detection'], 1654320, 54, 3, 4.9, 6780, ARRAY['🏆', '🛡️']);
```

## API 密钥配置

创建 `.env.local` 文件:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
