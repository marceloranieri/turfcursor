'use client';

import React, { useEffect, useState } from 'react';
import { createLogger } from '@/lib/logger';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ActivityFeedProps } from '@/types';

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
  payload: {
    commits?: Array<{
      message: string;
      sha: string;
    }>;
    action?: string;
    issue?: {
      number: number;
      title: string;
    };
    pull_request?: {
      number: number;
      title: string;
    };
    ref?: string;
    ref_type?: string;
    description?: string;
    release?: {
      tag_name: string;
      name: string;
    };
  };
  created_at: string;
}

const logger = createLogger('ActivityFeed');

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  username,
  token,
  limit = 10,
  selectedRepos,
  onError,
  onRateLimitExceeded,
  className = '',
  showAvatar = true,
  showRepoName = true,
  showEventType = true,
  showTimestamp = true,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{ remaining: number; reset: Date } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      logger.info(`Fetching GitHub events for user: ${username}`);
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'turf-app',
        };

        if (token) {
          headers['Authorization'] = `token ${token}`;
        }

        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=${limit}`,
          { headers }
        );

        // Get rate limit info from headers
        const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10);
        const reset = parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10);

        setRateLimit({
          remaining,
          reset: new Date(reset * 1000),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`User ${username} not found on GitHub`);
          } else if (response.status === 403) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else {
            throw new Error(`GitHub API error: ${response.status}`);
          }
        }

        const data = await response.json();
        logger.info(`Successfully fetched ${data.length} events for ${username}`);
        setEvents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        logger.error(`Failed to fetch GitHub events: ${errorMessage}`);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchEvents();
    } else {
      setError('Username is required');
    }
  }, [username, token, limit, logger]);

  const renderEventContent = (event: Event) => {
    switch (event.type) {
      case 'PushEvent':
        return (
          <div>
            <p>
              Pushed to <strong>{event.repo.name}</strong>
              {event.payload.ref && (
                <span className="text-gray-600">
                  {' '}
                  ({event.payload.ref.replace('refs/heads/', '')})
                </span>
              )}
            </p>
            <ul className="text-sm text-gray-600">
              {event.payload.commits?.map(commit => (
                <li key={commit.sha.substring(0, 7)} className="truncate">
                  <span className="font-mono text-xs text-gray-500">
                    {commit.sha.substring(0, 7)}
                  </span>{' '}
                  {commit.message.split('\n')[0]}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'CreateEvent':
        return (
          <p>
            Created {event.payload.ref_type}{' '}
            {event.payload.ref && <strong>{event.payload.ref}</strong>} in{' '}
            <strong>{event.repo.name}</strong>
          </p>
        );
      case 'DeleteEvent':
        return (
          <p>
            Deleted {event.payload.ref_type}{' '}
            {event.payload.ref && <strong>{event.payload.ref}</strong>} in{' '}
            <strong>{event.repo.name}</strong>
          </p>
        );
      case 'IssuesEvent':
        return (
          <p>
            {event.payload.action} issue{' '}
            <strong>
              {event.repo.name}#{event.payload.issue?.number}
            </strong>
            : {event.payload.issue?.title}
          </p>
        );
      case 'IssueCommentEvent':
        return (
          <p>
            Commented on issue{' '}
            <strong>
              {event.repo.name}#{event.payload.issue?.number}
            </strong>
          </p>
        );
      case 'PullRequestEvent':
        return (
          <p>
            {event.payload.action} pull request{' '}
            <strong>
              {event.repo.name}#{event.payload.pull_request?.number}
            </strong>
            : {event.payload.pull_request?.title}
          </p>
        );
      case 'ReleaseEvent':
        return (
          <p>
            Released{' '}
            <strong>{event.payload.release?.name || event.payload.release?.tag_name}</strong> on{' '}
            <strong>{event.repo.name}</strong>
          </p>
        );
      case 'WatchEvent':
        return (
          <p>
            Starred <strong>{event.repo.name}</strong>
          </p>
        );
      case 'ForkEvent':
        return (
          <p>
            Forked <strong>{event.repo.name}</strong>
          </p>
        );
      default:
        return (
          <p>
            Activity on <strong>{event.repo.name}</strong>
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2"></div>
        <p>Loading GitHub activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p>No recent GitHub activity found for @{username}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium">Recent GitHub Activity</h3>
        {rateLimit && (
          <p className="text-xs text-gray-500 mt-1">
            Rate limit: {rateLimit.remaining} requests remaining
            {rateLimit.remaining < 10 && (
              <span className="text-yellow-600">
                {' '}
                (Resets {formatDistanceToNow(rateLimit.reset, { addSuffix: true })})
              </span>
            )}
          </p>
        )}
      </div>
      <ul className="divide-y divide-gray-200">
        {events.map(event => (
          <li key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <Image
                src={event.actor.avatar_url}
                alt={`${event.actor.login}'s avatar`}
                width={40}
                height={40}
                className="rounded-full mr-4"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{event.actor.login}</p>
                <div className="mt-1">{renderEventContent(event)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityFeed;
