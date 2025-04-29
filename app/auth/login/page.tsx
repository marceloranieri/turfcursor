'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Turf',
  description: 'Sign in to your Turf account',
};

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