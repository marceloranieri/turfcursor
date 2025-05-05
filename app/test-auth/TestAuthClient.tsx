'use client';

import { createClient } from '@supabase/supabase-js';

export default function TestAuthClient() {
  async function testSupabaseConnection() {
    console.log('Testing Supabase Connection');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Has Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // Test auth session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', { sessionData, sessionError });

      // Test anonymous sign up
      const testEmail = `test${Date.now()}@example.com`;
      console.log('Attempting sign-up with:', testEmail);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      });
      console.log('Sign-up result:', { signUpData, signUpError });

      return {
        success: true,
        sessionData,
        sessionError,
        signUpData,
        signUpError
      };
    } catch (error) {
      console.error('Error testing Supabase:', error);
      return {
        success: false,
        error
      };
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Auth Test</h1>
      <button
        onClick={testSupabaseConnection}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Supabase Auth
      </button>
      <p className="mt-4">Check the browser console for detailed logs.</p>
    </div>
  );
} 