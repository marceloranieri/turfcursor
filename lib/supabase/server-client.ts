'use server';

import { createClient } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseServerClient');

// Use a singleton pattern to avoid multiple instantiations
let supabaseServerClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseServerClient() {
  if (supabaseServerClient) {
    return supabaseServerClient;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  logger.info('Creating Supabase server client');
  
  // Create a standard server-side client
  supabaseServerClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  return supabaseServerClient;
} 