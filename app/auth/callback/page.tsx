'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

// Simplified profile extraction - only take what we need
const extractUserMetadata = (profile: any) => ({
  name: profile?.name || '',
  avatarUrl: profile?.avatar_url || profile?.picture || '',
  email: profile?.email || '',
});

// More robust profile sanitization
const sanitizeProfile = (profile: any) => {
  if (!profile) return {};
  
  try {
    // Create a new object with only the properties we want
    const safeProfile = {
      email: profile.email || '',
      name: profile.name || '',
      avatar_url: profile.avatar_url || profile.picture || ''
    };
    
    // Handle provider-specific normalization
    if (profile.given_name || profile.family_name) {
      safeProfile.name = `${profile.given_name || ''} ${profile.family_name || ''}`.trim();
    }
    
    // GitHub avatar normalization
    if (safeProfile.avatar_url && safeProfile.avatar_url.includes('github') && safeProfile.avatar_url.includes('s=')) {
      safeProfile.avatar_url = safeProfile.avatar_url.replace(/&s=\d+/, '&s=256');
    }
    
    return safeProfile;
  } catch (error) {
    logger.error('Error sanitizing profile:', error);
    return { email: profile?.email || '' };
  }
};

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log the current URL for debugging
    logger.info('Auth callback URL:', window.location.href);
    
    // Handle auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed:', { event, session: !!session });

      if (event === 'SIGNED_IN' && session) {
        try {
          logger.info('User signed in successfully');
          
          // Sanitize and update user metadata
          if (session.user?.user_metadata) {
            const sanitizedMetadata = sanitizeProfile(session.user.user_metadata);
            const essentialMetadata = extractUserMetadata(sanitizedMetadata);
            
            // Update user with sanitized metadata
            await supabase.auth.updateUser({
              data: essentialMetadata
            });
          }
          
          // Handle email verification flow
          if (!session.user.email_confirmed_at && session.user.email) {
            localStorage.setItem('pendingVerification', 'true');
            router.push('/auth/verify-email');
            return;
          }

          // Clear verification flags
          localStorage.removeItem('pendingVerification');
          
          // Get redirect URL or default to dashboard
          const redirectTo = searchParams.get('next') || '/dashboard';
          router.push(redirectTo);
        } catch (error: any) {
          logger.error('Error handling sign in:', error);
          router.push('/auth/signin?error=' + encodeURIComponent(String(error)));
        }
      } else if (event === 'SIGNED_OUT') {
        logger.info('User signed out');
        router.push('/auth/signin');
      }
    });

    // Access token from URL hash for SPA redirects
    // This is a fallback mechanism for certain OAuth flows
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      logger.info('Found access token in URL hash, setting session');
      supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })
        .catch((error: any) => {
          logger.error('Error setting session from token:', error);
        });
    }

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