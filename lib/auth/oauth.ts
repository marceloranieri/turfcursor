import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';

type OAuthProvider = 'google' | 'facebook' | 'github';

const GITHUB_SCOPES = [
  'read:user',
  'user:email',
  'repo',
  'notifications',
  'gist',
  'workflow',
  'admin:org',
  'admin:public_key',
  'admin:repo_hook',
  'admin:org_hook',
  'admin:gpg_key',
  'admin:ssh_signing_key'
].join(' ');

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
  try {
    logger.info('Initiating GitHub OAuth sign-in');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: GITHUB_SCOPES,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      logger.error('GitHub OAuth error:', error);
      throw error;
    }

    logger.info('GitHub OAuth initiated successfully');
    return data;
  } catch (error) {
    logger.error('Failed to initiate GitHub OAuth:', error);
    throw error;
  }
}

export async function signInWithGoogle() {
  return signInWithOAuth('google');
}

export async function signInWithFacebook() {
  return signInWithOAuth('facebook');
}

export async function disconnectGithub() {
  try {
    logger.info('Disconnecting GitHub account');
    const { error } = await supabase.auth.updateUser({
      data: {
        github: null,
      },
    });

    if (error) {
      logger.error('Error disconnecting GitHub:', error);
      throw error;
    }

    logger.info('GitHub account disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect GitHub account:', error);
    throw error;
  }
} 