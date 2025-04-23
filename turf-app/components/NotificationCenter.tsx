'use client';

import React, { useState } from 'react';
import { BellIcon, XIcon } from '@heroicons/react/outline';

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
  onClearAll,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'harmony_points':
        return <span className="text-accent-primary">🎯</span>;
      case 'genius_award':
        return <span className="text-gold">🏆</span>;
      case 'pinned':
        return <span>📌</span>;
      case 'wizard':
        return <span>🧙</span>;
      case 'general':
        return <span>📢</span>;
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-background-tertiary transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <BellIcon className="w-6 h-6 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent-primary rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background-secondary rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-background-tertiary">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-accent-primary hover:underline focus:outline-none"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-text-secondary">
                <p>No notifications yet!</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 border-b border-background-tertiary hover:bg-background-tertiary transition-colors ${
                      !notification.read ? 'bg-opacity-10 bg-accent-primary' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{notification.message}</p>
                        {notification.wizNote && (
                          <p className="text-xs italic text-accent-secondary mt-1">
                            "{notification.wizNote}"
                          </p>
                        )}
                        <p className="text-xs text-text-muted mt-1">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 