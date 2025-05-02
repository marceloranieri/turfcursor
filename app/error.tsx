'use client';

import { useEffect } from 'react';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GlobalError');

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background-primary">
          <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-text-secondary mb-4">
              We apologize for the inconvenience. An error has occurred and our team has been notified.
            </p>
            <button
              onClick={() => reset()}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
            >
              Try again
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-background-tertiary rounded">
                <p className="text-sm font-mono text-text-secondary break-all">
                  {error.message}
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