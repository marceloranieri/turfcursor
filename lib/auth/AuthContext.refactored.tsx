'use client';

import logger from '@/lib/logger';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

// User type definition
interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session from Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Get user profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', data.session.user.id)
            .single();
          
          setState({
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
              username: userProfile?.username,
              avatarUrl: userProfile?.avatar_url,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    // Set up auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              username: userProfile?.username,
              avatarUrl: userProfile?.avatar_url,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    initializeAuth();

    // Clean up the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Auth state listener will update the state
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message || 'Failed to sign in',
      });
    }
  };

  // Sign up with email, password, and username
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username,
              email,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }
      
      setState({
        ...state,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message || 'Failed to sign up',
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Auth state listener will update the state
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message || 'Failed to sign out',
      });
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setState({
        ...state,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message || 'Failed to reset password',
      });
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      if (!state.user) {
        throw new Error('User not authenticated');
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          avatar_url: data.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);
      
      if (error) throw error;
      
      // Update local state
      setState({
        ...state,
        user: { ...state.user, ...data },
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message || 'Failed to update profile',
      });
    }
  };

  // Provide auth context value
  const contextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC for protected routes
export function withAuth(Component: React.ComponentType<any>) {
  return function WithAuth(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
      return <div>Redirecting to login...</div>;
    }
    
    return <Component {...props} />;
  };
} 