'use client';

import { useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';
import { AuthContext } from './AuthContext';

const logger = createLogger('AuthProvider');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event, userId: session?.user?.id });
      
      setState(prevState => ({
        ...prevState,
        user: session?.user ?? null,
        session,
        loading: false,
        isLoading: false,
        isAuthenticated: !!session?.user,
        accessToken: session?.access_token ?? null,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      const response = await supabase.auth.signInWithPassword({ email, password });

      if (response.error) {
        throw response.error;
      }

      setState(prevState => ({
        ...prevState,
        user: response.data.user,
        session: response.data.session,
        loading: false,
        error: null,
        isAuthenticated: true,
      }));

      router.push('/dashboard');
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
      logger.error('Sign in error', error);
    }
  };

  const signOut = async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      await supabase.auth.signOut();
      setState(initialState);
      router.push('/');
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
      logger.error('Sign out error', error);
    }
  };

  const value = {
    state,
    signIn,
    signOut,
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
