// lib/auth/authEffects.ts

'use client';

import { createLogger } from '@/lib/logger';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { AuthError, AuthResponse } from '@supabase/supabase-js';

const logger = createLogger('AuthEffects');

// Sound effect for success (client-side only)
const SUCCESS_SOUND = typeof Audio !== 'undefined' ? new Audio('/sounds/success-chime.mp3') : null;

export const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.play().catch(err => {
    logger.error('Failed to play success sound', { error: err });
  });
};

export const showSuccessToast = (message: string) => {
  toast(message, {
    icon: '🎉',
    duration: 3000,
  });
};

// Hook to trigger confetti animation
export function useConfetti() {
  return () => {
    const end = Date.now() + 1000;

    const colors = ['#ff0000', '#00ff00', '#0000ff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };
}

// Track login attempts in localStorage
const LOGIN_COUNT_KEY = 'login_count';
const MAX_LOGIN_ATTEMPTS = 3;

// Function to track login count
export function trackLoginCount() {
  const count = parseInt(localStorage.getItem(LOGIN_COUNT_KEY) || '0', 10) + 1;
  localStorage.setItem(LOGIN_COUNT_KEY, count.toString());

  if (count >= MAX_LOGIN_ATTEMPTS) {
    toast.success('Welcome back! 🎉');
    localStorage.setItem(LOGIN_COUNT_KEY, '0');
  }
}

// Handle successful authentication
export function handleAuthSuccess(response: AuthResponse) {
  logger.info('Authentication successful');
  trackLoginCount();

  if (parseInt(localStorage.getItem(LOGIN_COUNT_KEY) || '0', 10) >= MAX_LOGIN_ATTEMPTS) {
    toast.success('Welcome back! 🎉');
  } else {
    toast.success('Successfully logged in!');
  }

  return response;
}

// Handle authentication errors
export function handleAuthError(error: AuthError | Error) {
  logger.error('Authentication error:', error);
  toast.error('Authentication failed. Please try again.');
  return error;
}
