import logger from '@/lib/logger';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword, resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setIsExpired(true);
      setError('Invalid or expired reset link');
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = searchParams.get('token');
      if (!token) throw new Error('No reset token found');

      const { error } = await updatePassword(token, password);
      if (error) throw error;
    } catch (error: any) {
      logger.error('Password reset error:', error);
      setError(error.message || 'Failed to reset password');
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    setIsLoading(true);
    try {
      const email = searchParams.get('email');
      if (!email) {
        setError('Email address not found');
        return;
      }
      await resetPassword(email);
      toast.success('New reset link sent! Please check your email.');
    } catch (error: any) {
      setError(error.message || 'Failed to send new reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 fade-slide-up">
        <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Oops! Link Expired</h1>
          <p className="text-text-secondary mb-6">
            Looks like this reset link has expired. Don't worry, we can send you a new one!
          </p>
          <DiscordButton
            onClick={handleRequestNewLink}
            isLoading={isLoading}
            fullWidth
          >
            Send New Reset Link
          </DiscordButton>
          <div className="mt-4">
            <Link href="/auth/signin" className="text-accent-secondary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 fade-slide-up">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Set New Password</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <DiscordInput
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            className="password-dots"
          />
          
          <DiscordInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Type your password again"
            required
            className="password-dots"
          />
          
          <DiscordButton
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!!error}
          >
            Reset Password
          </DiscordButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 