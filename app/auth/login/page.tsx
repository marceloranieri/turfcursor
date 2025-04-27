'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the signin page
    router.replace('/auth/signin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Redirecting to Sign In
        </h1>
        <p className="text-text-secondary mb-6">
          Please wait while we redirect you...
        </p>
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </div>
  );
} 