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
    // Add this line to log the URL with error parameters
    logger.info('Auth callback URL:', window.location.href);
    
    // Add this line to handle URL hash parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // If we have a token in the URL, manually set it
      logger.info('Found access token in URL, setting session');
      supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
    }

    // Regular auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed:', { event, session: !!session });

      if (event === 'SIGNED_IN' && session) {
        try {
          logger.info('User signed in successfully');
          
          // Check if this is a new signup that needs verification
          if (!session.user.email_confirmed_at && session.user.email) {
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

          // When Google authentication returns, check for existing user
          if (error.message?.includes('Database error saving new user')) {
            logger.info('Attempting to link existing account...');
            try {
              // Try to sign in with existing email instead
              const { data, error: signInError } = await supabase.auth.signInWithOtp({
                email: session?.user?.email || '',
              });
              
              if (!signInError) {
                logger.info('Successfully initiated OTP sign in for existing account');
                router.push('/dashboard');
                return;
              }
            } catch (linkError) {
              logger.error('Account linking failed:', linkError);
            }
          }

          router.push('/auth/signin?error=' + encodeURIComponent(String(error)));
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