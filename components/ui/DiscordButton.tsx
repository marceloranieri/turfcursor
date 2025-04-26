'use client';

interface DiscordButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function DiscordButton({
  children,
  type = 'button',
  fullWidth = false,
  isLoading = false,
  onClick,
  disabled = false
}: DiscordButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        px-4 py-2
        bg-[var(--primary-blue)]
        hover:bg-[var(--primary-blue-hover)]
        text-white
        font-medium
        rounded-md
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex
        items-center
        justify-center
      `}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
} 