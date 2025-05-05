import { useState } from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';
import { FormInput } from '@/components/auth/FormInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import AuthLayout from '@/components/auth/AuthLayout';

const logger = createLogger('ForgotPasswordPage');

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      logger.info('Attempting password reset for email:', { email });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        logger.error('Password reset error:', error);
        setError(error.message);
        return;
      }

      logger.info('Password reset email sent successfully');
      setSuccess(true);
    } catch (err: any) {
      logger.error('Unexpected password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Your Password"
      description="Enter your email address and we'll send you a link to reset your password."
      rightSideContent={{
        title: "Secure Your Account",
        description: "We take your security seriously. Our password reset process is secure and straightforward."
      }}
    >
      <div className="w-full max-w-md">
        {error && <ErrorMessage error={error} />}
        
        {success ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="text-sm">
              Password reset instructions have been sent to your email address.
              Please check your inbox and follow the link to reset your password.
            </p>
            <p className="mt-4 text-sm">
              Didn't receive the email?{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-accent-primary hover:text-accent-primary-dark font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              autoComplete="email"
            />

            <SubmitButton loading={loading} loadingText="Sending reset link...">
              Send Reset Link
            </SubmitButton>

            <p className="mt-4 text-center text-sm text-text-secondary">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
