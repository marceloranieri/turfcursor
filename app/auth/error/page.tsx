'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An error occurred during authentication';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-text-secondary mb-6">
          {error}
        </p>
        <div className="flex space-x-4">
          <Link
            href="/auth/signin"
            className="flex-1 px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="flex-1 px-4 py-2 bg-background-tertiary text-text-primary rounded hover:bg-background-tertiary-dark transition-colors text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 