'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useConfetti } from '@/lib/auth/authEffects';
import { Github, Chrome } from 'lucide-react';

interface SignInModalProps {
  onClose: () => void;
  isLoading?: boolean;
}

export default function SignInModal({ onClose, isLoading = false }: SignInModalProps) {
  const router = useRouter();
  const { signInWithOAuth } = useAuth();
  const triggerConfetti = useConfetti();

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      await signInWithOAuth(provider);
      triggerConfetti();
      onClose();
    } catch (error) {
      console.error('OAuth sign in failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-slide-up">
      <div className="bg-background-secondary rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-text-primary">Sign In</h2>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#24292e] text-white rounded hover:bg-[#2f363d] transition-colors"
            disabled={isLoading}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={() => handleOAuthSignIn('google')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 text-[#4285f4]" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
} 