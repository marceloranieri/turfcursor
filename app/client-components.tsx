'use client';

import React from 'react';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuthProvider } from '@/lib/auth/AuthProvider';

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export function ClientErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

export function ClientAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--background-secondary)',
          color: 'var(--text-primary)',
        },
      }}
    />
  );
}

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function ClientSuspense({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
} 