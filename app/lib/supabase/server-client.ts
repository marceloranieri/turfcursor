import { createServerClient } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseServerClient');

export function createSupabaseServerClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  logger.info('Creating Supabase server client');
  
  // For server components/routes, we don't need cookie management
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
} 