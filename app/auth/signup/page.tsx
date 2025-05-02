'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { Chrome, Facebook, Github } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SignUpPage');

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting signup process...'); // Debug log

    if (!acceptedTerms) {
      toast.error('You must accept the Terms of Service to continue');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting Supabase signup...'); // Debug log
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            terms_version: '1.0',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Supabase signup error:', error); // Debug log
        throw error;
      }

      console.log('Signup response:', data); // Debug log
      logger.info('Sign up successful', { email, userId: data.user?.id });
      
      if (data.user?.identities?.length === 0) {
        console.log('Account already exists'); // Debug log
        toast.error('An account with this email already exists. Please sign in instead.');
        router.push('/auth/signin');
        return;
      }

      // Store terms acceptance in the profiles table
      console.log('Storing profile data...'); // Debug log
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            email,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            terms_version: '1.0',
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError); // Debug log
        logger.error('Error storing terms acceptance:', profileError);
        // Continue with signup as the user is already created
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error('Signup process error:', error); // Debug log
      logger.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'facebook' | 'github') => {
    if (!acceptedTerms) {
      toast.error('You must accept the Terms of Service to continue');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      logger.error(`${provider} sign up error:`, error);
      toast.error(`Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Create your account
        </h1>

        <form onSubmit={handleEmailSignUp} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-text-secondary">
              I agree to the{' '}
              <Link href="/legal/terms" className="text-accent-primary hover:text-accent-primary-dark" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-accent-primary hover:text-accent-primary-dark" target="_blank">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !acceptedTerms}
            className="w-full py-2 px-4 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Creating account...</span>
              </>
            ) : (
              'Sign up'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-secondary text-text-secondary">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading || !acceptedTerms}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sign up with Google"
            >
              <Chrome className="mx-auto h-5 w-5" />
            </button>
            <button
              onClick={() => handleOAuthSignUp('facebook')}
              disabled={isLoading || !acceptedTerms}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sign up with Facebook"
            >
              <Facebook className="mx-auto h-5 w-5" />
            </button>
            <button
              onClick={() => handleOAuthSignUp('github')}
              disabled={isLoading || !acceptedTerms}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sign up with GitHub"
            >
              <Github className="mx-auto h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
