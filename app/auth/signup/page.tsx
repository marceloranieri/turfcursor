'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SignUpPage');

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      logger.info('Attempting sign up with email', { email });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        logger.error('Sign-up error:', { message: error.message });
        setError(error.message);
        return;
      }

      if (data.session) {
        logger.info('Sign-up successful, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        logger.info('Sign-up successful, email confirmation required');
        router.push('/auth/verify-email');
      }
    } catch (err: any) {
      logger.error('Unexpected sign-up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Join us and start managing your projects.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSignUp} noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              aria-describedby="email-error"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              aria-describedby="password-error"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              aria-describedby="confirm-password-error"
            />
          </div>

          {error && (
            <div 
              className="rounded-message bg-red-100 p-3 text-sm text-red-700"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 mr-2"
              aria-describedby="terms-error"
            />
            <label htmlFor="terms" className="text-sm text-text-secondary">
              I agree to the <Link href="/terms" className="text-accent-primary hover:text-accent-primary-dark">Terms and Conditions</Link>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full rounded-message bg-accent-primary p-3 text-sm font-medium text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:bg-accent-primary/70"
            aria-disabled={loading || !agreedToTerms}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
