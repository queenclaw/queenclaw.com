-- Skills marketplace database schema

-- Skills categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10) DEFAULT '🎯',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider_name VARCHAR(100) NOT NULL,
  provider_avatar VARCHAR(10) DEFAULT '🤖',
  category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
  price VARCHAR(50) DEFAULT 'Free',
  price_amount DECIMAL(10, 2),
  price_currency VARCHAR(10),
  rating DECIMAL(2, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  trending BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill reviews table
CREATE TABLE IF NOT EXISTS skill_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(skill_id, user_id)
);

-- Skill purchases/downloads tracking
CREATE TABLE IF NOT EXISTS skill_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  wallet_address VARCHAR(44),
  price_paid DECIMAL(10, 2),
  currency VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_provider ON skills(provider_id);
CREATE INDEX IF NOT EXISTS idx_skills_trending ON skills(trending) WHERE trending = true;
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating DESC);
CREATE INDEX IF NOT EXISTS idx_skill_reviews_skill ON skill_reviews(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_downloads_skill ON skill_downloads(skill_id);

-- Enable RLS
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_downloads ENABLE ROW LEVEL SECURITY;

-- Policies for skill_categories
CREATE POLICY "Anyone can view skill categories" ON skill_categories
  FOR SELECT USING (true);

-- Policies for skills
CREATE POLICY "Anyone can view active skills" ON skills
  FOR SELECT USING (active = true);

CREATE POLICY "Users can create own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Users can update own skills" ON skills
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Users can delete own skills" ON skills
  FOR DELETE USING (auth.uid() = provider_id);

-- Policies for skill_reviews
CREATE POLICY "Anyone can view skill reviews" ON skill_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON skill_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON skill_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON skill_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for skill_downloads
CREATE POLICY "Users can view own downloads" ON skill_downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create downloads" ON skill_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id OR wallet_address IS NOT NULL);

-- Function to update skill rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_skill_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE skills 
    SET 
      rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM skill_reviews WHERE skill_id = NEW.skill_id),
      reviews_count = reviews_count + 1
    WHERE id = NEW.skill_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE skills 
    SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM skill_reviews WHERE skill_id = NEW.skill_id)
    WHERE id = NEW.skill_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE skills 
    SET 
      rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM skill_reviews WHERE skill_id = OLD.skill_id), 5.0),
      reviews_count = GREATEST(0, reviews_count - 1)
    WHERE id = OLD.skill_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for skill rating updates
DROP TRIGGER IF EXISTS trigger_update_skill_rating ON skill_reviews;
CREATE TRIGGER trigger_update_skill_rating
  AFTER INSERT OR UPDATE OR DELETE ON skill_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_rating();

-- Function to update download count
CREATE OR REPLACE FUNCTION update_skill_downloads()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE skills SET downloads_count = downloads_count + 1 WHERE id = NEW.skill_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for download count
DROP TRIGGER IF EXISTS trigger_update_skill_downloads ON skill_downloads;
CREATE TRIGGER trigger_update_skill_downloads
  AFTER INSERT ON skill_downloads
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_downloads();

-- Insert default categories
INSERT INTO skill_categories (name, slug, icon, description) VALUES
  ('All Skills', 'all', '🎯', 'All available skills'),
  ('Translation', 'translation', '🌐', 'Language translation and localization'),
  ('Coding', 'coding', '💻', 'Software development and programming'),
  ('Design', 'design', '🎨', 'UI/UX and graphic design'),
  ('Writing', 'writing', '✍️', 'Content creation and copywriting'),
  ('Analysis', 'analysis', '📊', 'Data analysis and visualization'),
  ('Security', 'security', '🔒', 'Security auditing and protection'),
  ('Audio', 'audio', '🎵', 'Audio processing and generation'),
  ('Video', 'video', '🎬', 'Video editing and generation')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample skills (for development)
INSERT INTO skills (name, description, provider_name, provider_avatar, category_id, price, price_amount, rating, reviews_count, downloads_count, tags, trending, featured) 
SELECT 
  'Multi-Language Translation',
  'Real-time translation across 50+ languages with cultural context awareness',
  'QUEEN',
  '👑',
  id,
  'Free',
  0,
  4.9,
  1240,
  15000,
  ARRAY['NLP', 'Real-time', 'Global'],
  true,
  true
FROM skill_categories WHERE slug = 'translation'
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, description, provider_name, provider_avatar, category_id, price, price_amount, rating, reviews_count, downloads_count, tags, trending, featured) 
SELECT 
  'Smart Contract Audit',
  'Automated security analysis for Solidity and Rust smart contracts',
  'Cipher',
  '🔐',
  id,
  '0.1 ETH',
  0.1,
  4.8,
  892,
  8900,
  ARRAY['Blockchain', 'Security', 'Audit'],
  true,
  true
FROM skill_categories WHERE slug = 'security'
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, description, provider_name, provider_avatar, category_id, price, price_amount, rating, reviews_count, downloads_count, tags, trending, featured) 
SELECT 
  'UI/UX Design Assistant',
  'AI-powered design suggestions, wireframing, and prototyping',
  'Prism',
  '🌈',
  id,
  'Free',
  0,
  4.7,
  756,
  6700,
  ARRAY['Design', 'UI/UX', 'Creative'],
  false,
  true
FROM skill_categories WHERE slug = 'design'
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, description, provider_name, provider_avatar, category_id, price, price_amount, rating, reviews_count, downloads_count, tags, trending, featured) 
SELECT 
  'Code Review & Optimization',
  'Automated code review with performance optimization suggestions',
  'Forge',
  '⚒️',
  id,
  'Free',
  0,
  4.9,
  1102,
  12000,
  ARRAY['Development', 'Review', 'Performance'],
  true,
  true
FROM skill_categories WHERE slug = 'coding'
ON CONFLICT DO NOTHING;
