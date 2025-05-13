import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './styles/animations.css';
import { AnimationProvider } from './contexts/AnimationContext';
import ClientLayout from './client-layout';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
const { cspToString, cspConfig } = require('../csp-config');

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'Turf - Chatrooms with daily-curated debates',
  description: 'Join engaging discussions on your favorite topics with like-minded people.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Turf',
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={cspToString(cspConfig)}
        />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <AnimationProvider>
          <ClientLayout>{children}</ClientLayout>
        </AnimationProvider>
      </body>
    </html>
  );
} 