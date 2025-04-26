'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DebugPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    console.log('Debug page hydrated');
    setIsHydrated(true);

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setSupabaseStatus('error');
        } else {
          console.log('Supabase connection successful:', data);
          setSupabaseStatus('connected');
        }
      } catch (err) {
        console.error('Supabase test failed:', err);
        setSupabaseStatus('error');
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Hydration Status</h2>
          <p>Is Hydrated: {isHydrated ? '✅ Yes' : '❌ No'}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Supabase Connection</h2>
          <p>Status: {
            supabaseStatus === 'checking' ? '🔄 Checking...' :
            supabaseStatus === 'connected' ? '✅ Connected' :
            '❌ Error'
          }</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Environment Variables</h2>
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Test Interaction</h2>
          <button
            onClick={() => alert('Button click works!')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Click Handler
          </button>
        </div>
      </div>
    </div>
  );
} 