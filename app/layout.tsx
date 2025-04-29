// app/layout.tsx
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { Toaster } from '@/components/ui/Toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Analytics } from '@/components/Analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turf - Your AI Chat Assistant',
  description: 'Chat with AI about anything, anytime.',
  keywords: ['AI', 'chat', 'assistant', 'turf'],
  authors: [{ name: 'Turf Team' }],
  creator: 'Turf Team',
  publisher: 'Turf',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://turf.app',
    title: 'Turf - Your AI Chat Assistant',
    description: 'Chat with AI about anything, anytime.',
    siteName: 'Turf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turf - Your AI Chat Assistant',
    description: 'Chat with AI about anything, anytime.',
    creator: '@turfapp',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
