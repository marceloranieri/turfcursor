import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ActivityFeed from '@/components/github/ActivityFeed';
import RepositoryCard from '@/components/github/RepositoryCard';

interface GitHubProfilePageProps {
  params: {
    username: string;
  };
}

export default function GitHubProfilePage({ params }: GitHubProfilePageProps) {
  const { username } = params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{username}'s GitHub Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ErrorBoundary>
            <Suspense fallback={<div className="p-4 text-center">Loading activity...</div>}>
              <ActivityFeed username={username} limit={10} />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Repository</h2>
          <ErrorBoundary>
            <Suspense fallback={<div className="p-4 text-center">Loading repository...</div>}>
              <RepositoryCard owner={username} repo="featured-repo" />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
} 