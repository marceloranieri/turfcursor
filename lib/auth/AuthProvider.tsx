'use client';

import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthProvider');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: any; // Replace with proper user type
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Add your auth logic here
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
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

  const signInWithOAuth = async (provider: any) => {
    try {
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
    } catch (error) {
      logger.error('OAuth sign in error', error);
      throw error;
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    isLoading: state.loading,
    session: state.session,
    signInWithOAuth,
    signOut,
    isInitialized: !state.loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
