import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Bell, GitPullRequest, AlertCircle, Eye, MessageSquare, GitCommit } from 'lucide-react';

interface GitHubNotification {
  id: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  subject: {
    title: string;
    url: string;
    type: string;
    latest_comment_url: string | null;
  };
  reason: string;
  unread: boolean;
  updated_at: string;
}

interface NotificationsListProps {
  accessToken: string;
  onError: (message: string) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ accessToken, onError }) => {
  const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('https://api.github.com/notifications', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch {
      onError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, onError]);

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PullRequest':
        return <GitPullRequest className="w-5 h-5 text-blue-500" />;
      case 'Issue':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case 'Commit':
        return <GitCommit className="w-5 h-5 text-purple-500" />;
      case 'Discussion':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'Subscription':
        return <Eye className="w-5 h-5 text-cyan-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`https://api.github.com/notifications/threads/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
      );
    } catch {
      onError('Failed to mark notification as read');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return <div className="text-center py-8 text-text-secondary">No new notifications</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${
            notification.unread
              ? 'bg-background-tertiary border-accent-primary/30'
              : 'bg-background-secondary border-background-secondary'
          }`}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.subject.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={notification.repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-accent-primary"
                  >
                    {notification.repository.full_name}
                  </Link>
                  <Link
                    href={notification.subject.url.replace('api.github.com/repos', 'github.com')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-text-primary font-medium hover:text-accent-primary mt-1"
                  >
                    {notification.subject.title}
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text-secondary">
                    {formatDistanceToNow(new Date(notification.updated_at), { addSuffix: true })}
                  </span>
                  {notification.unread && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-accent-primary hover:text-accent-primary-dark"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-1">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-full">
                  {notification.reason}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
