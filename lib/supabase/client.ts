import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';
import { Database } from '@/lib/database/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const logger = createLogger('SupabaseClient');

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  logger.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  logger.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Get the app URL from environment or default to production URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.turfyeah.com';

// Initialize the Supabase client with session persistence settings
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storageKey: 'supabase-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development',
      cookieOptions: {
        domain: new URL(appUrl).hostname,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    },
    global: {
      headers: {
        'X-App-URL': appUrl
      }
    }
  }
);

// For client components
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a direct instance for imports like: import { supabase } from '@/lib/supabase/client'
export const supabaseDirect = createClientComponentClient<Database>();

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
      logger.error('Error creating server component client:', error);
      throw error;
    }
  }
  return createClient();
}

// For Pages Router
export function createPagesClient() {
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

// Check authentication status with improved error handling
export const checkAuthStatus = async () => {
  try {
    logger.info('Checking auth status');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Error checking auth status:', error.message);
      return { user: null, isLoggedIn: false, error };
    }

    const result = {
      user: session?.user || null,
      isLoggedIn: !!session?.user,
      error: null
    };

    logger.info('Auth status checked:', {
      isLoggedIn: result.isLoggedIn,
      userId: result.user?.id,
      email: result.user?.email
    });
    
    return result;
  } catch (err) {
    logger.error('Exception checking auth status:', err);
    return { 
      user: null, 
      isLoggedIn: false, 
      error: err instanceof Error ? err : new Error('Unknown error checking auth status') 
    };
  }
};

// Sign up with email with improved error handling and logging
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    logger.info('Attempting sign up:', { email });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`
      }
    });
    
    if (error) {
      logger.error('Error during sign up:', error.message);
      return { success: false, error };
    }

    logger.info('Sign up successful:', {
      userId: data.user?.id,
      email: data.user?.email,
      confirmationSent: data.user?.confirmation_sent_at
    });
    
    return { success: true, data, error: null };
  } catch (err) {
    logger.error('Exception during sign up:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Unknown error during sign up'),
      data: null
    };
  }
};

// Sign in with email with improved error handling
export const signInWithEmail = async (email: string, password: string) => {
  try {
    logger.info('Attempting sign in:', { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logger.error('Error during sign in:', error.message);
      return { success: false, error };
    }

    logger.info('Sign in successful:', {
      userId: data.user?.id,
      email: data.user?.email
    });
    
    return { success: true, data, error: null };
  } catch (err) {
    logger.error('Exception during sign in:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Unknown error during sign in'),
      data: null
    };
  }
};

// Sign out with improved error handling
export const signOut = async () => {
  try {
    logger.info('Attempting sign out');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Error during sign out:', error.message);
      return { success: false, error };
    }

    logger.info('Sign out successful');
    return { success: true, error: null };
  } catch (err) {
    logger.error('Exception during sign out:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Unknown error during sign out') 
    };
  }
};

// Reset password with improved error handling
export const resetPassword = async (email: string) => {
  try {
    logger.info('Attempting password reset:', { email });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password`
    });
    
    if (error) {
      logger.error('Error during password reset:', error.message);
      return { success: false, error };
    }

    logger.info('Password reset email sent:', { email });
    return { success: true, error: null };
  } catch (err) {
    logger.error('Exception during password reset:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Unknown error during password reset') 
    };
  }
};