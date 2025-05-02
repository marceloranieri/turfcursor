import './globals.css';
import { generateMetadata, viewport } from './metadata';
import ClientLayout from './client-layout';

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
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline';" />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
} 