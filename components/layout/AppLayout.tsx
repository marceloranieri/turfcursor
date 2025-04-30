'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import DiscordButton from '@/components/ui/DiscordButton';
import Image from 'next/image';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general';
    message: string;
    wizNote?: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleClearAll = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-[var(--dark-background)]">
      {/* Left Sidebar - Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-[var(--channel-bg)] border-r border-[var(--divider)]">
        <div className="p-4 border-b border-[var(--divider)]">
          <h1 className="text-2xl font-bold text-[var(--header-primary)]">Turf</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <Link
            href="/"
            className="block p-2 rounded text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
          >
            Home
          </Link>
          <Link
            href="/topics"
            className="block p-2 rounded text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
          >
            Topics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 bg-[var(--channel-bg)] border-b border-[var(--divider)]">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-normal)]"
          >
            ☰
          </button>

          <div className="flex items-center gap-4">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded hover:bg-[var(--channel-hover)]"
              >
                <Image
                  src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-[var(--text-normal)]">
                  {user?.user_metadata?.username || 'User'}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--channel-bg)] rounded-lg shadow-xl z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-[var(--red)] hover:bg-[var(--channel-hover)]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--channel-bg)] border-b border-[var(--divider)]">
            <nav className="p-4">
              <Link
                href="/"
                className="block p-2 rounded text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
              >
                Home
              </Link>
              <Link
                href="/topics"
                className="block p-2 rounded text-[var(--text-normal)] hover:bg-[var(--channel-hover)]"
              >
                Topics
              </Link>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--dark-background)]">
          {children}
        </main>
      </div>

      {/* Right Sidebar - User List & Info */}
      <div className="hidden lg:flex flex-col w-64 bg-[var(--channel-bg)] border-l border-[var(--divider)]">
        <div className="p-4 border-b border-[var(--divider)]">
          <h2 className="text-lg font-semibold text-[var(--header-primary)]">
            Online Users
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* User list would go here */}
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 