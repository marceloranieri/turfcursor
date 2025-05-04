'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ResetPasswordPage');

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          logger.warn('No session found during password reset');
          router.push('/auth/signin');
          return;
        }

        setLoading(false);
      } catch (error: any) {
        logger.error('Error checking session:', error);
        setError('An error occurred while checking your session');
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (resetError) {
        throw resetError;
      }

      logger.info('Password reset successful');
      setSuccess(true);
      
      // Redirect to sign-in after a delay
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error: any) {
      logger.error('Password reset error:', error);
      setError(error.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Password reset successful! Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading
                  ? 'bg-accent-primary-dark cursor-not-allowed'
                  : 'bg-accent-primary hover:bg-accent-primary-dark'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
