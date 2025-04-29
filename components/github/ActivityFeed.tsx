'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { createLogger } from '@/lib/logger';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

interface Event {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: any;
  created_at: string;
}

interface ActivityFeedProps {
  username: string;
}

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    description?: string;
    master_branch?: string;
    pusher_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    head?: string;
    before?: string;
    commits?: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
        email: string;
      };
    }>;
  };
}

const logger = createLogger('ActivityFeed');

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

const ActivityFeed = ({ username }: ActivityFeedProps) => {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { githubToken } = useAuth();

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=10`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'User-Agent': 'turf-app',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [username, githubToken]);

  if (loading) {
    return <div className="p-4 text-center">Loading activity...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="p-4 text-center">No recent activity</div>;
  }

  function formatEventType(type: string, payload: any): string {
    switch (type) {
      case 'PushEvent':
        return `pushed ${payload.commits?.length || 0} commit${payload.commits?.length === 1 ? '' : 's'} to ${payload.ref}`;
      case 'CreateEvent':
        return `created ${payload.ref_type} ${payload.ref}`;
      case 'WatchEvent':
        return 'starred a repository';
      case 'ForkEvent':
        return 'forked a repository';
      case 'IssuesEvent':
        return `${payload.action} an issue`;
      case 'PullRequestEvent':
        return `${payload.action} a pull request`;
      default:
        return type.replace('Event', '').toLowerCase();
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200">
                  {formatEventType(event.type, event.payload)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.repo.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
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

export default ActivityFeed;
