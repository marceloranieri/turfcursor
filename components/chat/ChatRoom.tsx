'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ChatRoom() {
  const { user } = useAuth();

  useEffect(() => {
    console.log('ChatRoom mounted, user:', user);
    return () => console.log('ChatRoom unmounted');
  }, [user]);

  try {
    if (!user) {
      return <div className="p-6 text-center">Loading user...</div>;
    }

    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to Chat, {user.email} ✅</h1>
        <p className="mt-2 text-gray-500">
          Your chat is ready to use. User authentication is working correctly.
        </p>
      </div>
    );
  } catch (error) {
    console.error('ChatRoom failed to render:', error);
    return (
      <div className="p-6 text-red-600 text-center">
        ⚠️ Something went wrong while loading the chat.
      </div>
    );
  }
} 