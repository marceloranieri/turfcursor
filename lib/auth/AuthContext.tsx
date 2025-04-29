'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { handleAuthError } from './authEffects';
import { useRouter } from 'next/navigation';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthContext');

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

const AuthContext = createContext<{
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  state: initialState,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState(prevState => ({
        ...prevState,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }));
  }, []);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    try {
      const {
        data: { session },
      } = response;
      setState(prevState => ({
        ...prevState,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        accessToken: session?.access_token ?? null,
        user: session?.user ?? null,
        session,
      }));
    } catch (error) {
      handleAuthError(error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      const response = await supabase.auth.signInWithPassword({ email, password });

      if (response.error) {
        throw response.error;
      }

      handleAuthSuccess(response);
      router.push('/dashboard');
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error as Error,
      }));
      handleAuthError(error);
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
        error: error as Error,
      }));
      handleAuthError(error);
    }
  };

  return <AuthContext.Provider value={{ state, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
