'use client';

import { useState } from 'react';
import { debugAuthState, debugOAuthConfig } from '@/lib/supabase/debug';

export default function AuthDebugPage() {
  const [results, setResults] = useState<string>('');

  // Add result to the log
  const addResult = (message: string) => {
    setResults(prev => prev + '\n' + message);
  };

  // Run auth state debug
  const runAuthStateDebug = async () => {
    setResults('Running authentication state debug...');
    await debugAuthState();
  };

  // Debug OAuth config
  const runOAuthDebug = async (provider: string) => {
    setResults(`Running ${provider} OAuth debug...`);
    await debugOAuthConfig(provider);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-background-secondary rounded-lg shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-text-primary">Supabase Auth Debug</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Authentication State</h2>
          <button
            onClick={runAuthStateDebug}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
          >
            Check Auth State
          </button>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">OAuth Configuration</h2>
          <div className="flex gap-4">
            <button
              onClick={() => runOAuthDebug('facebook')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Test Facebook OAuth
            </button>
            <button
              onClick={() => runOAuthDebug('google')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Test Google OAuth
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Debug Results</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {results || 'No results yet. Run a debug test to see output.'}
          </pre>
        </div>
      </div>
    </div>
  );
} 