import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useToast } from './ToastContext';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { showToast } = useToast();

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Update theme when it changes
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast({
      message: `Switched to ${newTheme} mode`,
      type: 'info',
      duration: 2000
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-background-tertiary transition-colors focus-ring"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-text-primary" />
      ) : (
        <SunIcon className="w-5 h-5 text-text-primary" />
      )}
    </button>
  );
}; 