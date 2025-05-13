'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
        <p className="text-gray-600">
          We've sent a verification link to your email address.
          Please check your inbox and click the link to verify your account.
        </p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Check your email inbox (and spam folder)</li>
          <li>Click the verification link in the email</li>
          <li>You'll be redirected to complete your account setup</li>
          <li>Start participating in debates!</li>
        </ol>
      </div>
      
      <div className="text-center">
        <p className="mb-4 text-gray-600">
          Didn't receive the verification email?
        </p>
        <button 
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => window.location.href = '/auth/signup'}
        >
          Resend Verification Email
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-text-secondary">
          Already verified?{" "}
          <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
