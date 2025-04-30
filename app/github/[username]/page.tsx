import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ActivityFeed from '@/components/github/ActivityFeed';
import RepositoryCard from '@/components/github/RepositoryCard';
import GithubProfile from '@/components/github/GithubProfile';

interface GitHubProfilePageProps {
  params: {
    username: string;
  };
}

export default function GitHubProfilePage({ params }: GitHubProfilePageProps): JSX.Element {
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading profile...</div>}>
          <GithubProfile username={params.username} />
        </Suspense>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Suspense fallback={<div>Loading repositories...</div>}>
            <RepositoryCard username={params.username} />
          </Suspense>
          
          <Suspense fallback={<div>Loading activity...</div>}>
            <ActivityFeed username={params.username} />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
}
