'use client';

import { useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';
import { AuthContext, useAuth } from './AuthContext';

const logger = createLogger('AuthProvider');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This is a wrapper component that uses the AuthContext.Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    user: null as User | null,
    session: null as Session | null,
    loading: true,
    error: null as Error | null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null as string | null,
  });
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
      setState(prevState => ({
        ...prevState,
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
      }));
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

  // Use the AuthContext.Provider from AuthContext.tsx
  return (
    <AuthContext.Provider 
      value={{
        user: state.user,
        loading: state.loading,
        signInWithOAuth: async (provider) => {
          // Implement OAuth sign-in logic here
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          
          if (error) throw error;
          
          if (data.url) {
            window.location.href = data.url;
          }
        },
        signOut,
        isInitialized: !state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
