-- Add terms acceptance fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS terms_version text;

-- Create an index for faster queries on terms acceptance
CREATE INDEX IF NOT EXISTS idx_profiles_terms_accepted ON profiles(terms_accepted);

-- Add a check constraint to ensure terms_accepted_at is set when terms are accepted
ALTER TABLE profiles
ADD CONSTRAINT chk_terms_acceptance 
CHECK (
  (terms_accepted = false AND terms_accepted_at IS NULL) OR
  (terms_accepted = true AND terms_accepted_at IS NOT NULL)
); 