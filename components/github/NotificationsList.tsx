import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Bell, GitPullRequest, AlertCircle, Eye, MessageSquare, GitCommit } from 'lucide-react';
import logger from '@/lib/logger';

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
  pollInterval?: number; // Polling interval in seconds
  maxRetries?: number; // Maximum number of retries on error
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  accessToken,
  onError,
  pollInterval = 60,
  maxRetries = 3,
}) => {
  const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const componentLogger = logger.tagged('NotificationsList');

  const fetchNotifications = useCallback(async (isRetry = false) => {
    try {
      const response = await fetch('https://api.github.com/notifications', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'turf-app',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token is invalid or expired');
        } else if (response.status === 403) {
          throw new Error('Rate limit exceeded');
        } else {
          throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setNotifications(data);
      setRetryCount(0); // Reset retry count on success
      setLastError(null);
      componentLogger.info(`Successfully fetched ${data.length} notifications`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      componentLogger.error(`Error fetching notifications: ${errorMessage}`);

      if (!isRetry && retryCount < maxRetries) {
        // Exponential backoff for retries
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        componentLogger.info(`Retrying in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchNotifications(true);
        }, backoffTime);
      } else {
        setLastError(errorMessage);
        onError(errorMessage);
      }
    } finally {
      if (!isRetry) {
        setIsLoading(false);
      }
    }
  }, [accessToken, onError, retryCount, maxRetries, componentLogger]);

  useEffect(() => {
    fetchNotifications();

    // Set up polling with the specified interval
    const interval = setInterval(() => {
      fetchNotifications();
    }, pollInterval * 1000);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollInterval]);

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
      const response = await fetch(`https://api.github.com/notifications/threads/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'turf-app',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }

      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
      );
      componentLogger.info(`Marked notification ${id} as read`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      componentLogger.error(`Error marking notification as read: ${errorMessage}`);
      onError('Failed to mark notification as read');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary mb-4"></div>
        <p className="text-text-secondary">Loading notifications...</p>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">Error</p>
        <p className="text-sm text-red-600 mt-1">{lastError}</p>
        <button
          onClick={() => {
            setRetryCount(0);
            setLastError(null);
            fetchNotifications();
          }}
          className="mt-3 text-sm text-accent-primary hover:text-accent-primary-dark"
        >
          Try again
        </button>
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

export default NotificationsList;
