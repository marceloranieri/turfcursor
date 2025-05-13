import React from 'react';
import '@/app/styles/discord-theme.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <div className="discord-theme min-h-screen flex items-center justify-center bg-[var(--dark-background)] p-4">
      <div className="w-full max-w-md bg-[var(--channel-bg)] rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--header-primary)] mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 