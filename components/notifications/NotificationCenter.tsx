'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { DiscordButton } from '@/components/ui/DiscordButton';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  notifications: Array<{
    id: string;
    type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general';
    message: string;
    wizNote?: string;
    timestamp: Date;
    read: boolean;
  }>;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pin':
        return '📌';
      case 'genius':
        return '🌟';
      case 'harmony':
        return '🎵';
      case 'wizard':
        return '🧙‍♂️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-normal)] hover:text-[var(--text-hover)]"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-[var(--red)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--channel-bg)] rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-[var(--divider)]">
            <h3 className="text-lg font-semibold text-[var(--header-primary)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <DiscordButton
                variant="secondary"
                onClick={onClearAll}
                className="text-sm"
              >
                Mark all as read
              </DiscordButton>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[var(--divider)] hover:bg-[var(--channel-hover)] cursor-pointer ${
                    !notification.read ? 'bg-[var(--notification-unread)]' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div>
                      <p className="text-[var(--text-normal)]">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[var(--text-muted)]">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 