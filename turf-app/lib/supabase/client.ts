import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// In a production environment, you would use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://csfdshydwdzexxosevml.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmRzaHlkd2R6ZXh4b3Nldm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNjY1MTUsImV4cCI6MjA2MDk0MjUxNX0.psZNkXCiyhIgHetnjF1NxwY40jYSZb3qlor78T-FPcg';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type User = {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  harmony_points: number;
  genius_awards_received: number;
  genius_awards_remaining: number;
  is_debate_maestro: boolean;
};

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