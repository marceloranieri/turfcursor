'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
} 