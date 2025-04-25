import './globals.css';
import '@/app/styles/discord-theme.css';
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
        ` }} />
        {/* Load direct fix script in the head with defer for reliability */}
        <script src="/direct-fix.js" defer></script>
        {/* Add interaction timing debug script */}
        <script src="/interaction-debug.js" defer></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          <SpeedInsights />
          {/* Fallback loading of fix script */}
          <Script src="/direct-fix.js" strategy="afterInteractive" />
          {/* Fallback loading of debug script */}
          <Script src="/interaction-debug.js" strategy="afterInteractive" />
        </AuthProvider>
      </body>
    </html>
  );
}
