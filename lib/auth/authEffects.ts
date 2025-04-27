import { toast } from 'react-hot-toast';
import confetti from 'react-confetti';
import { useEffect, useState } from 'react';

const SUCCESS_SOUND = new Audio('/sounds/success-chime.mp3');

export const playSuccessSound = () => {
  SUCCESS_SOUND.play().catch(() => {
    // Ignore errors if sound can't be played
  });
};

export const showSuccessToast = (message: string, emoji: string) => {
  toast.success(`${emoji} ${message}`);
};

export const useConfetti = (duration = 3000) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), duration);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, duration]);

  return {
    showConfetti,
    setShowConfetti,
    ConfettiComponent: showConfetti ? confetti : null
  };
};

export const trackLoginStreak = () => {
  const loginCount = Number(localStorage.getItem('turf-login-count') || 0);
  const newCount = loginCount + 1;
  localStorage.setItem('turf-login-count', String(newCount));

  if (newCount === 5) {
    toast('You're on a roll! 🛹 5 logins in a row!', {
      icon: '🔥',
      duration: 4000
    });
  }
};

export const handleAuthSuccess = (type: 'signin' | 'signup' | 'reset') => {
  playSuccessSound();
  
  switch (type) {
    case 'signin':
      showSuccessToast('Successfully logged in', '✅');
      break;
    case 'signup':
      showSuccessToast('Welcome aboard!', '🎉');
      break;
    case 'reset':
      showSuccessToast('Password updated', '🔒');
      break;
  }
  
  trackLoginStreak();
}; 