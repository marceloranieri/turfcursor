"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SupabaseTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testSupabase() {
      try {
        const supabase = createClientComponentClient();

        // Test database connection
        const { data: dbTest, error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        // Test auth configuration
        const { data: authTest, error: authError } = await supabase.auth.getSession();

        // Test OAuth providers
        const { data: providers, error: providersError } = await supabase.auth.getProviders();

        setTestResults({
          success: true,
          database: {
            connected: !dbError,
            error: dbError?.message
          },
          auth: {
            configured: !authError,
            error: authError?.message,
            providers: providers || []
          },
          environment: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
          }
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    testSupabase();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <h3 className="font-semibold mb-2">Error Testing Supabase Configuration</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!testResults) {
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Supabase Configuration Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Environment Variables</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>{' '}
              <span className={testResults.environment.url === 'Set' ? 'text-green-600' : 'text-red-600'}>
                {testResults.environment.url}
              </span>
            </p>
            <p>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{' '}
              <span className={testResults.environment.anonKey === 'Set' ? 'text-green-600' : 'text-red-600'}>
                {testResults.environment.anonKey}
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Database Connection</h3>
          <p className={testResults.database.connected ? 'text-green-600' : 'text-red-600'}>
            {testResults.database.connected ? 'Connected' : 'Not Connected'}
          </p>
          {testResults.database.error && (
            <p className="text-sm text-red-500 mt-1">{testResults.database.error}</p>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Authentication</h3>
          <p className={testResults.auth.configured ? 'text-green-600' : 'text-red-600'}>
            {testResults.auth.configured ? 'Configured' : 'Not Configured'}
          </p>
          {testResults.auth.error && (
            <p className="text-sm text-red-500 mt-1">{testResults.auth.error}</p>
          )}
          {testResults.auth.providers.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Available Providers:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {testResults.auth.providers.map((provider: any) => (
                  <li key={provider.id}>{provider.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 