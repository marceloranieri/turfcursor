'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { FaHome, FaComments, FaUser, FaCog, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/chat', label: 'Chat', icon: FaComments },
    { href: '/profile', label: 'Profile', icon: FaUser },
    { href: '/settings', label: 'Settings', icon: FaCog },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User profile section */}
          <div className="p-4 border-b border-background-tertiary">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary transition-colors"
            >
              <Image
                src={user?.avatar_url || '/default-avatar.png'}
                alt={user?.username || 'User'}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-background-tertiary"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">
                  {user?.username || 'Guest'}
                </h3>
                <p className="text-sm text-text-secondary truncate">
                  {user?.email || 'Sign in to chat'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-secondary text-white'
                      : 'text-text-secondary hover:bg-background-tertiary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-background-tertiary space-y-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 p-2 w-full rounded-lg text-text-secondary hover:bg-background-tertiary transition-colors"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? (
                <>
                  <FaSun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Sign out */}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 p-2 w-full rounded-lg text-text-secondary hover:bg-background-tertiary transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
        onClick={() => onClose()}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>
    </>
  );
}; 