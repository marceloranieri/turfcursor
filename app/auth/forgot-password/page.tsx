'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Reset your password
        </h1>

        {isSubmitted ? (
          <div className="space-y-6">
            <p className="text-text-secondary text-center">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your password.
            </p>
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-accent-primary hover:text-accent-primary-dark"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Send reset instructions'}
            </button>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-accent-primary hover:text-accent-primary-dark"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}

        <p>Don&apos;t worry, we&apos;ll help you reset your password.</p>
      </div>
    </div>
  );
} 