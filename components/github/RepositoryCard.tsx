import React from 'react';
import Link from 'next/link';
import { Star, GitFork, Eye, Circle } from 'lucide-react';

interface RepositoryCardProps {
  repo: {
    full_name: string;
    name: string;
    description: string | null;
    html_url: string;
    private: boolean;
    language?: string;
    stargazers_count?: number;
    forks_count?: number;
    watchers_count?: number;
    updated_at?: string;
    topics?: string[];
    default_branch?: string;
  };
  isSelected?: boolean;
  onToggleSelect?: () => void;
  showCheckbox?: boolean;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  // Add more languages as needed
};

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  isSelected,
  onToggleSelect,
  showCheckbox = true,
}) => {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-background-tertiary border border-background-secondary hover:border-accent-primary/30 transition-colors">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mt-1 h-4 w-4 text-accent-primary focus:ring-accent-primary border-gray-300 rounded"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary font-medium hover:text-accent-primary truncate block"
            >
              {repo.full_name}
            </Link>
            {repo.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
          </div>
          {repo.private && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-full">
              Private
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {repo.topics?.map((topic) => (
            <Link
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs font-medium bg-accent-primary/10 text-accent-primary rounded-full hover:bg-accent-primary/20 transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center space-x-4 text-sm text-text-secondary">
          {repo.language && (
            <div className="flex items-center">
              <Circle
                className="w-3 h-3 mr-1"
                fill={languageColors[repo.language] || '#8B949E'}
                stroke="none"
              />
              {repo.language}
            </div>
          )}
          {repo.stargazers_count !== undefined && (
            <Link
              href={`${repo.html_url}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-text-primary"
            >
              <Star className="w-4 h-4 mr-1" />
              {repo.stargazers_count.toLocaleString()}
            </Link>
          )}
          {repo.forks_count !== undefined && (
            <Link
              href={`${repo.html_url}/network/members`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-text-primary"
            >
              <GitFork className="w-4 h-4 mr-1" />
              {repo.forks_count.toLocaleString()}
            </Link>
          )}
          {repo.watchers_count !== undefined && (
            <Link
              href={`${repo.html_url}/watchers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-text-primary"
            >
              <Eye className="w-4 h-4 mr-1" />
              {repo.watchers_count.toLocaleString()}
            </Link>
          )}
          {repo.updated_at && (
            <span>
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 