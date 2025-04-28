'use client';

import { useState, FC } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import SignInModal from '@/components/auth/SignInModal';
import { useRouter } from 'next/navigation';

interface GuestModeReturn {
  isGuest: boolean;
  isSignInModalOpen: boolean;
  openSignInModal: (path?: string) => void;
  closeSignInModal: () => void;
  handleGuestAction: (action: () => void, path?: string) => void;
  SignInModalComponent: any;
}

export const useGuestMode = (): GuestModeReturn => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/chat');

  const openSignInModal = (path?: string) => {
    if (path) {
      setRedirectPath(path);
    }
    // Store the redirect path in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterAuth', redirectPath);
    }
    // Redirect to sign-in page instead of showing modal
    router.push('/auth/signin');
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