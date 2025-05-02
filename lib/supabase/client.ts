import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';
import { Database } from '@/lib/database/types';

const logger = createLogger('SupabaseClient');

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// For client components
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// For server components/actions (use this only in app directory files)
export function createServerComponentClient(cookieStore: any) {
  if (typeof window === 'undefined') {
    try {
      return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );
    } catch (error) {
      logger.error('Error creating server component client', error);
      throw error;
    }
  }
  
  throw new Error('createServerComponentClient can only be used on the server');
}

// For pages directory (client-side only)
export function createPagesClient() {
  if (typeof window === 'undefined') {
    throw new Error('createPagesClient can only be used in the browser');
  }
  
  return createClient();
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