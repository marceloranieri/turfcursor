import './globals.css';
import './styles/animations.css';
import { generateMetadata, viewport } from './metadata';
import ClientLayout from './(app)/client-layout';
import { AnimationProvider } from './contexts/AnimationContext';
import { cspToString, cspConfig } from '../csp-config';

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
        <meta
          httpEquiv="Content-Security-Policy"
          content={cspToString(cspConfig)}
        />
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