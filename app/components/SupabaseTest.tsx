"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testSupabase() {
      try {
        // Create Supabase client
        const supabase = createClientComponentClient();

        // Test database connection
        const { data: dbTest, error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (dbError) {
          throw new Error(`Database connection error: ${dbError.message}`);
        }

        // Test auth configuration
        const { data: authTest, error: authError } = await supabase.auth.getSession();

        if (authError) {
          throw new Error(`Auth configuration error: ${authError.message}`);
        }

        // Test OAuth providers
        const { data: providers, error: providersError } = await supabase.auth.getProviders();

        if (providersError) {
          throw new Error(`OAuth providers error: ${providersError.message}`);
        }

        setTestResult({
          status: 'success',
          message: 'Supabase configuration is valid',
          details: {
            database: {
              connected: true,
              message: 'Database connection successful'
            },
            auth: {
              configured: true,
              session: authTest.session ? 'Session available' : 'No active session',
              providers: providers
            }
          }
        });
      } catch (error: any) {
        setError(error.message);
        setTestResult({
          status: 'error',
          message: error.message,
          details: {
            database: {
              connected: false,
              error: error.message
            },
            auth: {
              configured: false,
              error: error.message
            }
          }
        });
      } finally {
        setLoading(false);
      }
    }

    testSupabase();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Testing Supabase configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-red-600 font-medium mb-2">Configuration Error</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-gray-800 font-medium mb-2">Supabase Configuration Test</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${testResult?.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-gray-600">{testResult?.message}</span>
        </div>
        <div className="pl-4 border-l-2 border-gray-200">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-700">Database</h4>
            <p className="text-sm text-gray-600">{testResult?.details.database.message}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Authentication</h4>
            <p className="text-sm text-gray-600">{testResult?.details.auth.session}</p>
            {testResult?.details.auth.providers && (
              <div className="mt-1">
                <p className="text-xs text-gray-500">Available providers:</p>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {Object.keys(testResult.details.auth.providers).map(provider => (
                    <li key={provider}>{provider}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 