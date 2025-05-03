'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/auth/SignUpForm';
import { checkAuthStatus } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SignUpPage');

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { session, error } = await checkAuthStatus();
      
      if (error) {
        logger.error('Error checking auth status:', error);
        return;
      }
      
      if (session) {
        logger.info('User already authenticated, redirecting to dashboard');
        router.push('/dashboard');
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Join Turf
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Start your journey in meaningful discussions
          </p>
        </div>
        
        <SignUpForm />
      </div>
    </div>
  );
}
