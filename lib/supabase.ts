import { createClient } from '@supabase/supabase-js';

// These values will be replaced by environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwgsbhncprilsuczqmjr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Z3NiaG5jcHJpbHN1Y3pxbWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4MTIsImV4cCI6MjA1OTcwNDgxMn0.UxCdhTb2Ti0wauZkcIQbWQRg0xNW6_spJ3Hm9rjHPms';

// Create a global Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Use PKCE flow for added security
  }
});

// Helper function to handle auth errors
export async function handleAuthError(error: any) {
  console.error('Authentication error:', error);
  
  // Log detailed error information for debugging
  if (error.status) {
    console.error(`Status: ${error.status}`);
  }
  
  if (error.details) {
    console.error(`Details: ${error.details}`);
  }
  
  return {
    message: error.message || 'An authentication error occurred',
    status: error.status || 500,
    details: error.details || null
  };
}

// Function to get the current session
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
} 