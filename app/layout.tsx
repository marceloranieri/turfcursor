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
  title: 'Turf - Your GitHub Companion',
  description: 'A modern GitHub client with powerful features and a beautiful interface.',
  keywords: ['github', 'client', 'git', 'repository', 'code', 'collaboration'],
  authors: [{ name: 'Turf Team', url: 'https://turf.dev' }],
  openGraph: {
    title: 'Turf - Your GitHub Companion',
    description: 'A modern GitHub client with powerful features and a beautiful interface.',
    url: 'https://turf.dev',
    siteName: 'Turf',
    images: [
      {
        url: 'https://turf.dev/og.png',
        width: 1200,
        height: 630,
        alt: 'Turf - Your GitHub Companion',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
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
