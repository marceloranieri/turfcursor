import './globals.css';
import './styles/animations.css';
import { generateMetadata, viewport } from './metadata';
import ClientLayout from './(app)/client-layout';
import { AnimationProvider } from './contexts/AnimationContext';

export const dynamic = 'force-dynamic';
export { generateMetadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.giphy.com; frame-src 'self' https://*.supabase.co; media-src 'self'; form-action 'self';" />
      </head>
      <body suppressHydrationWarning>
        <AnimationProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AnimationProvider>
      </body>
    </html>
  );
} 