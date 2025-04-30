import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: string) => Promise<void>;
  accessToken: string | null;
}

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signInWithOAuth: () => Promise.resolve(),
  accessToken: null,
};

export function useAuth(): AuthContextType {
  // Check if we're in a browser environment
  const isServer = typeof window === 'undefined';
  const context = useContext(AuthContext);
  
  // During server-side rendering/static build, provide a default mock context
  if (isServer || !context) {
    return defaultContext;
  }
  
  return context;
} 