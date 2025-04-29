'use client';

import { FaDiscord } from 'react-icons/fa';

interface DiscordButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DiscordButton: React.FC<DiscordButtonProps> = ({
  onClick,
  className = '',
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-discord hover:bg-discord-dark text-white rounded-lg transition-colors ${className}`}
    >
      <FaDiscord className="w-5 h-5" />
      {children || 'Connect with Discord'}
    </button>
  );
};

export default DiscordButton; 