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

const SignUpPage = () => {
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();
  const { ConfettiComponent, setShowConfetti } = useConfetti();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error, user } = await signUp(email, password, username);
      if (error) throw error;
      
      if (user) {
        setShowConfetti(true);
        toast.success('Account created successfully!');
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      logger.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'facebook') => {
    try {
      await signInWithOAuth(provider);
    } catch (error: any) {
      logger.error('OAuth sign up error:', error);
      toast.error(error.message || `Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4 fade-slide-up">
      {ConfettiComponent && <ConfettiComponent />}
      
      <div className="bg-background-secondary rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Join Turf</h1>
        
        {!isEmailMode ? (
          <div className="space-y-4">
            <DiscordButton
              onClick={() => handleOAuthSignUp('google')}
              fullWidth
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100"
            >
              <FaGoogle className="text-xl" />
              Continue with Google
            </DiscordButton>
            
            <DiscordButton
              onClick={() => handleOAuthSignUp('facebook')}
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
          <form onSubmit={handleSignUp} className="space-y-4">
            <DiscordInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
            
            <DiscordInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
            
            <DiscordInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="password-dots"
            />
            
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
                Sign Up
              </DiscordButton>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center text-text-secondary text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-accent-secondary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 