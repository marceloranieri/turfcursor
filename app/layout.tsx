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
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.vercel.app https://app.turfyeah.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://media.giphy.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.giphy.com https://app.turfyeah.com; frame-src 'self' https://*.supabase.co https://accounts.google.com; media-src 'self' https://media.giphy.com; form-action 'self'; base-uri 'self'; object-src 'none';" />
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