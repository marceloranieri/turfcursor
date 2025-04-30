'use client';

import React, { useState } from 'react';
import { Octokit } from '@octokit/rest';
import logger from '@/lib/logger';
import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';
import { useToast } from '../ui/ToastContext';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export const RepositoryCard: React.FC<{ repository: Repository }> = ({ repository }) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const handleStar = async () => {
    if (!session?.provider_token) {
      setError('Please sign in to star repositories');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const octokit = new Octokit({
        auth: session.provider_token,
      });

      await octokit.activity.starRepoForAuthenticatedUser({
        owner: repository.name,
        repo: repository.name,
      });

      logger.info(`Successfully starred repository: ${repository.name}`);
    } catch (err) {
      setError('Failed to star repository');
      logger.error('Error starring repository:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-secondary rounded-lg shadow-card p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <Image
          src={repository.html_url}
          alt={`${repository.name}'s avatar`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-foreground transition-colors"
            >
              {repository.name}
            </a>
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {repository.description}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center">
              <span className="text-text-secondary">⭐</span>
              <span className="ml-1">{repository.stargazers_count}</span>
            </div>
            <div className="flex items-center">
              <span className="text-text-secondary">🔀</span>
              <span className="ml-1">{repository.forks_count}</span>
            </div>
            {repository.language && (
              <div className="flex items-center">
                <span className="text-text-secondary">📝</span>
                <span className="ml-1">{repository.language}</span>
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            onClick={handleStar}
            disabled={isLoading}
            className={`mt-2 px-3 py-1 text-sm rounded-button ${
              isLoading
                ? 'bg-background-tertiary cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isLoading ? 'Starring...' : 'Star'}
          </button>
        </div>
      </div>
    </div>
  );
};
