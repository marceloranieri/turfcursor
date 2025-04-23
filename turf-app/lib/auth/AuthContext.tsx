'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';

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
  updateProfile: (data: {username?: string, avatar_url?: string}) => Promise<{error: Error | null}>;
};

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error.message);
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
        console.error('Unexpected error during auth initialization:', error);
        setState({
          ...initialState,
          isLoading: false,
          isInitialized: true,
        });
      }
    };

    initialize();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setState(prevState => ({
          ...prevState,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error: new AuthError('An unexpected error occurred') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error, user: null };
      }

      // If successful, create the user profile in the users table
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          username,
          email,
          created_at: new Date().toISOString(),
          harmony_points: 0,
          genius_awards_received: 0,
          genius_awards_remaining: 5,
          is_debate_maestro: false
        });

        if (profileError) {
          toast.error(`Profile creation failed: ${profileError.message}`);
          return { error: new AuthError('Profile creation failed'), user: data.user };
        }

        toast.success('Account created successfully!');
        return { error: null, user: data.user };
      }

      return { error: null, user: data.user };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      toast.error('An unexpected error occurred during sign up');
      return { error: new AuthError('An unexpected error occurred'), user: null };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
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
      console.error('Error resetting password:', error);
      toast.error('Failed to send password reset email');
      return { error: new AuthError('Failed to send password reset email') };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (data: {username?: string, avatar_url?: string}) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      if (!state.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', state.user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      return { error };
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
    updateProfile,
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