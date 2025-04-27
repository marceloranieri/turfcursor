'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { signInWithGoogle, signInWithFacebook, signInWithGithub } from '@/lib/auth/oauth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(true);
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'github':
          await signInWithGithub();
          break;
      }
    } catch (error) {
      console.error(`${provider} sign up error:`, error);
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Sign up'}
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
              disabled={isLoading}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="mx-auto h-5 w-5" />
            </button>
            <button
              onClick={() => handleOAuthSignUp('facebook')}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFacebook className="mx-auto h-5 w-5" />
            </button>
            <button
              onClick={() => handleOAuthSignUp('github')}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-background-primary text-text-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGithub className="mx-auto h-5 w-5" />
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