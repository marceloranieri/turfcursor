'use client';

import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import logger from '@/lib/logger';
import { formatDistanceToNow } from 'date-fns';

interface Repository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  default_branch: string;
  updated_at: string;
  license?: {
    name: string;
    spdx_id: string;
  };
  visibility: string;
  archived: boolean;
}

interface RepositoryCardProps {
  owner: string;
  repo: string;
  token?: string; // Optional GitHub token
  cacheTime?: number; // Cache time in minutes
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
};

// Cache implementation
const cache = new Map<string, { data: Repository; timestamp: number }>();

const RepositoryCard: React.FC<RepositoryCardProps> = ({ owner, repo, token, cacheTime = 5 }) => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{ remaining: number; reset: Date } | null>(null);

  const componentLogger = logger.tagged('RepositoryCard');

  useEffect(() => {
    const fetchRepository = async () => {
      const cacheKey = `${owner}/${repo}`;
      const now = Date.now();
      const cached = cache.get(cacheKey);

      // Check cache first
      if (cached && now - cached.timestamp < cacheTime * 60 * 1000) {
        componentLogger.debug(`Using cached data for ${cacheKey}`);
        setRepository(cached.data);
        setLoading(false);
        return;
      }

      componentLogger.debug(`Fetching repository: ${owner}/${repo}`);
      setLoading(true);
      setError(null);

      try {
        const octokit = new Octokit({
          auth: token,
          userAgent: 'turf-app',
        });

        // Check rate limit before making the request
        const { data: rateData } = await octokit.rateLimit.get();
        setRateLimit({
          remaining: rateData.resources.core.remaining,
          reset: new Date(rateData.resources.core.reset * 1000),
        });

        if (rateData.resources.core.remaining === 0) {
          const resetTime = new Date(rateData.resources.core.reset * 1000);
          throw new Error(`Rate limit exceeded. Resets ${formatDistanceToNow(resetTime, { addSuffix: true })}`);
        }

        const response = await octokit.repos.get({
          owner,
          repo,
        });

        componentLogger.info(`Successfully fetched repository data for ${owner}/${repo}`);
        
        // Update cache
        cache.set(cacheKey, {
          data: response.data as Repository,
          timestamp: now,
        });
        
        setRepository(response.data as Repository);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        componentLogger.error(`Failed to fetch repository: ${errorMessage}`);
        
        if (err.status === 404) {
          setError(`Repository ${owner}/${repo} not found`);
        } else if (err.status === 403) {
          setError('Rate limit exceeded. Please try again later.');
        } else {
          setError(`Failed to load repository: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
        componentLogger.debug('Finished loading repository data');
      }
    };

    if (owner && repo) {
      fetchRepository();
    } else {
      setError('Owner and repository name are required');
    }
  }, [owner, repo, token, cacheTime, componentLogger]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
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

  if (!repository) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p>Repository not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {repository.full_name}
            </a>
            {repository.archived && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                Archived
              </span>
            )}
            {repository.visibility === 'private' && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                Private
              </span>
            )}
          </h2>

          {repository.description && <p className="text-gray-600 mb-4">{repository.description}</p>}
        </div>
      </div>

      {repository.topics.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {repository.topics.map(topic => (
            <a
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {repository.language && (
          <span className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor: languageColors[repository.language] || '#8B949E',
              }}
            />
            {repository.language}
          </span>
        )}

        <a
          href={`${repository.html_url}/stargazers`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {repository.stargazers_count.toLocaleString()}
        </a>

        <a
          href={`${repository.html_url}/network/members`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {repository.forks_count.toLocaleString()}
        </a>

        <a
          href={`${repository.html_url}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {repository.open_issues_count.toLocaleString()}
        </a>

        {repository.license && (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {repository.license.spdx_id}
          </span>
        )}

        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          Updated {new Date(repository.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default RepositoryCard;
