'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, Session } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';
import { useRouter } from 'next/navigation';

const logger = createLogger('AuthContext');

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        logger.info('Checking initial auth state');
        console.log('Current URL:', window.location.href);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error);
          console.log('Session error:', { error, url: window.location.href });
          return;
        }
        
        if (session) {
          logger.info('Initial session found:', {
            userId: session.user.id,
            email: session.user.email,
            lastSignIn: session.user.last_sign_in_at,
            provider: session.user.app_metadata.provider,
            url: window.location.href
          });
        } else {
          logger.info('No initial session found', {
            url: window.location.href,
            timestamp: new Date().toISOString()
          });
        }

        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            logger.info('Auth state changed:', {
              event,
              userId: session?.user?.id,
              email: session?.user?.email,
              provider: session?.user?.app_metadata?.provider,
              url: window.location.href,
              timestamp: new Date().toISOString()
            });

            console.log('Auth state change:', {
              event,
              session: session ? {
                userId: session.user.id,
                email: session.user.email,
                provider: session.user.app_metadata.provider
              } : null,
              url: window.location.href
            });

            setSession(session);
            setUser(session?.user || null);
          }
        );

        return () => {
          logger.info('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        logger.error('Error in auth state management:', error);
        console.error('Auth state error:', {
          error,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase.auth]);

  const signOut = async () => {
    try {
      logger.info('Attempting sign out');
      await supabase.auth.signOut();
      logger.info('Sign out successful');
      router.push('/');
    } catch (error) {
      logger.error('Error signing out:', error);
      console.error('Sign out error:', {
        error,
        url: window.location.href
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logger.error('Sign in error:', {
          error,
          email,
          url: window.location.href
        });
        console.error('Sign in failed:', {
          error,
          email,
          url: window.location.href
        });
        throw error;
      }

      logger.info('Sign in successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        url: window.location.href
      });
    } catch (error) {
      logger.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign up:', { email });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        logger.error('Sign up error:', {
          error,
          email,
          url: window.location.href
        });
        console.error('Sign up failed:', {
          error,
          email,
          url: window.location.href
        });
        throw error;
      }

      logger.info('Sign up successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        confirmationSent: data.user?.confirmation_sent_at,
        url: window.location.href
      });
    } catch (error) {
      logger.error('Error signing up:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      logger.info('Attempting password reset:', { email });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) {
        logger.error('Password reset error:', {
          error,
          email,
          url: window.location.href
        });
        console.error('Password reset failed:', {
          error,
          email,
          url: window.location.href
        });
        throw error;
      }

      logger.info('Password reset email sent:', {
        email,
        url: window.location.href
      });
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signIn,
    signUp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 