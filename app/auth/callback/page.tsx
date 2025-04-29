'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { handleAuthSuccess } from '@/lib/auth/authEffects';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OAuthCallbackPage(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the redirect path from session storage
        const redirectPath = sessionStorage.getItem('redirectAfterAuth') || '/chat';
        
        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session) {
          // Success - play success sound and show toast
          handleAuthSuccess('signin');
          
          // Check if we need to restore settings state
          const settingsState = sessionStorage.getItem('settingsState');
          if (settingsState) {
            // We're coming back from GitHub OAuth in settings
            sessionStorage.removeItem('settingsState');
            router.push('/settings');
            return;
          }
          
          // Clear the redirect path from session storage
          sessionStorage.removeItem('redirectAfterAuth');
          
          // Redirect to the intended page
          router.push(redirectPath);
        } else {
          // No session - something went wrong
          setError('Authentication failed. Please try again.');
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'Authentication error. Please try again.');
        toast.error(error.message || 'Authentication error. Please try again.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          {error ? 'Authentication Error' : 'Completing Sign In'}
        </h1>
        <p className="text-text-secondary mb-6">
          {error || (isLoading ? 'Please wait while we complete your sign in...' : 'Redirecting you...')}
        </p>
        {isLoading && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    </div>
  );
} 