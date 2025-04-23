'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, UserAddIcon } from '@heroicons/react/outline';

export default function GuestMode() {
  const router = useRouter();
  
  const handleContinueAsGuest = () => {
    router.push('/chat');
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background-secondary">
      <div className="max-w-md w-full bg-background-tertiary rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-primary mb-2">Guest Mode</h1>
          <p className="text-text-secondary">Preview Turf without creating an account</p>
        </div>
        
        <div className="my-6 p-4 border border-background-secondary rounded-lg bg-background">
          <div className="flex items-start mb-4">
            <div className="bg-warning bg-opacity-20 p-2 rounded-full mr-3">
              <EyeIcon className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">What you can do as a guest:</h3>
              <ul className="text-text-secondary text-sm space-y-2 list-disc pl-5">
                <li>View all ongoing debates</li>
                <li>Read messages and discussions</li>
                <li>Experience our Discord-style interface</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-accent-secondary bg-opacity-20 p-2 rounded-full mr-3">
              <UserAddIcon className="h-6 w-6 text-accent-secondary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create an account to:</h3>
              <ul className="text-text-secondary text-sm space-y-2 list-disc pl-5">
                <li>Send messages and participate in debates</li>
                <li>React to posts and award Genius points</li>
                <li>Earn Harmony Points and build your profile</li>
                <li>Experience all features fully</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <button 
            onClick={handleContinueAsGuest}
            className="button-secondary w-full flex items-center justify-center"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            Continue as Guest
          </button>
          
          <div className="flex gap-4">
            <Link 
              href="/auth/signup" 
              className="button-primary flex-1 flex items-center justify-center"
            >
              Create Account
            </Link>
            
            <Link 
              href="/auth/signin" 
              className="flex-1 text-center py-2 text-accent-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-text-muted text-xs">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
} 