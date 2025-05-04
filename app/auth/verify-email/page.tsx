'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLogger } from '@/lib/logger';
import { supabase } from '@/lib/supabase/client';

const logger = createLogger('VerifyEmailPage');

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Check if we have a pending verification flag
        const pendingVerification = localStorage.getItem('pendingVerification');
        if (!pendingVerification) {
          router.push('/auth/signin');
          return;
        }

        // Check the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user?.email_confirmed_at) {
          // User is verified
          setIsVerified(true);
          localStorage.removeItem('pendingVerification');
          
          // Redirect to dashboard after a delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          // User is not yet verified
          setIsVerified(false);
        }
      } catch (error: any) {
        logger.error('Verification check error:', error);
        setError(error.message || 'An error occurred while checking verification status');
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Email Verification
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Please verify your email address to continue
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Checking verification status...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isVerified ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Email verified successfully! Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>Please check your email and click the verification link.</p>
            <p className="mt-2 text-sm">
              If you haven't received the email, check your spam folder or{' '}
              <button
                onClick={() => router.push('/auth/signup')}
                className="text-accent-primary hover:text-accent-primary-dark font-medium"
              >
                try signing up again
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
