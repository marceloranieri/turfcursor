import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

export const dynamic = 'force-dynamic';

export default async function AuthCallback() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient(cookieStore);

  try {
    const { searchParams } = new URL(headers().get('x-url') || '', 'http://localhost');
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        logger.error('Error exchanging code for session:', error);
        throw error;
      }
    }

    return redirect(next);
  } catch (error) {
    logger.error('Error in auth callback:', error);
    return redirect('/auth/error');
  }
} 