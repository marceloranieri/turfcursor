"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EyeIcon } from '@heroicons/react/24/outline';
import styles from './signup.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [birthdateError, setBirthdateError] = useState<string | null>(null);

  const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return null;
  };

  const validateBirthdate = (birthdate: string): string | null => {
    if (!birthdate) return "Birth date is required";
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 16) return "You must be at least 16 years old to register";
    if (age > 100) return "Please enter a valid birth date";
    return null;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setBirthdateError(null);
    const usernameValidationError = validateUsername(username);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const birthdateValidationError = validateBirthdate(birthdate);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      return;
    }
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    if (birthdateValidationError) {
      setBirthdateError(birthdateValidationError);
      return;
    }
    try {
      setIsLoading(true);
      // Check if username is already taken
      const { data: existingUsers, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
      if (usernameCheckError) throw usernameCheckError;
      if (existingUsers && existingUsers.length > 0) {
        setUsernameError('This username is already taken');
        setIsLoading(false);
        return;
      }
      // Sign up the user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            birthdate,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      if (signUpError) {
        throw signUpError;
      }
      if (data?.user) {
        // Create a profile entry with the username
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username,
              birthdate,
              created_at: new Date().toISOString(),
            }
          ]);
        if (profileError) throw profileError;
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });
      if (signInError) {
        throw signInError;
      }
    } catch (error: any) {
      console.error(`${provider} signup failed:`, error);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundImage} />
      <div className={styles.contentContainer}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h2>
            <p className="text-gray-500 mb-6">Join daily-curated debates on your favorite topics</p>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    usernameError ? 'border-red-500' : 'border-gray-200'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                  placeholder="cooluser123"
                />
                {usernameError && <p className="mt-1 text-sm text-red-600">{usernameError}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    emailError ? 'border-red-500' : 'border-gray-200'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                  placeholder="name@example.com"
                />
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2.5 bg-gray-50 border ${
                      passwordError ? 'border-red-500' : 'border-gray-200'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none pr-10`}
                    placeholder="•••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>
              <div>
                <label htmlFor="birthdate" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  BIRTH DATE
                </label>
                <input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    birthdateError ? 'border-red-500' : 'border-gray-200'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                  max={new Date().toISOString().split('T')[0]}
                  placeholder="MM/DD/YYYY"
                />
                {birthdateError && <p className="mt-1 text-sm text-red-600">{birthdateError}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Continue'}
              </button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">or</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                    />
                  </svg>
                  Continue with Facebook
                </button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/signin" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              By registering, you agree to Turf's{' '}
              <Link href="/legal/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}