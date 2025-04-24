import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with the user_metadata properties
export interface User extends SupabaseUser {
  user_metadata?: {
    full_name?: string;
    harmony_points?: number;
    is_debate_maestro?: boolean;
    genius_awards_remaining?: number;
    avatar_url?: string;
    email?: string;
    username?: string;
    // Add any other metadata properties your app uses
  };
}

// Export other types you might need
export type { Session } from '@supabase/supabase-js'; 