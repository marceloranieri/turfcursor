'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';
  const description = searchParams.get('description') || '';

  const errorMessages = {
    'server_error': 'There was a problem creating your account. Our team has been notified.',
    'session_exchange': 'We couldn\'t complete your sign in. Please try again.',
    'no_code': 'The authentication code is missing. Please try signing in again.',
    'no_session': 'We couldn\'t create your session. Please try signing in again.',
    'unknown': 'An unexpected error occurred during authentication.'
  };

  const message = errorMessages[reason as keyof typeof errorMessages] || errorMessages.unknown;

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
        <p className="text-gray-700">{message}</p>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
        <p className="text-sm text-red-700 mb-2">
          Error code: {reason}
        </p>
        {description && (
          <p className="text-sm text-red-700">
            Details: {description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        <Link 
          href="/auth/signin" 
          className="block w-full text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Sign In
        </Link>
        
        <Link 
          href="/" 
          className="block w-full text-center border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 