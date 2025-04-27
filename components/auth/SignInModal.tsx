import logger from '@/lib/logger';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import DiscordButton from '@/components/ui/DiscordButton';
import { FaGoogle, FaFacebook, FaEnvelope, FaTimes } from 'react-icons/fa';
import { useConfetti } from '@/lib/auth/authEffects';
import { toast } from 'react-hot-toast';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, redirectPath = '/chat' }) => {
  const router = useRouter();
  const { signInWithOAuth } = useAuth();
  const { ConfettiComponent } = useConfetti();
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      // Store the redirect path in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterAuth', redirectPath);
      }
      
      const { error } = await signInWithOAuth(provider);
      if (error) {
        toast.error('Failed to sign in. Please try again.');
        return;
      }
      // Don't close modal - OAuth will redirect
    } catch (error: any) {
      logger.error('OAuth sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Store the redirect path in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterAuth', redirectPath);
      }
      
      // Always redirect to sign in page
      router.push('/auth/signin');
      onClose();
    } catch (error: any) {
      logger.error('Sign in error:', error);
      toast.error('Failed to redirect to sign in page.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-slide-up">
      {ConfettiComponent && <ConfettiComponent />}
      
      <div className="bg-background-secondary rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        
        <h2 className="text-xl font-bold text-text-primary mb-4 text-center">Sign in to continue</h2>
        <p className="text-text-secondary mb-6 text-center">
          Sign in to join the conversation and share your voice!
        </p>
        
        {!isEmailMode ? (
          <div className="space-y-3">
            <DiscordButton
              onClick={() => handleOAuthSignIn('google')}
              fullWidth
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100"
              isLoading={isLoading}
            >
              <FaGoogle className="text-xl" />
              Continue with Google
            </DiscordButton>
            
            <DiscordButton
              onClick={() => handleOAuthSignIn('facebook')}
              fullWidth
              className="flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#0d6efd]"
              isLoading={isLoading}
            >
              <FaFacebook className="text-xl" />
              Continue with Facebook
            </DiscordButton>
            
            <div className="relative my-4">
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
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <p className="text-text-secondary text-sm mb-4">
              You'll be redirected to the sign in page to complete the process.
            </p>
            
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
                Continue
              </DiscordButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInModal; 