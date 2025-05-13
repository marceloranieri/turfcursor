import { createBrowserClient } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SupabaseClient');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Get the app URL from environment or default to production URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.turfyeah.com';

// Initialize the Supabase client with session persistence settings
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'supabase-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development',
      cookieOptions: {
        domain: new URL(appUrl).hostname,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    },
    global: {
      headers: {
        'X-App-URL': appUrl
      }
    }
  }
);

// Check authentication status
export async function checkAuthStatus() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      logger.error('Error checking auth status:', error);
      return { session: null, error };
    }

    if (session) {
      logger.info('User is authenticated', {
        userId: session.user.id,
        email: session.user.email,
      });
    } else {
      logger.info('No active session found');
    }

    return { session, error: null };
  } catch (error: any) {
    logger.error('Unexpected error checking auth status:', error);
    return {
      session: null,
      error: {
        message: error.message || 'Failed to check authentication status',
        status: error.status || 500,
        details: error,
      },
    };
  }
}

// Enhanced sign-up function with detailed logging and error handling
export async function signUpWithEmail(email: string, password: string, metadata: any = {}) {
  try {
    logger.info('Attempting email sign-up', { email, metadata });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${appUrl}/api/auth/callback`,
      },
    });

    if (error) {
      logger.error('Sign-up error:', {
        error: error.message,
        code: error.status,
        details: error,
        context: { email, metadata }
      });
      throw error;
    }

    logger.info('Sign-up successful', {
      userId: data.user?.id,
      email: data.user?.email,
      confirmationSent: data.user?.confirmation_sent_at,
      metadata: data.user?.user_metadata
    });

    return { data, error: null };
  } catch (error: any) {
    logger.error('Unexpected sign-up error:', {
      error: error.message,
      stack: error.stack,
      context: { email }
    });
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred during sign-up',
        status: error.status || 500,
        details: error,
      },
    };
  }
}

// Enhanced sign-in function with detailed logging
export async function signInWithEmail(email: string, password: string) {
  try {
    logger.info('Attempting email sign-in', { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      logger.error('Sign-in error:', {
        error: error.message,
        code: error.status,
        details: error,
        context: { email }
      });
      throw error;
    }

    logger.info('Sign-in successful', {
      userId: data.user?.id,
      email: data.user?.email,
      session: !!data.session
    });

    return { data, error: null };
  } catch (error: any) {
    logger.error('Unexpected sign-in error:', {
      error: error.message,
      stack: error.stack,
      context: { email }
    });
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred during sign-in',
        status: error.status || 500,
        details: error,
      },
    };
  }
}

// Enhanced OAuth sign-in function with detailed logging
export async function signInWithProvider(provider: 'google' | 'facebook' | 'github') {
  try {
    logger.info(`Attempting ${provider} sign-in`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${appUrl}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      logger.error(`${provider} sign-in error:`, {
        error: error.message,
        code: error.status,
        details: error,
      });
      throw error;
    }

    logger.info(`${provider} sign-in initiated`, {
      provider,
      url: data?.url,
    });

    return { data, error: null };
  } catch (error: any) {
    logger.error(`Unexpected ${provider} sign-in error:`, {
      error: error.message,
      stack: error.stack,
      provider
    });
    return {
      data: null,
      error: {
        message: error.message || `An unexpected error occurred during ${provider} sign-in`,
        status: error.status || 500,
        details: error,
      },
    };
  }
}

// Enhanced password reset function
export async function resetPassword(email: string) {
  try {
    logger.info('Attempting password reset', { email });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password`,
    });
    
    if (error) {
      logger.error('Password reset error:', {
        error: error.message,
        code: error.status,
        details: error,
        context: { email }
      });
      throw error;
    }

    logger.info('Password reset email sent', {
      email,
      url: window.location.href
    });

    return { error: null };
  } catch (error: any) {
    logger.error('Unexpected password reset error:', {
      error: error.message,
      stack: error.stack,
      context: { email }
    });
    return {
      error: {
        message: error.message || 'An unexpected error occurred during password reset',
        status: error.status || 500,
        details: error,
      },
    };
  }
}

// Function to handle MFA setup if enabled
export async function setupMFA() {
  try {
    logger.info('Attempting to set up MFA');

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });

    if (error) {
      logger.error('MFA setup error:', error);
      throw error;
    }

    logger.info('MFA setup successful');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Unexpected MFA setup error:', error);
    return {
      data: null,
      error: {
        message: error.message || 'Failed to set up MFA',
        status: error.status || 500,
        details: error,
      },
    };
  }
} 