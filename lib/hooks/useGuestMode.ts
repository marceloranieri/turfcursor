import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import SignInModal from '@/components/auth/SignInModal';

export function useGuestMode() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleGuestAction = useCallback((callback?: () => void) => {
    if (showSignInModal) {
      callback?.();
    } else {
      setShowSignInModal(true);
    }
  }, [showSignInModal]);

  const closeSignInModal = useCallback(() => {
    setShowSignInModal(false);
  }, []);

  return {
    isGuest: !user,
    showSignInModal,
    SignInModalComponent: SignInModal,
    closeSignInModal,
    handleGuestAction,
  };
}
