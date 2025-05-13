'use client';

import { FaDiscord } from 'react-icons/fa';

interface DiscordButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const variantStyles = {
  primary: 'bg-discord hover:bg-discord-dark text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
};

export const DiscordButton: React.FC<DiscordButtonProps> = ({
  onClick,
  className = '',
  children,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
    >
      <FaDiscord className="w-5 h-5" />
      {children || 'Connect with Discord'}
    </button>
  );
};

export default DiscordButton; 