// app/layout.tsx
import './globals.css';
import React from 'react';
import AuthProvider from '@/lib/auth/AuthProvider';

export const metadata = {
  title: 'Turf App',
  description: 'A better way to debate and connect',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
