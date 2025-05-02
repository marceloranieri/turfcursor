import { supabase } from './client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseDebug');

// Check the current authentication state in detail
export async function debugAuthState() {
  logger.group('🔍 Supabase Auth Debug');
  
  try {
    // Check if there's a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logger.error('Session error:', sessionError);
    } else if (sessionData.session) {
      logger.info('✅ Active session found:', {
        userId: sessionData.session.user.id,
        email: sessionData.session.user.email,
        lastSignIn: new Date(sessionData.session.created_at).toLocaleString(),
        expiresAt: new Date(sessionData.session.expires_at * 1000).toLocaleString(),
        providerIds: sessionData.session.user.app_metadata.providers || [],
      });
    } else {
      logger.info('❌ No active session found');
    }
    
    // Check local storage for tokens
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('sb-xwgsbhncprilsuczqmjr-auth-token');
      logger.info('Local storage token exists:', Boolean(accessToken));
    }
    
    // Check if auto-refresh is working
    const { data: userResponse, error: userError } = await supabase.auth.getUser();
    if (userError) {
      logger.error('User fetch error:', userError);
    } else if (userResponse.user) {
      logger.info('✅ User data can be retrieved:', {
        id: userResponse.user.id,
        email: userResponse.user.email,
        emailConfirmed: userResponse.user.email_confirmed_at ? 'Yes' : 'No',
        lastSignIn: userResponse.user.last_sign_in_at,
        metadata: userResponse.user.user_metadata,
      });
    } else {
      logger.info('❌ No user data found');
    }
  } catch (e) {
    logger.error('Debug process error:', e);
  }
  
  logger.groupEnd();
}

// Debug OAuth configuration
export async function debugOAuthConfig(provider: string) {
  logger.group(`🔍 OAuth Debug: ${provider}`);
  
  try {
    // Check configured providers
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true // Just get the URL, don't redirect
      }
    });
    
    if (error) {
      logger.error(`${provider} OAuth error:`, error);
    } else if (data.url) {
      logger.info(`✅ ${provider} OAuth URL generated successfully:`, data.url);
      
      // Parse and display URL parameters
      const url = new URL(data.url);
      logger.info('Redirect URL:', url.searchParams.get('redirect_to'));
      logger.info('Client ID present:', Boolean(url.searchParams.get('client_id')));
    }
  } catch (e) {
    logger.error(`${provider} debug error:`, e);
  }
  
  logger.groupEnd();
} 