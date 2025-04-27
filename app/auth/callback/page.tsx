'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { handleAuthSuccess } from '@/lib/auth/authEffects';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the redirect path from session storage
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/chat';
        
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Success - play success sound and show toast
          handleAuthSuccess('signin');
          
          // Clear the redirect path from session storage
          sessionStorage.removeItem('redirectAfterLogin');
          
          // Redirect to the intended page
          router.push(redirectPath);
        } else {
          // No session - something went wrong
          toast.error('Authentication failed. Please try again.');
          router.push('/auth/signin');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication error. Please try again.');
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 fade-slide-up">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Completing Sign In</h1>
        <p className="text-text-secondary mb-6">
          {isLoading ? 'Please wait while we complete your sign in...' : 'Redirecting you...'}
        </p>
        {isLoading && (
          <div className="flex justify-center">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
} 