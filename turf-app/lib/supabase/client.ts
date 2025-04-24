import { createClient } from '@supabase/supabase-js';
import { User } from '../../types/supabase';
import { Database } from './database.types';

// Initialize the Supabase client with environment variables
// These should be set in your Vercel deployment environment
// For local development, use .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the Supabase client with the extended User type
export const supabase = createClient<{ Users: User }>(supabaseUrl, supabaseAnonKey);

// Re-export other necessary items
export * from '../../types/supabase';

// Types for database tables
export type Message = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  circle_id: string;
  reply_to?: string;
  is_pinned: boolean;
  is_wizard: boolean;
  upvotes: number;
  downvotes: number;
};

export type Reaction = {
  id: string;
  message_id: string;
  user_id: string;
  type: string; // emoji, gif, etc.
  content: string;
  created_at: string;
};

export type Circle = {
  id: string;
  topic: string;
  created_at: string;
  is_active: boolean;
};

export type Notification = {
  id: string;
  user_id: string;
  content: string;
  type: string; // pin, genius, harmony, etc.
  is_read: boolean;
  created_at: string;
  related_id?: string; // ID of related message, user, etc.
};