'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const logger = createLogger('VerifyEmailPage');

export default function VerifyEmailPage(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user?.email_confirmed_at) {
          logger.info('Email already verified', { userId: session.user.id });
          setVerificationStatus('verified');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          // Check if we're coming from a verification link
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;
          
          if (user?.email_confirmed_at) {
            logger.info('Email verified via link', { userId: user.id });
            setVerificationStatus('verified');
            setTimeout(() => {
              router.push('/');
            }, 3000);
          } else {
            logger.info('Email verification pending', { userId: user?.id });
            setVerificationStatus('pending');
          }
        }
      } catch (error: any) {
        logger.error('Verification check error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Failed to check verification status');
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [router]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user?.email) {
        throw new Error('No email address found');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      logger.info('Verification email resent');
      setErrorMessage(null);
    } catch (error: any) {
      logger.error('Resend verification error:', error);
      setErrorMessage(error.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          {verificationStatus === 'verified' ? 'Email Verified!' : 'Verify Your Email'}
        </h1>

        {verificationStatus === 'verified' ? (
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              Your email has been successfully verified. Redirecting you to the home page...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="mt-4 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Resend Verification Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
