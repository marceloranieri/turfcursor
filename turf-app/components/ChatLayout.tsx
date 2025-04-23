'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { HomeIcon, UserIcon, CogIcon, ChatIcon, LogoutIcon, PlusIcon, HashtagIcon } from '@heroicons/react/outline';
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
  
  const unreadNotificationsCount = localNotifications.filter(n => !n.read).length;
  
  return (
    <div className="app-container h-screen flex">
      {/* Left sidebar - server/app list */}
      <div className="sidebar w-16 flex-shrink-0 flex flex-col items-center py-4 space-y-6 bg-background-tertiary">
        <button 
          onClick={() => router.push('/')}
          className="w-12 h-12 rounded-full bg-background-secondary hover:bg-accent-primary text-text-primary hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none"
        >
          <HomeIcon className="w-6 h-6" />
        </button>
        
        <div className="w-8 h-0.5 bg-background-secondary/50 rounded-full my-2"></div>
        
        <button 
          className="w-12 h-12 rounded-2xl bg-background-secondary hover:bg-green-500 text-text-secondary hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none group relative"
          onClick={() => router.push('/chat')}
        >
          <span className="absolute -right-1 -top-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
            {unreadNotificationsCount > 0 ? (unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount) : ''}
          </span>
          <span className="absolute left-0 w-1 h-8 bg-white rounded-r-lg transform scale-0 group-hover:scale-100 transition-transform origin-left"></span>
          <span className="text-lg font-bold">T</span>
        </button>
        
        <div className="flex-1"></div>
        
        <button 
          onClick={handleProfile}
          className="p-2 rounded-full hover:bg-background-secondary text-text-secondary hover:text-white transition-colors duration-200 focus:outline-none"
        >
          <UserIcon className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleSettings}
          className="p-2 rounded-full hover:bg-background-secondary text-text-secondary hover:text-white transition-colors duration-200 focus:outline-none"
        >
          <CogIcon className="w-6 h-6" />
        </button>
        
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-background-secondary text-text-secondary hover:text-white transition-colors duration-200 focus:outline-none"
          >
            <LogoutIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Channel list */}
      <div className="channel-list hidden md:block w-60 flex-shrink-0 p-4 bg-background-secondary overflow-y-auto">
        <div className="sticky top-0 pt-2 pb-4 bg-background-secondary z-10">
          <h2 className="font-bold text-lg text-text-primary uppercase tracking-wide px-2">Turf Debates</h2>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Daily Debates</h3>
            <button className="text-text-secondary hover:text-text-primary">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <ul className="space-y-0.5">
            {circles.map((circle) => (
              <li key={circle.id}>
                <button
                  onClick={() => onCircleChange(circle.id)}
                  className={`w-full text-left px-2 py-1.5 rounded hover:bg-background/50 transition-colors flex items-center gap-2 ${
                    activeCircleId === circle.id
                      ? 'bg-background/30 text-text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  <HashtagIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{circle.topic}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-background-secondary/80 backdrop-blur-sm">
            <div className="bg-background rounded-md p-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-semibold mr-2 flex-shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-text-primary text-sm truncate flex items-center">
                  {username}
                  {isDebateMaestro && (
                    <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-gold text-background">
                      M
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  HP: <span className="text-accent-primary">{harmonyPoints}</span>
                </div>
              </div>
              <div className="text-xs font-medium bg-gold/20 text-gold px-1.5 py-0.5 rounded">
                {geniusAwardsRemaining}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="chat-area flex-1 overflow-hidden flex flex-col bg-background">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-background-tertiary">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-primary focus:outline-none"
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
              <NotificationCenter
                notifications={localNotifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onClearAll={handleClearAllNotifications}
              />
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
          <div className="md:hidden fixed inset-0 z-50 bg-background">
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
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Circles</h3>
                  <ul className="space-y-1">
                    {circles.map((circle) => (
                      <li key={circle.id}>
                        <button
                          onClick={() => {
                            onCircleChange(circle.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                            activeCircleId === circle.id
                              ? 'bg-background/30 text-text-primary'
                              : 'text-text-secondary hover:bg-background/20'
                          }`}
                        >
                          <HashtagIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{circle.topic}</span>
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
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-secondary border-t border-background-tertiary flex items-center justify-around px-4 z-30">
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