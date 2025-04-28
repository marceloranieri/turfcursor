import './globals.css';
import '@/app/styles/discord-theme.css';
import '@/app/styles/chat-layout.css';
import '@/app/styles/interaction-fixes.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turf App',
  description: 'A modern turf management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://vercel.com https://*.vercel.com;" />
        {/* Load our new consolidated fix script */}
        <script src="/interaction-fix.js" defer></script>
      </head>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
