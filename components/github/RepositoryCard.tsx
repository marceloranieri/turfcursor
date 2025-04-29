'use client';

import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import logger from '@/lib/logger';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';

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
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface RepositoryCardProps {
  repo: {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
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

const RepositoryCard = ({ repo }: RepositoryCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { githubToken } = useAuth();

  const handleStar = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://api.github.com/user/starred/${repo.owner.login}/${repo.name}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'turf-app',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to star repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <Image
          src={repo.owner.avatar_url}
          alt={`${repo.owner.login}'s avatar`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {repo.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {repo.description || 'No description available'}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ⭐ {repo.stargazers_count}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              🔀 {repo.forks_count}
            </span>
            {repo.language && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {repo.language}
              </span>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            onClick={handleStar}
            disabled={isLoading}
            className={`mt-2 px-3 py-1 text-sm rounded-md ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Starring...' : 'Star'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
