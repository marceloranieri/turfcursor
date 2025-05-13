"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    
    // Validate inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        // Redirect to verification page
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
      // Redirect is handled by Supabase
    } catch (error: any) {
      console.error(`${provider} signup failed:`, error);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-no-repeat bg-cover bg-center"
         style={{ backgroundImage: 'url("/turf_app_social_signup.webp")' }}>
      
      {/* Subtle overlay to improve text readability if needed */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Main container - centered over background */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6">
        {/* Form container with white background */}
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Create your Turf account</h1>
              <p className="text-gray-500 text-sm mt-1">Join daily-curated debates on your favorite topics</p>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Sign-up form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full p-2.5 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  required
                />
                {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••••"
                    className={`w-full p-2.5 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors focus:outline-none disabled:opacity-70 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Continue'}
              </button>
            </form>

            {/* Or divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialSignUp('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialSignUp('facebook')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                  />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Footer links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-500 hover:text-blue-700 font-medium">
                  Log In
                </Link>
              </p>
            </div>
          </div>

          {/* Terms of service footer */}
          <div className="bg-gray-50 py-3 px-6 text-xs text-center text-gray-500 border-t border-gray-200">
            By registering, you agree to Turf's{' '}
            <Link href="/legal/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
