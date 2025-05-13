'use client';

import React from 'react';
import { GithubProfile } from '@/components/github/GithubProfile';
import { ActivityFeed } from '@/components/github/ActivityFeed';
import { RepositoryCard } from '@/components/github/RepositoryCard';
import { NotificationsList } from '@/components/github/NotificationsList';

interface GitHubProfilePageProps {
  params: {
    username: string;
  };
}

export default function GitHubProfilePage({ params }: GitHubProfilePageProps): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <GithubProfile />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          <ActivityFeed username={params.username} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <NotificationsList accessToken="" onError={() => {}} />
        </div>
      </div>
    </div>
  );
}
