import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

/**
 * Hook to protect routes that require authentication
 * @param redirectUrl The URL to redirect to if not authenticated
 * @returns The current user and loading state
 */
export function useRequireAuth(redirectUrl = '/auth/signin') {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth is initialized to avoid flickering
    if (isInitialized && !isLoading && !user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, isInitialized, router, redirectUrl]);

  return { user, isLoading };
} 