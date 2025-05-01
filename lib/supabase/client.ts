import { createServerClient, createBrowserClient, type CookieOptions } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';
import { Database } from './database.types';
import { cookies } from 'next/headers';

const logger = createLogger('SupabaseClient');

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a server client that can be used in Server Components, API Routes, and Edge Functions
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This will throw in middleware, but we can ignore it
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // This will throw in middleware, but we can ignore it
          }
        },
      },
    }
  );
}

// Create a browser client that can be used in Client Components
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        debug: process.env.NODE_ENV === 'development',
      },
      global: {
        headers: {
          'x-application-name': 'turf-app',
        },
      },
    }
  );
}

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
  user_metadata?: {
    full_name?: string;
    harmony_points?: number;
    is_debate_maestro?: boolean;
    genius_awards_remaining?: number;
  };
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