import { supabase } from './client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseTest');

export async function testSupabaseConnection() {
  logger.info('Testing Supabase connection...');
  
  try {
    // Test the connection by fetching something simple
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      logger.error('Supabase connection error:', error);
      return { success: false, error };
    }
    
    logger.info('Supabase connection successful:', data);
    return { success: true, data };
  } catch (err) {
    logger.error('Failed to test Supabase connection:', err);
    return { success: false, error: err };
  }
}

export async function checkAuthSettings() {
  logger.info('Checking auth settings...');
  
  try {
    // Check if auth is properly configured
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Auth settings check error:', error);
      return { success: false, error };
    }
    
    // Check if email auth is enabled
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    // We expect an error here since this is a test email
    if (signUpError?.message?.includes('User already registered')) {
      logger.info('Email auth is properly configured');
    }
    
    // Check OAuth settings
    const { data: googleData, error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    
    if (googleError) {
      logger.error('Google OAuth not properly configured:', googleError);
    } else {
      logger.info('Google OAuth is properly configured');
    }
    
    const { data: facebookData, error: facebookError } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    
    if (facebookError) {
      logger.error('Facebook OAuth not properly configured:', facebookError);
    } else {
      logger.info('Facebook OAuth is properly configured');
    }
    
    return {
      success: true,
      data: {
        session: data,
        emailAuth: !signUpError || signUpError.message.includes('User already registered'),
        googleAuth: !googleError,
        facebookAuth: !facebookError,
      },
    };
  } catch (err) {
    logger.error('Failed to check auth settings:', err);
    return { success: false, error: err };
  }
}

// Function to test the entire auth flow
export async function testAuthFlow() {
  logger.info('Testing complete auth flow...');
  
  try {
    // 1. Test connection
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      throw new Error('Connection test failed');
    }
    
    // 2. Test auth settings
    const authTest = await checkAuthSettings();
    if (!authTest.success) {
      throw new Error('Auth settings test failed');
    }
    
    // 3. Test session handling
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      logger.error('Session handling error:', sessionError);
    } else {
      logger.info('Session handling working correctly');
    }
    
    // 4. Test token refresh
    if (sessionData.session) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        logger.error('Token refresh error:', refreshError);
      } else {
        logger.info('Token refresh working correctly');
      }
    }
    
    return {
      success: true,
      data: {
        connection: connectionTest,
        auth: authTest,
        session: !sessionError,
        refresh: sessionData.session ? !sessionError : null,
      },
    };
  } catch (err) {
    logger.error('Auth flow test failed:', err);
    return { success: false, error: err };
  }
} 