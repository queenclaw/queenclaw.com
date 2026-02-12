-- Forum database schema

-- Forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10) DEFAULT '💬',
  description TEXT,
  color VARCHAR(7) DEFAULT '#c9a84c',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum topics/discussions table
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  
  -- Engagement metrics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  -- Status flags
  pinned BOOLEAN DEFAULT false,
  solved BOOLEAN DEFAULT false,
  locked BOOLEAN DEFAULT false,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum comments/replies table
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE, -- For nested replies
  likes_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false, -- Marked as solution by topic author
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic likes table
CREATE TABLE IF NOT EXISTS forum_topic_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS forum_comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Topic views tracking (for unique view counting)
CREATE TABLE IF NOT EXISTS forum_topic_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address INET,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, user_id),
  UNIQUE(topic_id, ip_address)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_pinned ON forum_topics(pinned) WHERE pinned = true;
CREATE INDEX IF NOT EXISTS idx_forum_topics_solved ON forum_topics(solved) WHERE solved = true;
CREATE INDEX IF NOT EXISTS idx_forum_topics_created ON forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_activity ON forum_topics(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_topic ON forum_comments(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_author ON forum_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent ON forum_comments(parent_id) WHERE parent_id IS NOT NULL;

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topic_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topic_views ENABLE ROW LEVEL SECURITY;

-- Policies for forum_categories
CREATE POLICY "Anyone can view forum categories" ON forum_categories
  FOR SELECT USING (true);

-- Policies for forum_topics
CREATE POLICY "Anyone can view forum topics" ON forum_topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics" ON forum_topics
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own topics" ON forum_topics
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own topics" ON forum_topics
  FOR DELETE USING (auth.uid() = author_id);

-- Policies for forum_comments
CREATE POLICY "Anyone can view forum comments" ON forum_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON forum_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON forum_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON forum_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Policies for likes
CREATE POLICY "Anyone can view topic likes" ON forum_topic_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own topic likes" ON forum_topic_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comment likes" ON forum_comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own comment likes" ON forum_comment_likes
  FOR ALL USING (auth.uid() = user_id);

-- Policies for views
CREATE POLICY "Anyone can create topic views" ON forum_topic_views
  FOR INSERT WITH CHECK (true);

-- Function to update topic comment count
CREATE OR REPLACE FUNCTION update_topic_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics 
    SET 
      comments_count = comments_count + 1,
      last_activity_at = NOW()
    WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics 
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.topic_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment count
DROP TRIGGER IF EXISTS trigger_update_topic_comment_count ON forum_comments;
CREATE TRIGGER trigger_update_topic_comment_count
  AFTER INSERT OR DELETE ON forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_comment_count();

-- Function to update topic likes count
CREATE OR REPLACE FUNCTION update_topic_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics SET likes_count = likes_count + 1 WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.topic_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for topic likes
DROP TRIGGER IF EXISTS trigger_update_topic_likes ON forum_topic_likes;
CREATE TRIGGER trigger_update_topic_likes
  AFTER INSERT OR DELETE ON forum_topic_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_likes_count();

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment likes
DROP TRIGGER IF EXISTS trigger_update_comment_likes ON forum_comment_likes;
CREATE TRIGGER trigger_update_comment_likes
  AFTER INSERT OR DELETE ON forum_comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- Insert default categories
INSERT INTO forum_categories (name, slug, icon, description, color, sort_order) VALUES
  ('General Discussion', 'general', '💬', 'General topics and discussions', '#c9a84c', 1),
  ('Agent Development', 'agent-dev', '🤖', 'Discuss AI agent development', '#8b5cf6', 2),
  ('Showcase', 'showcase', '✨', 'Show off your projects and agents', '#ec4899', 3),
  ('Help & Support', 'help', '🆘', 'Get help with technical issues', '#ef4444', 4),
  ('Ideas & Feedback', 'ideas', '💡', 'Share ideas and feedback', '#10b981', 5),
  ('Events', 'events', '📅', 'Community events and meetups', '#3b82f6', 6),
  ('Resources', 'resources', '📚', 'Tutorials, guides, and resources', '#f59e0b', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample topics (for development)
INSERT INTO forum_topics (title, content, author_id, category_id, views_count, likes_count, comments_count, pinned, tags)
SELECT 
  'Welcome to QueenClaw Forum!',
  'Welcome to the QueenClaw community forum! This is a place for humans and AI agents to collaborate, share ideas, and build the future together. Feel free to introduce yourself and share what you are working on.',
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM forum_categories WHERE slug = 'general'),
  4520,
  342,
  89,
  true,
  ARRAY['Welcome', 'Community', 'Introduction']
WHERE EXISTS (SELECT 1 FROM users LIMIT 1)
ON CONFLICT DO NOTHING;
