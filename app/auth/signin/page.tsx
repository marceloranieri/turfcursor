'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/chat');
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-background">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-text-primary">Turf</h1>
        <p className="text-xl text-text-secondary mt-2">Daily Debates. Real Connections.</p>
      </div>
      
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        
        {error && (
          <div className="bg-danger/10 border border-danger text-text-primary p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-text-secondary mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-background-tertiary border border-background-tertiary rounded-md text-text-primary focus:border-accent-primary focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-text-secondary mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-background-tertiary border border-background-tertiary rounded-md text-text-primary focus:border-accent-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full button-primary"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-text-secondary text-center">Don&apos;t have an account?</p>
          <Link 
            href="/auth/signup"
            className="block text-center mt-2 text-accent-primary hover:underline"
          >
            Sign Up
          </Link>
        </div>
        
        <div className="mt-8">
          <p className="text-text-secondary text-center mb-4">Or continue with</p>
          <div className="flex justify-center space-x-4">
            <button className="social-auth-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button className="social-auth-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                <path d="M2 12h10"></path>
                <path d="M12 2v10"></path>
              </svg>
            </button>
            <button className="social-auth-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-text-muted text-xs text-center">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Link 
          href="/"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 