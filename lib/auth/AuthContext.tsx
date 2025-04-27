import logger from '@/lib/logger';
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';
import { handleAuthSuccess } from './authEffects';
import { useRouter } from 'next/navigation';

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (token: string, newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: {username?: string, avatar_url?: string}) => Promise<{error: Error | null}>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ error: AuthError | null }>;
};

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          logger.error('Error getting auth session:', error.message);
          setState({
            ...initialState,
            isLoading: false,
            isInitialized: true,
          });
          return;
        }

        setState({
          session: data.session,
          user: data.session?.user ?? null,
          isLoading: false,
          isInitialized: true,
        });
      } catch (error) {
        if (!mounted) return;
        logger.error('Unexpected error during auth initialization:', error);
        setState({
          ...initialState,
          isLoading: false,
          isInitialized: true,
        });
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setState(prevState => ({
          ...prevState,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        handleAuthSuccess('signin');
        router.prefetch('/chat');
        setTimeout(() => {
          router.push('/chat');
        }, 100);
      }
      return { error };
    } catch (error) {
      logger.error('Unexpected error during sign in:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error: new AuthError('An unexpected error occurred') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error, user: null };
      }

      handleAuthSuccess('signup');
      return { error: null, user: data.user };
    } catch (error) {
      logger.error('Unexpected error during sign up:', error);
      toast.error('An unexpected error occurred during sign up');
      return { error: new AuthError('An unexpected error occurred'), user: null };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      logger.error('Unexpected error during sign out:', error);
      toast.error('An unexpected error occurred during sign out');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent');
      }

      return { error };
    } catch (error) {
      logger.error('Unexpected error during password reset:', error);
      toast.error('An unexpected error occurred during password reset');
      return { error: new AuthError('An unexpected error occurred') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updatePassword = async (token: string, newPassword: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
      } else {
        handleAuthSuccess('reset');
        router.push('/auth/signin');
      }

      return { error };
    } catch (error) {
      logger.error('Unexpected error during password update:', error);
      toast.error('An unexpected error occurred during password update');
      return { error: new AuthError('An unexpected error occurred') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (data: {username?: string, avatar_url?: string}) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: state.user?.id,
          ...data,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      logger.error('Unexpected error during profile update:', error);
      toast.error('An unexpected error occurred during profile update');
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      // Success will redirect to callback URL
      return { error: null };
    } catch (error) {
      logger.error('Unexpected error during OAuth sign in:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error: new AuthError('An unexpected error occurred') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithOAuth,
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