import { supabase } from './client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseTest');

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      logger.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    const result = {
      success: true,
      database: {
        connected: !error,
        timestamp: new Date().toISOString()
      },
      auth: {
        connected: !authError,
        hasSession: !!authData?.session,
        timestamp: new Date().toISOString()
      }
    };

    logger.info('Connection test results:', result);
    return result;
  } catch (error) {
    logger.error('Test connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
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