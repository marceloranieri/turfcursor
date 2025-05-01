-- First, enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_admins ENABLE ROW LEVEL SECURITY;

-- Create default policies to prevent data leakage
-- These are restrictive by default, we'll add more permissive policies later

-- Profiles default policies
CREATE POLICY "Default deny profiles" ON public.profiles
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);

-- Messages default policies
CREATE POLICY "Default deny messages" ON public.messages
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);

-- Circles default policies
CREATE POLICY "Default deny circles" ON public.circles
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);

-- Circle members default policies
CREATE POLICY "Default deny circle members" ON public.circle_members
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);

-- Circle admins default policies
CREATE POLICY "Default deny circle admins" ON public.circle_admins
FOR ALL TO authenticated
USING (false)
WITH CHECK (false);

-- Now create specific allow policies

-- Profiles allow policies
CREATE POLICY "Allow users to view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Messages allow policies
CREATE POLICY "Allow users to view messages in their circles"
ON public.messages FOR SELECT
TO authenticated
USING (
    circle_id IN (
        SELECT circle_id 
        FROM circle_members 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to create messages in their circles"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    circle_id IN (
        SELECT circle_id 
        FROM circle_members 
        WHERE user_id = auth.uid()
    ) AND user_id = auth.uid()
);

CREATE POLICY "Allow users to update own messages"
ON public.messages FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to delete own messages"
ON public.messages FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Circles allow policies
CREATE POLICY "Allow users to view their circles"
ON public.circles FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT circle_id 
        FROM circle_members 
        WHERE user_id = auth.uid()
    ) OR is_public = true
);

CREATE POLICY "Allow users to create circles"
ON public.circles FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Allow circle creators to update circles"
ON public.circles FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Allow circle creators to delete circles"
ON public.circles FOR DELETE
TO authenticated
USING (creator_id = auth.uid());

-- Circle members allow policies
CREATE POLICY "Allow viewing circle members"
ON public.circle_members FOR SELECT
TO authenticated
USING (
    circle_id IN (
        SELECT id 
        FROM circles 
        WHERE creator_id = auth.uid() OR is_public = true
    )
);

CREATE POLICY "Allow circle creators to manage members"
ON public.circle_members FOR ALL
TO authenticated
USING (
    circle_id IN (
        SELECT id 
        FROM circles 
        WHERE creator_id = auth.uid()
    )
); 