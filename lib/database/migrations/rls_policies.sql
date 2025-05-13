-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_admins ENABLE ROW LEVEL SECURITY;

-- Profiles Table Policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- Circles Table Policies
CREATE POLICY "Users can view their circles" 
ON public.circles FOR SELECT 
TO authenticated 
USING (
  id IN (
    SELECT circle_id FROM circle_members 
    WHERE user_id = auth.uid()
  ) OR is_public = true
);

CREATE POLICY "Users can create circles" 
ON public.circles FOR INSERT 
TO authenticated 
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Admins can update circles" 
ON public.circles FOR UPDATE 
TO authenticated 
USING (
  creator_id = auth.uid() OR 
  auth.uid() IN (
    SELECT user_id FROM circle_admins 
    WHERE circle_id = id
  )
);

-- Messages Table Policies
CREATE POLICY "Users can view messages in their circles" 
ON public.messages FOR SELECT 
TO authenticated 
USING (
  circle_id IN (
    SELECT circle_id FROM circle_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their circles" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK (
  circle_id IN (
    SELECT circle_id FROM circle_members 
    WHERE user_id = auth.uid()
  ) AND user_id = auth.uid()
);

CREATE POLICY "Users can edit own messages" 
ON public.messages FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own messages" 
ON public.messages FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Circle Members Table Policies
CREATE POLICY "Users can view circle members" 
ON public.circle_members FOR SELECT 
TO authenticated 
USING (
  circle_id IN (
    SELECT id FROM circles 
    WHERE id IN (
      SELECT circle_id FROM circle_members 
      WHERE user_id = auth.uid()
    ) OR is_public = true
  )
);

CREATE POLICY "Circle admins can manage members" 
ON public.circle_members FOR ALL 
TO authenticated 
USING (
  circle_id IN (
    SELECT circle_id FROM circle_admins 
    WHERE user_id = auth.uid()
  )
);

-- Circle Admins Table Policies
CREATE POLICY "Users can view circle admins" 
ON public.circle_admins FOR SELECT 
TO authenticated 
USING (
  circle_id IN (
    SELECT id FROM circles 
    WHERE id IN (
      SELECT circle_id FROM circle_members 
      WHERE user_id = auth.uid()
    ) OR is_public = true
  )
);

CREATE POLICY "Circle creators can manage admins" 
ON public.circle_admins FOR ALL 
TO authenticated 
USING (
  circle_id IN (
    SELECT id FROM circles 
    WHERE creator_id = auth.uid()
  )
);

-- Add indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_admins_user_id ON circle_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_admins_circle_id ON circle_admins(circle_id);
CREATE INDEX IF NOT EXISTS idx_messages_circle_id ON messages(circle_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_circles_creator_id ON circles(creator_id);
CREATE INDEX IF NOT EXISTS idx_circles_is_public ON circles(is_public);

-- Add cascade delete triggers
CREATE OR REPLACE FUNCTION delete_circle_cascade()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all messages in the circle
  DELETE FROM messages WHERE circle_id = OLD.id;
  -- Delete all member relationships
  DELETE FROM circle_members WHERE circle_id = OLD.id;
  -- Delete all admin relationships
  DELETE FROM circle_admins WHERE circle_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_circle_delete
  BEFORE DELETE ON circles
  FOR EACH ROW
  EXECUTE FUNCTION delete_circle_cascade(); 