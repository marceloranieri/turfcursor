import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

// Grab Supabase URL and public anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single Supabase client for the entire application
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export common types for convenience
export type { Database } from './types/database.types';
export type {
  Profile,
  Message,
  Reaction,
  Circle,
  Notification,
} from './types/database.types'; 