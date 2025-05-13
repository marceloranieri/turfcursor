'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AuthSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { session, error } = await checkAuthStatus();
      
      if (error || !session) {
        console.error('Error getting session:', error);
        router.push('/auth/signin'); // Redirect to auth page if no session
      } else {
        setUser(session.user);
        
        // Redirect to main app after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
      
      setLoading(false);
    }
    
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          Authentication Successful!
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-text-secondary">Loading your information...</p>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <p className="text-text-primary">Welcome, {user.email}!</p>
            <p className="text-text-secondary">Redirecting you to the dashboard...</p>
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-text-secondary">Something went wrong.</p>
            <a
              href="/auth/signin"
              className="text-accent-primary hover:text-accent-primary-dark"
            >
              Try again
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 