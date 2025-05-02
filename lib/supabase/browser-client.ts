import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/database/types';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseBrowserClient');

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Export a singleton instance for client components
export const supabase = typeof window !== 'undefined'
  ? (() => {
      if (!supabaseInstance) {
        try {
          supabaseInstance = createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          logger.info('Supabase browser client initialized');
        } catch (error) {
          logger.error('Error initializing Supabase browser client:', error);
          throw error;
        }
      }
      return supabaseInstance;
    })()
  : null;

// Safe wrapper for client components
export function getSupabaseBrowser() {
  if (!supabase) {
    throw new Error('Supabase client is not available');
  }
  return supabase;
}

// Also export a factory function for when a new client is needed
export const createClient = () => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('createClient can only be used in the browser');
    }
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    logger.error('Error creating new Supabase client:', error);
    throw error;
  }
}; 