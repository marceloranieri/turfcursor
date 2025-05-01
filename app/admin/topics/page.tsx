'use client';

import { Suspense } from 'react';
import { default as loadDynamic } from 'next/dynamic';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const dynamic = 'force-dynamic';

const TopicAdminComponent = loadDynamic(() => import('@/components/admin/TopicAdmin'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem' }}>Loading admin dashboard...</div>,
});

export default function TopicAdminPage() {
  return (
    <ErrorBoundary fallback={<div style={{ padding: '2rem' }}>⚠️ Admin tools failed to load.</div>}>
      <Suspense fallback={<div style={{ padding: '2rem' }}>Preparing admin panel…</div>}>
        <TopicAdminComponent />
      </Suspense>
    </ErrorBoundary>
  );
} 