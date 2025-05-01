'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ChatRoom() {
  const { user } = useAuth();
  const [loadingTooLong, setLoadingTooLong] = useState(false);

  useEffect(() => {
    console.log('ChatRoom mounted, user:', user);
    return () => console.log('ChatRoom unmounted');
  }, [user]);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setLoadingTooLong(true), 5000);
      return () => clearTimeout(timer);
    }
    setLoadingTooLong(false);
  }, [user]);

  const refreshPage = () => {
    window.location.reload();
  };

  try {
    if (!user) {
      return loadingTooLong ? (
        <div className="p-6 text-center">
          <p className="text-amber-600 mb-4">Taking longer than expected...</p>
          <button
            onClick={refreshPage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="animate-pulse">Loading user...</div>
        </div>
      );
    }

    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to Chat, {user.email} ✅</h1>
        <p className="mt-2 text-gray-500">
          Your chat is ready to use. User authentication is working correctly.
        </p>
      </div>
    );
  } catch (error: any) {
    console.error('ChatRoom failed to render:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: error.constructor.name
    });

    // More specific error messages based on error type
    if (error.message?.includes('auth')) {
      return (
        <div className="p-6 text-red-600 text-center">
          <p className="mb-4">⚠️ Authentication error. Please sign in again.</p>
          <button
            onClick={refreshPage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div className="p-6 text-red-600 text-center">
        <p className="mb-4">⚠️ Something went wrong while loading the chat.</p>
        <button
          onClick={refreshPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
} 