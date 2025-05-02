'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase/browser-client';
import { createLogger } from '@/lib/logger';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const logger = createLogger('AuthProvider');

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowser();

      // Get initial session
      const initializeAuth = async () => {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          
          setUser(session?.user ?? null);
          logger.info('Auth initialized:', { user: session?.user?.email });
        } catch (error) {
          logger.error('Error initializing auth:', error);
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      };

      initializeAuth();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Mark as client-side rendered
      setIsClient(true);

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      logger.error('Error in auth provider:', error);
      setError(error as Error);
      setLoading(false);
    }
  }, []);

  // Show loading state
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-text-secondary mb-4">
            We encountered an error while initializing authentication. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 bg-background-tertiary rounded text-sm overflow-auto">
              {error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 