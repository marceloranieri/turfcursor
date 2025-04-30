'use client';

import { ThemeProvider } from '@/components/theme-provider';
import ToastProvider from '@/components/ui/Toast';
import { Toaster } from '@/components/ui/Toaster';
import { Analytics } from '@vercel/analytics/react';
import AuthProvider from '@/lib/auth/AuthProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <Analytics />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
} 