'use client';

import './globals.css';
import '@/app/styles/discord-theme.css';
import '@/app/styles/chat-layout.css';
import '@/app/styles/interaction-fixes.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import InteractionDebugger from '@/components/InteractionDebugger';
import { ThemeProvider } from '@/lib/theme/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turf - Social Debate Platform',
  description: 'Join daily debates and connect with others through meaningful discussions.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://vercel.com https://*.vercel.com;" />
        {/* Load our new consolidated fix script */}
        <script src="/interaction-fix.js" defer></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: 'dark:bg-background-secondary dark:text-text-primary',
                style: {
                  background: 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                },
              }}
            />
            <SpeedInsights />
            {/* Add our InteractionDebugger component */}
            <InteractionDebugger />
            {/* Fallback loading of fix script */}
            <Script src="/interaction-fix.js" strategy="afterInteractive" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
