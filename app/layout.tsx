// app/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import './globals.css';
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createLogger } from '@/lib/logger';

const logger = createLogger('RootLayout');

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: 'Turf - Engage in Meaningful Discussions',
    template: '%s | Turf'
  },
  description: 'Join Turf to engage in meaningful discussions, share ideas, and connect with others in a respectful environment.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Turf - Engage in Meaningful Discussions',
    description: 'Join Turf to engage in meaningful discussions, share ideas, and connect with others in a respectful environment.',
    siteName: 'Turf'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turf - Engage in Meaningful Discussions',
    description: 'Join Turf to engage in meaningful discussions, share ideas, and connect with others in a respectful environment.',
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
};

function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Add global error handler
    const errorHandler = (event: ErrorEvent) => {
      logger.error('Unhandled error:', event.error);
      // You might want to show a toast or update UI here
    };

    window.addEventListener('error', errorHandler);
    
    // Handle unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection:', event.reason);
      // You might want to show a toast or update UI here
    };

    window.addEventListener('unhandledrejection', rejectionHandler);

    // Mark as client-side rendered
    setIsClient(true);

    // Simulate a minimum load time to avoid flashes
    const timer = setTimeout(() => setLoading(false), 500);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      clearTimeout(timer);
    };
  }, []);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-primary">
          <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-text-secondary mb-4">
              We apologize for the inconvenience. An error has occurred and our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <AuthProvider>
        {children}
      </AuthProvider>
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
      <SpeedInsights />
      <Analytics />
    </ErrorBoundary>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
