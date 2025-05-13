'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { format, isToday, isYesterday } from 'date-fns';

interface Notification {
  id: string;
  type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general';
  message: string;
  wizNote?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const formatNotificationTime = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'harmony_points':
        return (
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary">
            <span className="text-lg font-bold">HP</span>
          </div>
        );
      case 'genius_award':
        return (
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            <span className="text-lg font-bold">⭐</span>
          </div>
        );
      case 'pinned':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'wizard':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
            <span className="text-lg font-bold">🧙</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <span className="text-lg font-bold">i</span>
          </div>
        );
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-background-tertiary focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-background-secondary rounded-md shadow-lg z-50 border border-background-tertiary">
          <div className="p-3 border-b border-background-tertiary flex justify-between items-center">
            <h3 className="font-medium text-text-primary">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-xs text-text-secondary hover:text-text-primary focus:outline-none"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="divide-y divide-background-tertiary">
            {notifications.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <p className="text-text-secondary text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 flex items-start gap-3 hover:bg-background/40 transition-colors ${
                    !notification.read ? 'bg-background/20' : ''
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="flex-shrink-0 text-text-secondary hover:text-text-primary focus:outline-none"
                          aria-label="Mark as read"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {notification.wizNote && (
                      <p className="text-xs text-text-secondary mt-1 italic">
                        &quot;{notification.wizNote}&quot;
                      </p>
                    )}
                    
                    <p className="text-xs text-text-muted mt-1">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 