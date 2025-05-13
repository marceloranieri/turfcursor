'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { default as loadDynamic } from 'next/dynamic';

export const dynamic = 'force-dynamic';

const TopicAdminComponent = loadDynamic(() => import('@/components/admin/TopicAdmin'), {
  ssr: false,
  loading: () => <div className="p-6 text-center">Loading admin dashboard...</div>,
});

export default function TopicAdminPage() {
  return (
    <ErrorBoundary fallback={<div className="p-6 text-red-600">Failed to load admin panel. Please try again later.</div>}>
      <Suspense fallback={<div className="p-6 text-center">Preparing admin panel…</div>}>
        <TopicAdminComponent />
      </Suspense>
    </ErrorBoundary>
  );
} 