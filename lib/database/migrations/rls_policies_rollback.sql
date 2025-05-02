-- Drop triggers
DROP TRIGGER IF EXISTS before_circle_delete ON circles;
DROP FUNCTION IF EXISTS delete_circle_cascade();

-- Drop indexes
DROP INDEX IF EXISTS idx_circle_members_user_id;
DROP INDEX IF EXISTS idx_circle_members_circle_id;
DROP INDEX IF EXISTS idx_circle_admins_user_id;
DROP INDEX IF EXISTS idx_circle_admins_circle_id;
DROP INDEX IF EXISTS idx_messages_circle_id;
DROP INDEX IF EXISTS idx_messages_user_id;
DROP INDEX IF EXISTS idx_circles_creator_id;
DROP INDEX IF EXISTS idx_circles_is_public;

-- Drop policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their circles" ON public.circles;
DROP POLICY IF EXISTS "Users can create circles" ON public.circles;
DROP POLICY IF EXISTS "Admins can update circles" ON public.circles;
DROP POLICY IF EXISTS "Users can view messages in their circles" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their circles" ON public.messages;
DROP POLICY IF EXISTS "Users can edit own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view circle members" ON public.circle_members;
DROP POLICY IF EXISTS "Circle admins can manage members" ON public.circle_members;
DROP POLICY IF EXISTS "Users can view circle admins" ON public.circle_admins;
DROP POLICY IF EXISTS "Circle creators can manage admins" ON public.circle_admins;

-- Disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_admins DISABLE ROW LEVEL SECURITY;