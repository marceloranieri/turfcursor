'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';
import { FormInput } from '@/components/auth/FormInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';

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
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Welcome back! Please enter your details.
          </p>
        </div>

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

          <div className="text-right text-sm">
            <Link href="/auth/forgot-password" className="text-accent-primary hover:text-accent-primary-dark">
              Forgot password?
            </Link>
          </div>

          <SubmitButton loading={loading} loadingText="Signing in...">
            Sign In
          </SubmitButton>

          <p className="mt-4 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent-primary hover:text-accent-primary-dark">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
