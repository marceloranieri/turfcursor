'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useToast } from '@/components/ui/ToastContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function ProfileContent() {
  const { user } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-background-secondary rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-white text-2xl font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-text-secondary">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <NotificationCenter />
    </div>
  );
} 