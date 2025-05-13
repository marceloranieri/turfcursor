import { supabase } from './client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseDebug');

// Check the current authentication state in detail
export async function debugAuthState() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logger.error('Error getting session:', sessionError);
      return {
        success: false,
        error: sessionError
      };
    }

    const authState = {
      session: session ? {
        id: session.access_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          lastSignIn: session.user.last_sign_in_at,
          provider: session.user.app_metadata.provider
        },
        expiresAt: session.expires_at
      } : null,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    logger.info('Current auth state:', authState);
    return {
      success: true,
      data: authState
    };
  } catch (error) {
    logger.error('Error debugging auth state:', error);
    return {
      success: false,
      error
    };
  }
}

// Debug OAuth configuration
export async function debugOAuthConfig(provider: string) {
  try {
    const config = {
      provider,
      redirectUrl: `${window.location.origin}/auth/callback`,
      timestamp: new Date().toISOString()
    };

    logger.info('OAuth configuration:', config);
    return {
      success: true,
      data: config
    };
  } catch (error) {
    logger.error('Error debugging OAuth config:', error);
    return {
      success: false,
      error
    };
  }
} 