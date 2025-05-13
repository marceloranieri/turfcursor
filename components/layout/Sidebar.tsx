'use client';

import logger from '@/lib/logger';

import React, { useState, useEffect, createElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { FaHome, FaComments, FaUser, FaCog, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { supabase } from '@/lib/supabase/client';
import type { IconType } from 'react-icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const renderIcon = (Icon: IconType, className: string) => {
  const IconComponent = Icon as React.FC<{ className: string }>;
  return <IconComponent className={className} />;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<{ avatar_url?: string } | null>(null);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/chat', label: 'Chat', icon: FaComments },
    { href: '/profile', label: 'Profile', icon: FaUser },
    { href: '/settings', label: 'Settings', icon: FaCog },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error('Error signing out:', error);
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
                src={userProfile?.avatar_url || '/default-avatar.png'}
                alt={user?.email || 'User'}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-background-tertiary"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">
                  {user?.email?.split('@')[0] || 'Guest'}
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
                  {renderIcon(item.icon, "w-5 h-5")}
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
                  {renderIcon(FaSun, "w-5 h-5")}
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  {renderIcon(FaMoon, "w-5 h-5")}
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
                {renderIcon(FaSignOutAlt, "w-5 h-5")}
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
        {isOpen ? renderIcon(FaTimes, "w-5 h-5") : renderIcon(FaBars, "w-5 h-5")}
      </button>
    </>
  );
}; 