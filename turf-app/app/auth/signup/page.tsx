'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, username);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      setErrors({
        email: 'This email might already be in use'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join the conversation today!"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <DiscordInput
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          error={errors.username}
          required
        />

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
          placeholder="Create a password"
          error={errors.password}
          required
        />

        <DiscordInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
        />

        <div className="mt-6">
          <DiscordButton
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </DiscordButton>
        </div>

        <p className="text-center mt-4 text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-[var(--primary-blue)] hover:underline"
          >
            Log In
          </Link>
        </p>

        <p className="text-xs text-center mt-4 text-[var(--text-muted)]">
          By registering, you agree to our{' '}
          <Link
            href="/terms"
            className="text-[var(--primary-blue)] hover:underline"
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link
            href="/privacy"
            className="text-[var(--primary-blue)] hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
} 