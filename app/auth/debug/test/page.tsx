'use client';

import { useState, useEffect } from 'react';
import { testSupabaseConnection, checkAuthSettings, testAuthFlow } from '@/lib/supabase/test-connection';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthDebugPage');

export default function AuthDebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Run all tests
      logger.info('Starting auth debug tests...');
      
      // Test basic connection
      const connectionResult = await testSupabaseConnection();
      setResults(prev => ({ ...prev, connection: connectionResult }));
      
      // Test auth settings
      const authResult = await checkAuthSettings();
      setResults(prev => ({ ...prev, auth: authResult }));
      
      // Test complete flow
      const flowResult = await testAuthFlow();
      setResults(prev => ({ ...prev, flow: flowResult }));
      
      logger.info('Auth debug tests completed');
    } catch (err: any) {
      logger.error('Error running auth tests:', err);
      setError(err.message || 'An error occurred while running tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Supabase Auth Debug
        </h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-8">
          {/* Connection Test Results */}
          <div className="bg-background-secondary p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connection Test
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(results.connection, null, 2)}
            </pre>
          </div>
          
          {/* Auth Settings Results */}
          <div className="bg-background-secondary p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Auth Settings
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(results.auth, null, 2)}
            </pre>
          </div>
          
          {/* Auth Flow Results */}
          <div className="bg-background-secondary p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Complete Auth Flow
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(results.flow, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={runTests}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              loading 
                ? 'bg-accent-primary-dark cursor-not-allowed' 
                : 'bg-accent-primary hover:bg-accent-primary-dark'
            }`}
          >
            {loading ? 'Running Tests...' : 'Run Tests Again'}
          </button>
        </div>
      </div>
    </div>
  );
} 