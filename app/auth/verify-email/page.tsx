'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLogger } from '@/lib/logger';
import { supabase } from '@/lib/supabase/client';
import { FormInput } from '@/components/auth/FormInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import AuthLayout from '@/components/auth/AuthLayout';
import Link from 'next/link';

const logger = createLogger('VerifyEmailPage');

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const checkVerification = async () => {
    try {
      const pendingVerification = localStorage.getItem('pendingVerification');
      if (!pendingVerification) {
        router.push('/auth/signin');
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (session?.user?.email_confirmed_at) {
        setIsVerified(true);
        localStorage.removeItem('pendingVerification');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setIsVerified(false);
      }
    } catch (error: any) {
      logger.error('Verification check error:', error);
      setError(error.message || 'An error occurred while checking verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: localStorage.getItem('pendingEmail') || '',
      });

      if (error) {
        throw error;
      }

      setResendSuccess(true);
      logger.info('Verification email resent successfully');
    } catch (error: any) {
      logger.error('Error resending verification:', error);
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    checkVerification();
  }, [router]);

  return (
    <AuthLayout 
      title="Verify Your Email"
      description="Please verify your email address to continue using Turf."
      rightSideContent={{
        title: "Almost There!",
        description: "We've sent a verification link to your email. Click it to complete your registration."
      }}
    >
      <div className="w-full max-w-md">
        {error && <ErrorMessage error={error} />}
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Checking verification status...</p>
          </div>
        ) : isVerified ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p>Email verified successfully! Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              <p>Please check your email and click the verification link.</p>
              <p className="mt-2 text-sm">
                If you haven't received the email, check your spam folder.
              </p>
            </div>

            <div className="space-y-4">
              <SubmitButton 
                loading={resendLoading} 
                loadingText="Resending..."
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </SubmitButton>

              {resendSuccess && (
                <p className="text-sm text-green-600 text-center">
                  Verification email resent successfully!
                </p>
              )}

              <p className="text-sm text-center text-text-secondary">
                Need help?{' '}
                <Link href="/support" className="text-accent-primary hover:text-accent-primary-dark">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
