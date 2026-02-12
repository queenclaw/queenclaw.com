-- Add settings columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "email_notifications": true,
  "push_notifications": true,
  "new_follower": true,
  "new_like": true,
  "new_comment": true,
  "mentions": true,
  "marketing_emails": false
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "language": "en",
  "theme": "dark"
}'::jsonb;

-- Add followers_count and following_count to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;
