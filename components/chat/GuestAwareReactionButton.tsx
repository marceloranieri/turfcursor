'use client';

import React, { useState } from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import { FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface GuestAwareReactionButtonProps {
  emoji: string;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const GuestAwareReactionButton: React.FC<GuestAwareReactionButtonProps> = ({
  emoji,
  count,
  isActive = false,
  onClick,
  className = '',
}) => {
  const { isGuest, handleGuestAction, SignInModalComponent } = useGuestMode();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isGuest && !isAnimating) {
      setIsAnimating(true);
      handleGuestAction(onClick, '/chat');
      setTimeout(() => setIsAnimating(false), 400); // Match animation duration
    } else {
      handleGuestAction(onClick, '/chat');
    }
  };

  return (
    <div className="relative">
      {SignInModalComponent}
      
      <motion.button
        onClick={handleClick}
        className={`group relative flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
          isActive
            ? 'bg-accent-secondary/20 text-accent-secondary'
            : 'bg-background-tertiary hover:bg-background-tertiary/80 text-text-primary'
        } ${isGuest ? 'opacity-70' : ''} ${className}`}
        disabled={isGuest}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
      >
        <span className="text-base">{emoji}</span>
        {count > 0 && (
          <motion.span
            key={count}
            className="text-xs"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {count}
          </motion.span>
        )}
        
        {isGuest && (
          <div className="absolute -top-1 -right-1">
            <FaLock className="text-accent-secondary text-xs" />
          </div>
        )}
      </motion.button>
    </div>
  );
}; 