'use client';

import React from 'react';
import { useAuth, AuthProvider } from '@/lib/auth/AuthContext';

export function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  try {
    // Try to use the existing auth context
    useAuth();
    // If it works, just render children directly
    return <>{children}</>;
  } catch (e) {
    // If we get here, there's no AuthProvider above us, so we need to add one
    console.log('Auth context not found, creating client-side provider');
    return <AuthProvider>{children}</AuthProvider>;
  }
} 