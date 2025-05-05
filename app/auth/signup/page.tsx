'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import AuthLayout from '@/components/auth/AuthLayout';

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

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough)) {
      setError('Password does not meet the minimum requirements');
      return;
    }
    
    setLoading(true);
    
    try {
      logger.info('Attempting sign up with email', { email });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
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
        localStorage.setItem('pendingVerification', 'true');
        localStorage.setItem('pendingEmail', email);
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
    <AuthLayout 
      title="Create an Account"
      description="Join the Turf community and engage in quality debates."
      rightSideContent={{
        title: "Earn recognition for quality contributions",
        description: "Collect Harmony Points and receive Genius Awards for thoughtful insights."
      }}
    >
      <div className="w-full max-w-md">
        <ErrorMessage error={error} />
        
        <form className="space-y-6" onSubmit={handleSignUp} noValidate>
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
          
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            autoComplete="new-password"
            showStrength={true}
          />
          
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          
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
          
          <SubmitButton loading={loading} disabled={!agreedToTerms} loadingText="Signing Up...">
            Sign Up
          </SubmitButton>
          
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
