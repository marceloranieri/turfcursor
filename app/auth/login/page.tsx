import logger from '@/lib/logger';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (error: any) {
      logger.error('Login error:', error);
      toast.error('Failed to sign in');
      setErrors({
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="We're excited to see you again!"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <DiscordInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <DiscordInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-[var(--primary-blue)]"
            />
            <span className="ml-2 text-sm text-[var(--text-normal)]">
              Remember me
            </span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-[var(--primary-blue)] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <DiscordButton
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Log In
        </DiscordButton>

        <p className="text-center mt-4 text-[var(--text-muted)]">
          Need an account?{' '}
          <Link
            href="/auth/signup"
            className="text-[var(--primary-blue)] hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
} 