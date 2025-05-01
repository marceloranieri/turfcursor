'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AcceptTermsPage');

export default function AcceptTermsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const handleAcceptTerms = async () => {
    if (!accepted) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Update the user profile with terms acceptance
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          terms_version: '1.0', // Current version
        });
        
      if (updateError) throw updateError;
      
      logger.info('Terms accepted successfully', { userId: user.id });
      
      // Redirect back to where they were trying to go
      router.push(returnUrl);
      
    } catch (err: any) {
      logger.error('Error accepting terms:', err);
      setError(err.message || 'Failed to record your acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-2xl w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Accept Terms of Service
        </h1>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-200">
            You must accept our Terms of Service before continuing to use Turf.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <div className="bg-background-primary rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 p-4 h-64 overflow-y-auto mb-4 rounded">
            <h2 className="text-lg font-semibold mb-2 text-text-primary">Terms of Service Summary</h2>
            <p className="text-text-secondary">By accepting these Terms, you agree to our full Terms of Service which govern your use of Turf.</p>
            <p className="mt-4 text-text-primary">Key points:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-text-secondary">
              <li>You must be at least 13 years old to use Turf</li>
              <li>You are responsible for your account and content</li>
              <li>Turf may use AI to enhance your experience</li>
              <li>You grant Turf a license to use content you share</li>
              <li>Financial discussions are not investment advice</li>
            </ul>
            <p className="mt-4">
              <Link 
                href="/legal/terms" 
                target="_blank"
                className="text-accent-primary hover:text-accent-primary-dark"
              >
                Read the full Terms of Service
              </Link>
            </p>
          </div>
          
          <div className="flex items-center mb-4">
            <input 
              id="accept"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
            />
            <label htmlFor="accept" className="text-sm text-text-secondary">
              I have read and agree to the Terms of Service
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAcceptTerms}
              disabled={!accepted || loading}
              className="px-4 py-2 rounded bg-accent-primary text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Accept and Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 