'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';
import { FormInput } from '@/components/auth/FormInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import AuthLayout from '@/components/auth/AuthLayout';

const logger = createLogger('SignInPage');

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      logger.info('Attempting sign in with email', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Sign-in error:', { message: error.message });
        setError(error.message);
        return;
      }

      if (data.session) {
        logger.info('Sign-in successful, redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (err: any) {
      logger.error('Unexpected sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back"
      description="Sign in to continue your debates and discussions."
      rightSideContent={{
        title: "Join the conversation",
        description: "Engage in quality debates on captivating daily topics."
      }}
    >
      <div className="w-full max-w-md">
        <ErrorMessage error={error} />
        
        <form className="space-y-6" onSubmit={handleSignIn} noValidate>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            autoComplete="email"
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="text-accent-primary hover:text-accent-primary-dark">
                Forgot password?
              </Link>
            </div>
          </div>

          <SubmitButton loading={loading} loadingText="Signing in...">
            Sign In
          </SubmitButton>

          <p className="mt-4 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-accent-primary hover:text-accent-primary-dark">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
