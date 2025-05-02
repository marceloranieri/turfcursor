// app/layout.tsx
import './globals.css';
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
      </body>
    </html>
  );
}
