'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth/AuthContext';
import type { GitHubEvent } from '@/lib/types';
import { useToast } from '../ui/ToastContext';

interface ActivityFeedProps {
  username: string;
  token?: string;
  limit?: number;
  selectedRepos?: string[];
  onError?: (error: Error) => void;
  onRateLimitExceeded?: () => void;
  className?: string;
}

const EVENT_ICONS: Record<string, string> = {
  PushEvent: '📝',
  IssuesEvent: '📋',
  IssueCommentEvent: '💬',
  PullRequestEvent: '🔄',
  ReleaseEvent: '🏷️',
  WatchEvent: '⭐',
  ForkEvent: '🍴',
  CreateEvent: '✨',
  DeleteEvent: '🗑️',
  MemberEvent: '👥',
  PublicEvent: '🌐',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  username,
  token,
  limit = 10,
  selectedRepos,
  onError,
  onRateLimitExceeded,
  className = '',
}) => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token || session?.provider_token}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'turf-app',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            onRateLimitExceeded?.();
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        const filteredEvents = selectedRepos
          ? data.filter((event: GitHubEvent) => selectedRepos.includes(event.repo.name))
          : data;
        setEvents(filteredEvents);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error.message);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchActivity();
    }
  }, [username, token, limit, session?.provider_token, selectedRepos, onError, onRateLimitExceeded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-text-secondary">
        No recent activity
      </div>
    );
  }

  return (
    <div className={`bg-background-secondary rounded-lg shadow-card p-6 ${className}`}>
      <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border-b border-border last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-start space-x-3">
              <a
                href={`https://github.com/${event.actor.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <img
                  src={event.actor.avatar_url}
                  alt={event.actor.login}
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
              </a>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary break-words">
                  {EVENT_ICONS[event.type] || '📌'} {event.type.replace('Event', '')} in {event.repo.name}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
