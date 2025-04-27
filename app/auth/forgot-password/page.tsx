import logger from '@/lib/logger';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success('📩 Reset link sent! Check your inbox.');
    } catch (error: any) {
      logger.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 fade-slide-up">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full">
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center text-accent-secondary hover:underline mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Sign In
        </Link>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Reset Password</h1>
        <p className="text-text-secondary mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {isSubmitted ? (
          <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-md p-4 mb-4">
            <h2 className="font-semibold mb-2">Check your email</h2>
            <p className="text-sm">
              We've sent a password reset link to <span className="font-medium">{email}</span>. 
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm mt-2">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="text-accent-secondary hover:underline"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <DiscordInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
            
            <DiscordButton
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Send Reset Link
            </DiscordButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 