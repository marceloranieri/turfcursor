import './globals.css';
import '@/app/styles/discord-theme.css';
import '@/app/styles/chat-layout.css';
import '@/app/styles/interaction-fixes.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turf - Social Debate Platform',
  description: 'Join daily debates and connect with others through meaningful discussions.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://vercel.com https://*.vercel.com;" />
        <script dangerouslySetInnerHTML={{ __html: `
          console.log('Basic inline script loaded');
          function addBasicInteractivity() {
            console.log('Adding basic click handlers');
            // Add click handlers to channels
            document.querySelectorAll('.channel').forEach(function(el) {
              el.style.cursor = 'pointer';
              el.addEventListener('click', function() {
                var name = this.querySelector('.truncate')?.textContent;
                if (name) {
                  var topics = {
                    'Remote Work Debate': '1',
                    'AI Ethics': '2',
                    'Climate Solutions': '3',
                    'Education Reform': '4',
                    'Cryptocurrency Future': '5'
                  };
                  var id = topics[name] || '1';
                  window.location.href = '/chat/' + id;
                }
              });
            });
          }
          // Execute when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addBasicInteractivity);
          } else {
            addBasicInteractivity();
          }
          // Try again after a short delay
          setTimeout(addBasicInteractivity, 1000);
          
          // Use modern page lifecycle events instead of unload
          window.addEventListener('pagehide', function(event) {
            console.log('Page is being hidden, saving state if needed');
            // Any cleanup or state saving can go here
          });
          
          window.addEventListener('beforeunload', function(event) {
            console.log('Page is about to unload, performing final tasks');
            // Final cleanup tasks can go here
          });
        ` }} />
        {/* Load CSP-compliant fix script in the head with defer for reliability */}
        <script src="/fix-csp.js" defer></script>
        {/* Add interaction timing debug script */}
        <script src="/interaction-debug.js" defer></script>
        {/* Add direct fix script */}
        <script src="/direct-fix.js" defer></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          <SpeedInsights />
          {/* Fallback loading of CSP-compliant fix script */}
          <Script src="/fix-csp.js" strategy="afterInteractive" />
          {/* Fallback loading of debug script */}
          <Script src="/interaction-debug.js" strategy="afterInteractive" />
          {/* Fallback loading of direct fix script */}
          <Script src="/direct-fix.js" strategy="afterInteractive" />
        </AuthProvider>
      </body>
    </html>
  );
}
