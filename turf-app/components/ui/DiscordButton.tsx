import React from 'react';

interface DiscordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const DiscordButton: React.FC<DiscordButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors duration-200';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variantStyles = {
    primary: 'bg-[var(--primary-blue)] hover:brightness-110 text-white',
    secondary: 'bg-[var(--input-bg)] hover:brightness-110 text-[var(--text-normal)]',
    danger: 'bg-[var(--red)] hover:brightness-110 text-white'
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`
        ${baseStyles}
        ${widthStyles}
        ${variantStyles[variant]}
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default DiscordButton; 