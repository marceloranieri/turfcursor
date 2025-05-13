'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createLogger } from '@/lib/logger';

const logger = createLogger('TermsUpdatePage');

export default function TermsUpdatePage() {
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

      // Update the user profile with new terms version
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          terms_version: '1.0', // Current version
        });
        
      if (updateError) throw updateError;
      
      logger.info('Updated terms accepted successfully', { userId: user.id });
      
      // Redirect back to where they were trying to go
      router.push(returnUrl);
      
    } catch (err: any) {
      logger.error('Error accepting updated terms:', err);
      setError(err.message || 'Failed to record your acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-2xl w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Terms of Service Update
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-blue-700 dark:text-blue-200">
            Our Terms of Service have been updated. Please review and accept the changes to continue using Turf.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <div className="bg-background-primary rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 p-4 h-64 overflow-y-auto mb-4 rounded">
            <h2 className="text-lg font-semibold mb-2 text-text-primary">What's Changed</h2>
            <p className="text-text-secondary">We've updated our Terms of Service to better protect you and improve our services.</p>
            <p className="mt-4 text-text-primary">Key changes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-text-secondary">
              <li>Updated data processing terms</li>
              <li>Clarified AI usage in the platform</li>
              <li>Added section on content moderation</li>
              <li>Updated dispute resolution process</li>
              <li>Clarified user responsibilities</li>
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
              I have read and agree to the updated Terms of Service
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAcceptTerms}
              disabled={!accepted || loading}
              className="px-4 py-2 rounded bg-accent-primary text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Accept Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 