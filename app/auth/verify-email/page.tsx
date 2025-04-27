'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user.email_confirmed_at) {
          // Email is already verified, redirect to chat
          router.push('/chat');
          return;
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        setError(error.message || 'Failed to check email verification status.');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: (await supabase.auth.getUser()).data.user?.email || '',
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Resend email error:', error);
      setError(error.message || 'Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          Verify your email
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-text-secondary">{error}</p>
            <button
              onClick={handleResendEmail}
              className="text-accent-primary hover:text-accent-primary-dark"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-text-secondary">
              We've sent a verification email to your inbox. Please check your email and click the verification link to continue.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                className="text-accent-primary hover:text-accent-primary-dark"
              >
                Resend verification email
              </button>
              <p className="text-sm text-text-secondary">
                Already verified?{' '}
                <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 