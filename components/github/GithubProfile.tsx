'use client';

import React from 'react';
import { useToast } from '../ui/ToastContext';

interface GithubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const GithubProfile: React.FC = () => {
  const { showToast } = useToast();
  const [user] = React.useState<GithubUser | null>(null);

  if (!user) {
    return (
      <div className="text-center text-text-secondary py-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md bg-background-secondary">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-text-secondary">@{user.login}</p>
        </div>
      </div>
      <p className="mt-4">{user.bio}</p>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-bold">{user.public_repos}</div>
          <div className="text-text-secondary">Repositories</div>
        </div>
        <div>
          <div className="text-xl font-bold">{user.followers}</div>
          <div className="text-text-secondary">Followers</div>
        </div>
        <div>
          <div className="text-xl font-bold">{user.following}</div>
          <div className="text-text-secondary">Following</div>
        </div>
      </div>
    </div>
  );
}; 