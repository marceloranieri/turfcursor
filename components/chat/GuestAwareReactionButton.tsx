'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import dynamic from 'next/dynamic';

const SignInModal = dynamic(() => import('@/components/auth/SignInModal'), {
  loading: () => <div>Loading...</div>,
});

interface GuestAwareReactionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function GuestAwareReactionButton({
  onClick,
  children,
  className = '',
}: GuestAwareReactionButtonProps) {
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleClick = () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }
    onClick();
  };

  return (
    <div className="relative">
      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} />
      )}
      <button
        onClick={handleClick}
        className={`${className} ${!user ? 'opacity-50' : ''}`}
      >
        {children}
      </button>
    </div>
  );
} 