'use client';

import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 fade-slide-up">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-accent-secondary/10 p-4 rounded-full">
            <FaEnvelope className="text-4xl text-accent-secondary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-4">Check your email</h1>
        <p className="text-text-secondary mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        
        <div className="bg-background-tertiary rounded-md p-4 mb-6 text-left">
          <h2 className="font-semibold mb-2">Didn't receive the email?</h2>
          <ul className="text-sm space-y-2 text-text-secondary">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• Wait a few minutes and try again</li>
          </ul>
        </div>
        
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center text-accent-secondary hover:underline"
        >
          <FaArrowLeft className="mr-2" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 