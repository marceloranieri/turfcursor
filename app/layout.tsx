// app/layout.tsx
'use client';

import './globals.css';
import { metadata } from './metadata';
import { AuthProvider } from '@/lib/auth/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering if needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
