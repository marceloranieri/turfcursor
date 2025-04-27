import logger from '@/lib/logger';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import { FaGoogle, FaFacebook, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useConfetti } from '@/lib/auth/authEffects';

const SignInPage = () => {
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();
  const { ConfettiComponent } = useConfetti();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (error: any) {
      logger.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    try {
      await signInWithOAuth(provider);
    } catch (error: any) {
      logger.error('OAuth sign in error:', error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4 fade-slide-up">
      {ConfettiComponent && <ConfettiComponent />}
      
      <div className="bg-background-secondary rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Welcome back to Turf</h1>
        
        {!isEmailMode ? (
          <div className="space-y-4">
            <DiscordButton
              onClick={() => handleOAuthSignIn('google')}
              fullWidth
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100"
            >
              <FaGoogle className="text-xl" />
              Continue with Google
            </DiscordButton>
            
            <DiscordButton
              onClick={() => handleOAuthSignIn('facebook')}
              fullWidth
              className="flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#0d6efd]"
            >
              <FaFacebook className="text-xl" />
              Continue with Facebook
            </DiscordButton>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-secondary text-text-secondary">Or</span>
              </div>
            </div>
            
            <DiscordButton
              onClick={() => setIsEmailMode(true)}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <FaEnvelope className="text-xl" />
              Continue with Email
            </DiscordButton>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <DiscordInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
            
            <div className="form-group">
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="text-text-secondary text-sm">Password</label>
                <Link href="/auth/forgot-password" className="text-accent-secondary text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <DiscordInput
                label=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="password-dots"
              />
            </div>
            
            <div className="flex gap-3">
              <DiscordButton
                type="button"
                onClick={() => setIsEmailMode(false)}
                className="flex-1"
                variant="secondary"
              >
                Back
              </DiscordButton>
              
              <DiscordButton
                type="submit"
                className="flex-1"
                isLoading={isLoading}
              >
                Sign In
              </DiscordButton>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center text-text-secondary text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-accent-secondary hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 