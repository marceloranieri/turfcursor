// lib/auth/authEffects.ts

'use client';

import { toast } from 'react-hot-toast'
import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

// Sound effect for success (client-side only)
const SUCCESS_SOUND = typeof Audio !== 'undefined' ? new Audio('/sounds/success-chime.mp3') : null;

export const playSuccessSound = () => {
  if (SUCCESS_SOUND) {
    SUCCESS_SOUND.play().catch(() => {
      // Ignore if sound fails (e.g., user hasn't interacted to allow audio)
    });
  }
};

export const showSuccessToast = (message: string, emoji: string) => {
  toast.success(`${emoji} ${message}`);
};

// Hook to trigger confetti animation
export function useConfetti() {
  return useCallback(() => {
    const end = Date.now() + 1000;

    const colors = ['#ff0000', '#00ff00', '#0000ff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);
}

// Track login streak in localStorage (fun feature)
export function trackLoginCount() {
  const currentCount = parseInt(localStorage.getItem('turf-login-count') || '0', 10);
  const newCount = currentCount + 1;
  localStorage.setItem('turf-login-count', String(newCount));

  if (newCount === 5) {
    toast("You're on a roll! 🛹 5 logins in a row!", {
      icon: '🔥',
      duration: 4000
    });
  } else if (newCount === 10) {
    toast('Wow! 10 logins! You must really like us! 🎉', {
      icon: '🌟',
      duration: 4000
    });
    useConfetti()();
  }
}

// Call this on successful auth events to give user feedback
export function handleAuthSuccess(type: 'signin' | 'signup' | 'reset') {
  const launchConfetti = useConfetti();

  if (type === 'signup') {
    toast.success('Welcome to Turf! 🌱', {
      duration: 5000,
    });
    launchConfetti();
  }

  trackLoginCount();
}
