"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DesktopAuthPageProps {
  children?: React.ReactNode;
  mode?: 'login' | 'signup' | 'forgot-password';
  title?: string;
}

const DesktopAuthPage: React.FC<DesktopAuthPageProps> = ({ 
  children, 
  mode = 'login',
  title = mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      // Sign in successful, redirect happens automatically
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      // Sign in successful, redirect happens automatically
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      
      if (error) throw error;
      // Sign in successful, redirect happens automatically
    } catch (err: any) {
      console.error('Error signing in with Facebook:', err);
      setError(err.message || 'Failed to sign in with Facebook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">TURF</h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Turf 👋</h2>
            <p className="text-gray-600 mb-6">Chatrooms with daily-curated debates on your favorite topics.</p>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {error && (
              <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1D2939] hover:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Google
              </button>

              <button
                onClick={handleFacebookSignIn}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't you have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>

          <div className="text-center mt-8 text-xs text-gray-400">
            © 2023 ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* Right side - Debate preview */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            <Image 
              src="/star_rings_turf.webp" 
              alt="Chat debate preview"
              fill
              style={{ objectFit: "cover" }}
            />
            
            {/* Sample debate overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white p-4 text-center">
              <h3 className="text-xl font-semibold">Could Luke have resisted the One Ring better than Frodo? Or the Force just speeds up corruption?</h3>
            </div>
            
            {/* Sample chat bubbles - these could be components */}
            <div className="absolute top-1/4 left-1/4 bg-white rounded-lg p-3 shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  J
                </div>
                <span className="font-medium">JediMaster42</span>
              </div>
              <p className="text-sm">
                Luke couldn't even resist a hologram of his sister lmao, Frodo carried that ring for MONTHS 🙌
              </p>
            </div>
            
            <div className="absolute top-1/3 right-1/4 bg-white rounded-lg p-3 shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                  T
                </div>
                <span className="font-medium">Tolkien_Lord</span>
              </div>
              <p className="text-sm">
                The Ring corrupts power. Luke's stronger = faster fall
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAuthPage; 