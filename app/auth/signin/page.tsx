'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // This would typically use Supabase auth
    // For now, let's simulate a successful login
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to home page after successful sign in
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen flex flex-col items-center justify-center bg-background-primary p-4">
      <div className="auth-card bg-background-secondary rounded-lg p-6 w-full max-w-md">
        <h1 className="auth-title text-center text-2xl font-bold text-text-primary mb-6">Welcome back to Turf</h1>
        
        {error && (
          <div className="error-message bg-danger/10 border border-danger text-danger p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block text-text-secondary text-sm mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background-tertiary text-text-primary border border-background-tertiary rounded p-2.5 focus:border-accent-primary focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-text-secondary text-sm">Password</label>
              <Link href="/auth/forgot-password" className="text-accent-secondary text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background-tertiary text-text-primary border border-background-tertiary rounded p-2.5 focus:border-accent-primary focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-accent-primary text-background-primary font-bold py-2.5 rounded transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gold'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="social-auth mt-6">
          <div className="text-center text-text-secondary text-sm mb-4">Or sign in with</div>
          <div className="flex justify-center space-x-4">
            <button className="social-auth-button bg-background-tertiary hover:bg-background-primary/80 transition-colors">
              G
            </button>
            <button className="social-auth-button bg-background-tertiary hover:bg-background-primary/80 transition-colors">
              F
            </button>
            <button className="social-auth-button bg-background-tertiary hover:bg-background-primary/80 transition-colors">
              A
            </button>
          </div>
        </div>
        
        <div className="auth-footer mt-6 text-center text-text-secondary text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-accent-secondary hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 