'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if we have a valid session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Invalid or expired reset link');
        router.push('/auth/signin');
      }
    };

    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      router.push('/auth/signin');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsValid(password.length >= 8 && password === confirmPassword);
  }, [password, confirmPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Set new password
        </h1>

        <p>Don&apos;t worry, we&apos;ll help you reset your password.</p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              required
              minLength={8}
            />
            <p className="mt-1 text-sm text-text-secondary">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full py-2 px-4 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 