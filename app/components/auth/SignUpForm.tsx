'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SignUpForm');

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Attempting signup with:', { email, username });
      
      const { data, error } = await signUpWithEmail(email, password, {
        username,
        full_name: username,
      });
      
      if (error) {
        logger.error('Signup error:', error);
        throw error;
      }
      
      logger.info('Signup successful:', data);
      
      // Store verification flag in localStorage
      if (data?.user?.confirmation_sent_at) {
        localStorage.setItem('pendingVerification', 'true');
        setSuccessMessage('Please check your email to verify your account.');
      } else {
        setSuccessMessage('Sign-up successful! You can now sign in.');
      }
      
      // Redirect to appropriate page after a short delay
      setTimeout(() => {
        if (data?.user?.confirmation_sent_at) {
          router.push('/auth/verify-email');
        } else {
          router.push('/auth/signin');
        }
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background-secondary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
        Create your account
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            required
            minLength={8}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading 
              ? 'bg-accent-primary-dark cursor-not-allowed' 
              : 'bg-accent-primary hover:bg-accent-primary-dark'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <a href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
          Sign in
        </a>
      </div>
    </div>
  );
} 