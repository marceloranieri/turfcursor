'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ChatRoom() {
  const [mounted, setMounted] = useState(false);
  
  // Safely access auth context with error handling
  let authData = { user: null, isLoading: true };
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth error in ChatRoom:', error);
    // Will show error UI below
  }
  
  const { user, isLoading } = authData;
  
  // Debug mounting lifecycle
  useEffect(() => {
    console.log('ChatRoom mounted, auth state:', { user, isLoading });
    setMounted(true);
    return () => {
      console.log('ChatRoom unmounting');
      setMounted(false);
    };
  }, [user, isLoading]);

  // Safety check for mounting
  if (!mounted) {
    return <div className="p-4">Initializing chat...</div>;
  }

  // Loading state
  if (isLoading) {
    return <div className="p-4">Loading authentication...</div>;
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please sign in to access the chat.</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => window.location.href = '/auth/signin'}
        >
          Sign In
        </button>
      </div>
    );
  }

  // Chat UI when authenticated
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Room</h2>
      <p className="text-gray-600">Welcome, {user.email || 'User'}!</p>
      {/* Your actual chat UI */}
    </div>
  );
} 