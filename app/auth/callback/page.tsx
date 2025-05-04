'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle the auth callback
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed:', { event, session: !!session });

      if (event === 'SIGNED_IN' && session) {
        try {
          // Check if this is a new signup that needs verification
          if (!session.user.email_confirmed_at) {
            localStorage.setItem('pendingVerification', 'true');
            router.push('/auth/verify-email');
            return;
          }

          // Clear any pending verification flags
          localStorage.removeItem('pendingVerification');
          
          // Get the redirect URL from the URL parameters or default to dashboard
          const redirectTo = searchParams.get('next') || '/dashboard';
          logger.info('Redirecting to:', redirectTo);
          router.push(redirectTo);
        } catch (error: any) {
          logger.error('Error handling sign in:', error);
          router.push('/auth/signin');
        }
      } else if (event === 'SIGNED_OUT') {
        logger.info('User signed out');
        router.push('/auth/signin');
      } else if (event === 'USER_UPDATED') {
        logger.info('User updated:', { userId: session?.user.id });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  );
} 