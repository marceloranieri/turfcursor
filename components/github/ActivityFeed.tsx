import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface GitHubEvent {
  id: string;
  type: 'push' | 'pull_request' | 'issue' | 'star';
  repo_name: string;
  action?: string;
  branch?: string;
  commit_count?: number;
  details: any;
  created_at: string;
}

interface ActivityFeedProps {
  selectedRepos: string[];
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ selectedRepos, limit = 10 }) => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('github_events')
          .select('*')
          .in('repo_name', selectedRepos)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching GitHub events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedRepos.length > 0) {
      fetchEvents();
    } else {
      setEvents([]);
      setIsLoading(false);
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('github_events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'github_events',
        filter: `repo_name=in.(${selectedRepos.join(',')})`,
      }, (payload) => {
        setEvents(current => [payload.new as GitHubEvent, ...current].slice(0, limit));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRepos, limit]);

  const renderEventContent = (event: GitHubEvent) => {
    switch (event.type) {
      case 'push':
        return (
          <div className="space-y-2">
            <p>
              Pushed {event.commit_count} commit{event.commit_count === 1 ? '' : 's'} to{' '}
              <span className="font-medium">{event.branch}</span>
            </p>
            <div className="space-y-1">
              {event.details.commits.map((commit: any) => (
                <div key={commit.id} className="text-sm">
                  <Link
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:underline"
                  >
                    {commit.id.substring(0, 7)}
                  </Link>
                  {' - '}
                  {commit.message}
                </div>
              ))}
            </div>
          </div>
        );

      case 'pull_request':
        return (
          <div>
            <Link
              href={event.details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Pull request #{event.details.number}
            </Link>
            {' '}
            {event.action}: {event.details.title}
          </div>
        );

      case 'issue':
        return (
          <div>
            <Link
              href={event.details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Issue #{event.details.number}
            </Link>
            {' '}
            {event.action}: {event.details.title}
          </div>
        );

      case 'star':
        return (
          <div>
            Repository {event.action === 'created' ? 'starred' : 'unstarred'} (now has {event.details.stars} stars)
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {selectedRepos.length === 0
          ? 'Select repositories to see their activity'
          : 'No recent activity in selected repositories'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 bg-background-tertiary rounded-lg border border-background-secondary"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-text-primary font-medium">{event.repo_name}</div>
              <div className="text-text-secondary text-sm">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </div>
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-background-secondary text-text-secondary">
              {event.type}
            </div>
          </div>
          <div className="mt-2 text-text-primary">
            {renderEventContent(event)}
          </div>
        </div>
      ))}
    </div>
  );
}; 