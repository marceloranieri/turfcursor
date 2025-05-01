'use client';

import React, { useEffect } from 'react';
import { useAuth, AuthProvider } from '@/lib/auth/AuthContext';

export function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  let hasExistingContext = true;

  try {
    // Try to use the existing auth context
    useAuth();
  } catch (e) {
    // If we get here, there's no AuthProvider above us
    hasExistingContext = false;
  }

  useEffect(() => {
    console.log('[Auth] Client auth wrapper mounted, provider created:', !hasExistingContext);
    return () => console.log('[Auth] Client auth wrapper unmounting');
  }, [hasExistingContext]);

  // If context exists, just render children directly
  if (hasExistingContext) {
    return <>{children}</>;
  }

  // Otherwise, wrap with a new provider
  console.log('[Auth] Creating new client-side auth provider');
  return <AuthProvider>{children}</AuthProvider>;
} 