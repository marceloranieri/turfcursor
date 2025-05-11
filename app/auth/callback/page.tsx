'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

// Helper function to extract only essential user metadata
const extractUserMetadata = (profile: any) => ({
  name: profile.name || '',
  avatarUrl: profile.avatar_url || profile.picture || '',
  email: profile.email || '',
  // Add only the fields you need
});

// Helper function to sanitize profile data
const sanitizeProfile = (profile: any) => {
  try {
    // First stringify to remove any non-JSON-serializable values
    const stringified = JSON.stringify(profile);
    // Then parse back to ensure it's valid JSON
    return JSON.parse(stringified);
  } catch (error) {
    logger.error('Error sanitizing profile:', error);
    // Return a safe default if sanitization fails
    return {
      email: profile?.email || '',
      name: profile?.name || '',
      avatar_url: profile?.avatar_url || ''
    };
  }
};

// Provider-specific sanitization
const sanitizeByProvider = (provider: string, profile: any) => {
  logger.info(`Sanitizing profile for provider: ${provider}`);
  
  if (provider === 'google') {
    // Google-specific sanitization
    const sanitized = { ...profile };
    // Remove any problematic fields
    delete sanitized.verified_email;
    delete sanitized.hd;
    delete sanitized.locale;
    // Normalize name fields
    if (sanitized.given_name || sanitized.family_name) {
      sanitized.name = `${sanitized.given_name || ''} ${sanitized.family_name || ''}`.trim();
    }
    return sanitizeProfile(sanitized);
  }
  
  if (provider === 'github') {
    // GitHub-specific sanitization
    const sanitized = { ...profile };
    // Remove any problematic fields
    delete sanitized.node_id;
    delete sanitized.updated_at;
    // Normalize avatar URL
    if (sanitized.avatar_url) {
      sanitized.avatar_url = sanitized.avatar_url.replace('&s=96', '&s=256');
    }
    return sanitizeProfile(sanitized);
  }
  
  // Default sanitization for other providers
  return sanitizeProfile(profile);
};

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
          
          // Log raw session data for debugging
          logger.info('Raw session data:', {
            user: session.user,
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata
          });

          // Sanitize user metadata before any database operations
          if (session.user.user_metadata) {
            const provider = session.user.app_metadata?.provider || 'unknown';
            const sanitizedMetadata = sanitizeByProvider(provider, session.user.user_metadata);
            // Extract only essential metadata
            const essentialMetadata = extractUserMetadata(sanitizedMetadata);
            logger.info('Essential user metadata:', essentialMetadata);
            
            // Update user with essential metadata
            const { error: updateError } = await supabase.auth.updateUser({
              data: essentialMetadata
            });
            
            if (updateError) {
              logger.error('Error updating user metadata:', updateError);
            }
          }
          
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