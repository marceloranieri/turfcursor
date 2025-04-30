'use client';

import React from 'react';
import { useToast } from '../ui/ToastContext';

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
  const { showToast } = useToast();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background-secondary rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
          <button
            onClick={onClearAll}
            className="text-text-secondary hover:text-text-primary text-sm"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 rounded-md ${
                notification.read ? 'bg-background-tertiary' : 'bg-accent-primary/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-primary">{notification.message}</p>
                  {notification.wizNote && (
                    <p className="text-text-secondary text-sm mt-1">{notification.wizNote}</p>
                  )}
                  <p className="text-text-muted text-xs mt-1">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-text-secondary hover:text-text-primary text-sm ml-2"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 