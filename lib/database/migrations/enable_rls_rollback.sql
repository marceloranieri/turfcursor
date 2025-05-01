-- Drop all policies
DROP POLICY IF EXISTS "Default deny profiles" ON public.profiles;
DROP POLICY IF EXISTS "Default deny messages" ON public.messages;
DROP POLICY IF EXISTS "Default deny circles" ON public.circles;
DROP POLICY IF EXISTS "Default deny circle members" ON public.circle_members;
DROP POLICY IF EXISTS "Default deny circle admins" ON public.circle_admins;

DROP POLICY IF EXISTS "Allow users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view messages in their circles" ON public.messages;
DROP POLICY IF EXISTS "Allow users to create messages in their circles" ON public.messages;
DROP POLICY IF EXISTS "Allow users to update own messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to view their circles" ON public.circles;
DROP POLICY IF EXISTS "Allow users to create circles" ON public.circles;
DROP POLICY IF EXISTS "Allow circle creators to update circles" ON public.circles;
DROP POLICY IF EXISTS "Allow circle creators to delete circles" ON public.circles;
DROP POLICY IF EXISTS "Allow viewing circle members" ON public.circle_members;
DROP POLICY IF EXISTS "Allow circle creators to manage members" ON public.circle_members;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_admins DISABLE ROW LEVEL SECURITY; 