import React from 'react';

export interface DiscordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const DiscordButton: React.FC<DiscordButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-discord-blue hover:bg-discord-blue-dark text-white',
    secondary: 'bg-discord-gray hover:bg-discord-gray-dark text-white',
    danger: 'bg-discord-red hover:bg-discord-red-dark text-white'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-75 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default DiscordButton; 