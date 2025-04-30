'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const TopicAdminComponent = dynamic(() => import('@/components/admin/TopicAdmin'), {
  ssr: false,
});

export const dynamic = 'force-dynamic';

export default function TopicAdminPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Topic Administration</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TopicAdminComponent />
        </Suspense>
      </div>
    </div>
  );
} 