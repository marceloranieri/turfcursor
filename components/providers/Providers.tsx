'use client';

import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/Toast';
import { Analytics } from '@vercel/analytics/react';
import AuthProvider from '@/lib/auth/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
} 