-- Create a function to help with debugging policy issues
CREATE OR REPLACE FUNCTION get_policies()
RETURNS TABLE (
  table_name text,
  policy_name text,
  definition text
) LANGUAGE SQL AS $$
  SELECT
    pc.relname AS table_name,
    pp.polname AS policy_name,
    pg_catalog.pg_get_expr(pp.polqual, pp.polrelid) AS definition
  FROM pg_catalog.pg_policy pp
  JOIN pg_catalog.pg_class pc ON pc.oid = pp.polrelid
  ORDER BY pc.relname, pp.polname;
$$;

-- Make sure we have a User table with proper structure
CREATE TABLE IF NOT EXISTS public."User" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a trigger that fires when new users are created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Connect to the notify_admin_of_new_user function if it exists
  PERFORM notify_admin_of_new_user();
  EXCEPTION WHEN OTHERS THEN
    -- Continue even if notification fails
    RAISE NOTICE 'Failed to notify admin: %', SQLERRM;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure the User table has proper RLS policies
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON public."User";
DROP POLICY IF EXISTS "Users can insert their own data" ON public."User";
DROP POLICY IF EXISTS "Users can update their own data" ON public."User";
DROP POLICY IF EXISTS "Admins can do anything" ON public."User";

-- Create policies for the User table
CREATE POLICY "Users can view their own data"
  ON public."User"
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public."User"
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public."User"
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can do anything"
  ON public."User"
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- Test the user creation flow by inserting a dummy user
-- Uncomment this if you want to test directly
/*
INSERT INTO auth.users (id, email, raw_user_meta_data) 
VALUES (
  gen_random_uuid(), 
  'test@example.com',
  '{"first_name": "Test", "last_name": "User", "avatar_url": "https://example.com/avatar.png"}'
);
*/ 