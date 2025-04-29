'use client';

import logger from '@/lib/logger';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background-primary">
          <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-text-secondary mb-4">
              We apologize for the inconvenience. A critical error has occurred and our team has been notified.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-background-tertiary text-text-primary rounded hover:bg-background-tertiary-dark transition-colors"
              >
                Go to homepage
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-background-tertiary rounded">
                <p className="text-sm font-mono text-text-secondary break-all">
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p className="text-sm font-mono text-text-tertiary mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
} 