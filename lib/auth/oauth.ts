import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

type OAuthProvider = 'google' | 'facebook' | 'github';

export async function signInWithOAuth(provider: OAuthProvider) {
  try {
    // Store the current path to redirect back after auth
    sessionStorage.setItem('redirectAfterAuth', window.location.pathname);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(`${provider} OAuth error:`, error);
    toast.error(`Failed to sign in with ${provider}. Please try again.`);
    throw error;
  }
}

export async function signInWithGithub() {
  return signInWithOAuth('github');
}

export async function signInWithGoogle() {
  return signInWithOAuth('google');
}

export async function signInWithFacebook() {
  return signInWithOAuth('facebook');
} 