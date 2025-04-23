'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center p-6 max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Something went wrong!</h2>
        <p className="text-text-secondary mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 