import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Github, GitPullRequest, GitCommit, Star, AlertCircle, GitBranch, Tag, Eye } from 'lucide-react';
import Image from 'next/image';

interface GitHubEvent {
  id: string;
  type: 'push' | 'pull_request' | 'issue' | 'star' | 'gist' | 'fork' | 'release' | 'watch';
  repo_name: string;
  action?: string;
  branch?: string;
  commit_count?: number;
  details: any;
  created_at: string;
  actor?: {
    login: string;
    avatar_url: string;
  };
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <GitCommit className="w-5 h-5 text-green-500" />;
      case 'pull_request':
        return <GitPullRequest className="w-5 h-5 text-blue-500" />;
      case 'issue':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'star':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'gist':
        return <Github className="w-5 h-5 text-purple-500" />;
      case 'fork':
        return <GitBranch className="w-5 h-5 text-indigo-500" />;
      case 'release':
        return <Tag className="w-5 h-5 text-pink-500" />;
      case 'watch':
        return <Eye className="w-5 h-5 text-cyan-500" />;
      default:
        return <Github className="w-5 h-5 text-gray-500" />;
    }
  };

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
            {event.details.body && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {event.details.body}
              </p>
            )}
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
            {event.details.body && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {event.details.body}
              </p>
            )}
          </div>
        );

      case 'star':
        return (
          <div>
            Repository {event.action === 'created' ? 'starred' : 'unstarred'} (now has {event.details.stars} stars)
          </div>
        );

      case 'gist':
        return (
          <div>
            <Link
              href={event.details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Gist {event.details.id}
            </Link>
            {' '}
            {event.action}: {event.details.description || 'Untitled gist'}
          </div>
        );

      case 'fork':
        return (
          <div>
            Forked repository to{' '}
            <Link
              href={event.details.fork_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              {event.details.fork_name}
            </Link>
          </div>
        );

      case 'release':
        return (
          <div>
            <Link
              href={event.details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Released version {event.details.tag_name}
            </Link>
            {event.details.name && `: ${event.details.name}`}
            {event.details.body && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {event.details.body}
              </p>
            )}
          </div>
        );

      case 'watch':
        return (
          <div>
            Started watching the repository
            {event.details.stars_count && ` (${event.details.stars_count} total watchers)`}
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
          className="p-4 bg-background-tertiary rounded-lg border border-background-secondary hover:border-accent-primary/30 transition-colors"
        >
          <div className="flex items-start space-x-4">
            {event.actor && (
              <Image
                src={event.actor.avatar_url}
                alt={event.actor.login}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`https://github.com/${event.repo_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary font-medium hover:text-accent-primary"
                  >
                    {event.repo_name}
                  </Link>
                  <div className="text-text-secondary text-sm">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getEventIcon(event.type)}
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-background-secondary text-text-secondary">
                    {event.type.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-text-primary">
                {renderEventContent(event)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 