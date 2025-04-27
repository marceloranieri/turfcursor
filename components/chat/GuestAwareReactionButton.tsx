'use client';

import React from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import { FaLock } from 'react-icons/fa';

interface GuestAwareReactionButtonProps {
  emoji: string;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

const GuestAwareReactionButton: React.FC<GuestAwareReactionButtonProps> = ({
  emoji,
  count,
  isActive = false,
  onClick,
  className = '',
}) => {
  const { isGuest, handleGuestAction, SignInModalComponent } = useGuestMode();

  const handleClick = () => {
    handleGuestAction(onClick, '/chat');
  };

  return (
    <div className="relative">
      {SignInModalComponent}
      
      <button
        onClick={handleClick}
        className={`group relative flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
          isActive
            ? 'bg-accent-secondary/20 text-accent-secondary'
            : 'bg-background-tertiary hover:bg-background-tertiary/80 text-text-primary'
        } ${isGuest ? 'opacity-70' : ''} ${className}`}
        disabled={isGuest}
      >
        <span className="text-base">{emoji}</span>
        <span className="text-xs">{count > 0 ? count : ''}</span>
        
        {isGuest && (
          <div className="absolute -top-1 -right-1">
            <FaLock className="text-accent-secondary text-xs" />
          </div>
        )}
      </button>
    </div>
  );
};

export default GuestAwareReactionButton; 