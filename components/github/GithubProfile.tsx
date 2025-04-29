'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

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
}

export function GithubProfile({ username }: GithubProfileProps) {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { githubToken } = useAuth();

  useEffect(() => {
    async function fetchGithubProfile() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGithubProfile();
  }, [username, githubToken]);

  if (loading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-4 text-center">No profile found</div>;
  }

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
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{user.public_repos}</div>
          <div className="text-gray-600 dark:text-gray-300">Repositories</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{user.followers}</div>
          <div className="text-gray-600 dark:text-gray-300">Followers</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{user.following}</div>
          <div className="text-gray-600 dark:text-gray-300">Following</div>
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
            <a href={user.blog} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
      </div>
    </div>
  );
} 