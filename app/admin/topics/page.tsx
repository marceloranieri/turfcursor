'use client';

import { useRequireAuth } from '../../../lib/auth/useRequireAuth';
import TopicAdmin from '../../../components/admin/TopicAdmin';

export default function TopicAdminPage() {
  // Require authentication and redirect to login if not authenticated
  const { user, isLoading } = useRequireAuth('/auth/signin');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Topic Administration</h1>
        <TopicAdmin />
      </div>
    </div>
  );
} 