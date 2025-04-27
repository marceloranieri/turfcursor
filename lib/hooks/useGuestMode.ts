'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import SignInModal from '@/components/auth/SignInModal';

export const useGuestMode = () => {
  const { user } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/chat');

  const openSignInModal = (path?: string) => {
    if (path) {
      setRedirectPath(path);
    }
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleGuestAction = (action: () => void, path?: string) => {
    if (user) {
      action();
    } else {
      openSignInModal(path);
    }
  };

  return {
    isGuest: !user,
    isSignInModalOpen,
    openSignInModal,
    closeSignInModal,
    handleGuestAction,
    SignInModalComponent: (
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeSignInModal} 
        redirectPath={redirectPath} 
      />
    )
  };
}; 