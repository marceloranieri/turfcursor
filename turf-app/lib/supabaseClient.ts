import { createClient } from '@supabase/supabase-js';

// Use a more defensive approach for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client for development/build if environment variables are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client - environment variables are missing');
  return {
    auth: {
      signIn: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  };
};

// Create the client with a try-catch to handle any initialization errors
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabase = createMockClient();
}

export { supabase };
export default supabase; 