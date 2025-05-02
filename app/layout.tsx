// app/layout.tsx
import './globals.css';
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ErrorBoundary } from 'react-error-boundary';

export const metadata: Metadata = {
  title: {
    default: 'Turf App',
    template: '%s | Turf App',
  },
  description: 'A better way to debate and connect',
  applicationName: 'Turf App',
  authors: [{ name: 'Turf Team' }],
  keywords: ['debate', 'discussion', 'community', 'social'],
  openGraph: {
    type: 'website',
    siteName: 'Turf App',
    title: 'Turf App',
    description: 'A better way to debate and connect',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="bg-background-secondary rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h2>
        <p className="text-text-secondary mb-4">
          We're sorry, but something went wrong. Please try refreshing the page.
        </p>
        <pre className="bg-background-primary p-4 rounded text-sm overflow-auto">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
