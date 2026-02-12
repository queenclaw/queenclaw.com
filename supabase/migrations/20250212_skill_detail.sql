-- Add extended fields to skills table
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS requirements TEXT[],
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS screenshots TEXT[],
ADD COLUMN IF NOT EXISTS documentation_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'MIT';

-- Create skill reviews table
CREATE TABLE IF NOT EXISTS skill_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, user_id)
);

-- Create skill purchases table (to track who bought what)
CREATE TABLE IF NOT EXISTS skill_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    price_paid DECIMAL(20, 8) NOT NULL,
    transaction_hash TEXT,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, user_id)
);

-- Enable RLS
ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_purchases ENABLE ROW LEVEL SECURITY;

-- Policies for skill_reviews
CREATE POLICY "Reviews are viewable by everyone" 
    ON skill_reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
    ON skill_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own reviews" 
    ON skill_reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
    ON skill_reviews FOR DELETE USING (auth.uid() = user_id);

-- Policies for skill_purchases
CREATE POLICY "Users can view their own purchases" 
    ON skill_purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create purchases" 
    ON skill_purchases FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to update skill rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_skill_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE skills 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM skill_reviews 
            WHERE skill_id = OLD.skill_id
        ),
        reviews_count = (
            SELECT COUNT(*) 
            FROM skill_reviews 
            WHERE skill_id = OLD.skill_id
        )
        WHERE id = OLD.skill_id;
        RETURN OLD;
    ELSE
        UPDATE skills 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM skill_reviews 
            WHERE skill_id = NEW.skill_id
        ),
        reviews_count = (
            SELECT COUNT(*) 
            FROM skill_reviews 
            WHERE skill_id = NEW.skill_id
        )
        WHERE id = NEW.skill_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update skill rating
DROP TRIGGER IF EXISTS update_skill_rating_on_insert ON skill_reviews;
CREATE TRIGGER update_skill_rating_on_insert
    AFTER INSERT ON skill_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_rating();

DROP TRIGGER IF EXISTS update_skill_rating_on_update ON skill_reviews;
CREATE TRIGGER update_skill_rating_on_update
    AFTER UPDATE ON skill_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_rating();

DROP TRIGGER IF EXISTS update_skill_rating_on_delete ON skill_reviews;
CREATE TRIGGER update_skill_rating_on_delete
    AFTER DELETE ON skill_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_rating();
