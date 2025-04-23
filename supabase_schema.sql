-- Supabase database schema for Turf app

-- Enable RLS (Row Level Security)
alter database postgres set timezone to 'UTC';

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS circles;
DROP TABLE IF EXISTS users;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  harmony_points INTEGER DEFAULT 0,
  genius_awards_received INTEGER DEFAULT 0,
  genius_awards_remaining INTEGER DEFAULT 5,
  is_debate_maestro BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_wizard BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id, type)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  related_id UUID
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_circle_id ON messages(circle_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Circles table policies
DROP POLICY IF EXISTS "Anyone can view circles" ON circles;
CREATE POLICY "Anyone can view circles" ON circles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can create circles" ON circles;
CREATE POLICY "Only admins can create circles" ON circles
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_debate_maestro = true
  ));

-- Messages table policies
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
CREATE POLICY "Anyone can view messages" ON messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create messages" ON messages;
CREATE POLICY "Users can create messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Reactions table policies
DROP POLICY IF EXISTS "Anyone can view reactions" ON reactions;
CREATE POLICY "Anyone can view reactions" ON reactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reactions" ON reactions;
CREATE POLICY "Users can create reactions" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reactions" ON reactions;
CREATE POLICY "Users can update their own reactions" ON reactions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reactions" ON reactions;
CREATE POLICY "Users can delete their own reactions" ON reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications table policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Create functions and triggers
-- Function to update user harmony points when a message gets upvoted
CREATE OR REPLACE FUNCTION update_harmony_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.upvotes > OLD.upvotes THEN
    UPDATE users SET harmony_points = harmony_points + 1 WHERE id = NEW.user_id;
  ELSIF NEW.upvotes < OLD.upvotes THEN
    UPDATE users SET harmony_points = harmony_points - 1 WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_harmony_on_vote ON messages;
CREATE TRIGGER update_harmony_on_vote
AFTER UPDATE OF upvotes ON messages
FOR EACH ROW
EXECUTE FUNCTION update_harmony_points();

-- Function to create notification when message is pinned
CREATE OR REPLACE FUNCTION notify_on_pin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_pinned = TRUE AND OLD.is_pinned = FALSE THEN
    INSERT INTO notifications (user_id, content, type, related_id)
    VALUES (NEW.user_id, 'Your message was pinned!', 'pinned', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_pin_notification ON messages;
CREATE TRIGGER create_pin_notification
AFTER UPDATE OF is_pinned ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_on_pin(); 