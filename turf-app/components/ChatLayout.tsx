'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { HomeIcon, UserIcon, CogIcon, ChatIcon, LogoutIcon } from '@heroicons/react/outline';
import { Circle } from '../lib/supabase/client';
import NotificationCenter from './NotificationCenter';

// Dynamically import the AuthModal to avoid SSR issues
const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });

interface ChatLayoutProps {
  children: React.ReactNode;
  circles: Circle[];
  activeCircleId: string;
  onCircleChange: (circleId: string) => void;
  isAuthenticated: boolean;
  username?: string;
  harmonyPoints?: number;
  isDebateMaestro?: boolean;
  geniusAwardsRemaining?: number;
  notifications: Array<{
    id: string;
    type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general';
    message: string;
    wizNote?: string;
    timestamp: Date;
    read: boolean;
  }>;
}

export default function ChatLayout({
  children,
  circles,
  activeCircleId,
  onCircleChange,
  isAuthenticated,
  username = 'Guest',
  harmonyPoints = 0,
  isDebateMaestro = false,
  geniusAwardsRemaining = 0,
  notifications = [],
}: ChatLayoutProps) {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  
  const handleProfile = () => {
    router.push('/profile');
  };
  
  const handleSettings = () => {
    router.push('/settings');
  };
  
  const handleLogout = () => {
    // In a real app, this would sign out the user with Supabase
    // supabase.auth.signOut().then(() => {
    router.push('/');
    // });
  };
  
  const handleMarkNotificationAsRead = (id: string) => {
    setLocalNotifications(
      localNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const handleClearAllNotifications = () => {
    setLocalNotifications([]);
  };
  
  return (
    <div className="app-container">
      {/* Left sidebar - icons only */}
      <div className="sidebar hidden md:flex flex-col items-center py-4 space-y-6">
        <button 
          onClick={() => router.push('/')}
          className="p-2 rounded-full hover:bg-background-secondary text-text-primary focus:outline-none"
        >
          <HomeIcon className="w-6 h-6" />
        </button>
        
        <div className="flex-1"></div>
        
        <button 
          onClick={handleProfile}
          className="p-2 rounded-full hover:bg-background-secondary text-text-primary focus:outline-none"
        >
          <UserIcon className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleSettings}
          className="p-2 rounded-full hover:bg-background-secondary text-text-primary focus:outline-none"
        >
          <CogIcon className="w-6 h-6" />
        </button>
        
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-background-secondary text-text-primary focus:outline-none"
          >
            <LogoutIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Channel list */}
      <div className="channel-list hidden md:block p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Circles</h2>
          <ul className="space-y-1">
            {circles.map((circle) => (
              <li key={circle.id}>
                <button
                  onClick={() => onCircleChange(circle.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-background-tertiary transition-colors ${
                    activeCircleId === circle.id
                      ? 'bg-accent-primary bg-opacity-10 text-accent-primary font-medium'
                      : 'text-text-secondary'
                  }`}
                >
                  # {circle.topic}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {isAuthenticated && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-background-tertiary rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white font-semibold mr-3">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-text-primary">
                    {username}
                    {isDebateMaestro && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold text-background">
                        Maestro
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-muted">
                    <span className="text-accent-primary">{harmonyPoints}</span> harmony points
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="chat-area overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-background-tertiary bg-background-secondary">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-lg font-bold text-text-primary">
              {circles.find(c => c.id === activeCircleId)?.topic || 'Chat'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <div className="hidden sm:block text-sm text-text-secondary">
                  <span className="text-accent-primary font-medium">{geniusAwardsRemaining}</span> Genius Awards left
                </div>
                
                <NotificationCenter
                  notifications={localNotifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onClearAll={handleClearAllNotifications}
                />
              </>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={() => handleOpenAuth('signin')}
                className="button-primary text-sm py-1 px-3"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-background-tertiary">
                <h2 className="text-lg font-bold text-text-primary">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-primary focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {isAuthenticated && (
                  <div className="mb-6 p-4 bg-background-tertiary rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center text-white font-semibold mr-3">
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary text-lg">
                          {username}
                          {isDebateMaestro && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold text-background">
                              Maestro
                            </span>
                          )}
                        </div>
                        <div className="text-text-muted">
                          <span className="text-accent-primary">{harmonyPoints}</span> harmony points
                        </div>
                        <div className="text-text-muted mt-1">
                          <span className="text-gold">{geniusAwardsRemaining}</span> Genius Awards left
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-text-primary">Circles</h3>
                  <ul className="space-y-1">
                    {circles.map((circle) => (
                      <li key={circle.id}>
                        <button
                          onClick={() => {
                            onCircleChange(circle.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeCircleId === circle.id
                              ? 'bg-accent-primary bg-opacity-10 text-accent-primary font-medium'
                              : 'text-text-secondary hover:bg-background-tertiary'
                          }`}
                        >
                          # {circle.topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleProfile();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center p-3 rounded-md hover:bg-background-tertiary text-text-primary"
                  >
                    <UserIcon className="w-5 h-5 mr-3" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      handleSettings();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center p-3 rounded-md hover:bg-background-tertiary text-text-primary"
                  >
                    <CogIcon className="w-5 h-5 mr-3" />
                    Settings
                  </button>
                  
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center p-3 rounded-md hover:bg-background-tertiary text-text-primary"
                    >
                      <LogoutIcon className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleOpenAuth('signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center p-3 rounded-md bg-accent-primary text-white"
                    >
                      <LogoutIcon className="w-5 h-5 mr-3" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat messages and input */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="mobile-nav md:hidden">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center justify-center text-text-muted hover:text-text-primary"
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center text-text-muted hover:text-text-primary"
        >
          <ChatIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Circles</span>
        </button>
        
        <button
          onClick={handleProfile}
          className="flex flex-col items-center justify-center text-text-muted hover:text-text-primary"
        >
          <UserIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
        
        <button
          onClick={handleSettings}
          className="flex flex-col items-center justify-center text-text-muted hover:text-text-primary"
        >
          <CogIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
} 