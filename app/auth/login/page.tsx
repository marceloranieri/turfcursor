'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/signin');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
} 