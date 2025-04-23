'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, you would connect to Supabase auth
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       username,
      //     }
      //   }
      // });
      
      // if (error) throw error;
      
      // For demo, simulate successful signup
      setTimeout(() => {
        setLoading(false);
        router.push('/onboarding/welcome');
      }, 1000);
    } catch (err) {
      setError('Error creating account. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background-secondary">
      <div className="max-w-md w-full bg-background-tertiary rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join Turf and start debating!</p>
        </div>
        
        {error && (
          <div className="bg-danger bg-opacity-20 text-danger p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-text-secondary mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="YourUsername"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-text-muted text-xs mt-1">
              Must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-text-secondary mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 mt-1 rounded border-background-secondary text-accent-primary focus:ring-accent-primary"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-text-secondary">
              I agree to the{' '}
              <Link href="/terms" className="text-accent-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-accent-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <button
            type="submit"
            className={`button-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-accent-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-background-secondary"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-tertiary text-text-secondary">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="py-2 px-4 border border-background-secondary rounded-md hover:bg-background-secondary">
              <div className="flex justify-center">
                <span className="sr-only">Sign up with Google</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </div>
            </button>
            
            <button className="py-2 px-4 border border-background-secondary rounded-md hover:bg-background-secondary">
              <div className="flex justify-center">
                <span className="sr-only">Sign up with Facebook</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            
            <button className="py-2 px-4 border border-background-secondary rounded-md hover:bg-background-secondary">
              <div className="flex justify-center">
                <span className="sr-only">Sign up with GitHub</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 