import './globals.css';
import './styles/animations.css';
import { AnimationProvider } from './contexts/AnimationContext';
import ClientLayout from './(app)/client-layout';
const { cspToString, cspConfig } = require('../csp-config');

export const dynamic = 'force-dynamic';

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
          <ClientLayout>{children}</ClientLayout>
        </AnimationProvider>
      </body>
    </html>
  );
} 