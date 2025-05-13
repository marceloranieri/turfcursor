'use client';

import { useState } from 'react';
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
        <p className="text-gray-600">Enter your email address and we&apos;ll send you a link to reset your password.</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}
      
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-text-secondary">
          Remember your password?{" "}
          <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
