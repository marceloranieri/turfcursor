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
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
} 