'use client';

import { IconType } from 'react-icons';
import { toast } from 'react-hot-toast';

interface GuestAwareReactionButtonProps {
  onClick: () => void;
  isGuest: boolean;
  icon: IconType;
  className?: string;
  children?: React.ReactNode;
}

export const GuestAwareReactionButton: React.FC<GuestAwareReactionButtonProps> = ({
  onClick,
  isGuest,
  icon: Icon,
  className = '',
  children,
}) => {
  const handleClick = () => {
    if (isGuest) {
      toast.error('Please sign in to add reactions');
      return;
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${className}`}
      aria-label="Add reaction"
    >
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      {children}
    </button>
  );
};

export default GuestAwareReactionButton; 