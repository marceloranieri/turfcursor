'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No code provided');
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;

        // Get return URL or default to home
        const returnTo = searchParams.get('returnTo') || '/';
        router.push(returnTo);
      } catch (error: any) {
        logger.error('Error handling auth callback:', error);
        router.push('/auth/signin?error=Authentication failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  );
} 