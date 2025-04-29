'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface GithubProfileProps {
  username: string;
}

interface GithubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
  created_at: string;
  updated_at: string;
  hireable: boolean;
  public_gists: number;
  email: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
}

const GithubProfile = ({ username }: GithubProfileProps) => {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { githubToken } = useAuth();

  useEffect(() => {
    async function fetchGithubProfile() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'turf-app',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });

        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (response.status === 404) {
          throw new Error('User not found');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || 
            `Failed to fetch GitHub profile: ${response.statusText}`
          );
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('GitHub profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchGithubProfile();
    }
  }, [username, githubToken]);

  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-700 dark:text-yellow-400">No profile found</p>
      </div>
    );
  }

  const joinDate = new Date(user.created_at);
  const lastActive = new Date(user.updated_at);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <Image
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
          {user.bio && <p className="text-gray-600 dark:text-gray-300 mt-2">{user.bio}</p>}
          <div className="flex items-center space-x-2 mt-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              @{user.login}
            </a>
            {user.hireable && (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                Open to Work
              </span>
            )}
            {user.site_admin && (
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                GitHub Staff
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{user.public_repos.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-300">Repositories</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{user.followers.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-300">Followers</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{user.following.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-300">Following</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{user.public_gists.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-300">Gists</div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {user.location && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {user.location}
          </div>
        )}
        {user.company && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {user.company}
          </div>
        )}
        {user.blog && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {user.blog}
            </a>
          </div>
        )}
        {user.twitter_username && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <a
              href={`https://twitter.com/${user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @{user.twitter_username}
            </a>
          </div>
        )}
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Joined {formatDistanceToNow(joinDate, { addSuffix: true })}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last active {formatDistanceToNow(lastActive, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default GithubProfile; 