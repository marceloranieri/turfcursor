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
          console.log('Inline script loaded');
          function makeClickable() {
            console.log('Making elements clickable');
            const clickables = document.querySelectorAll('button, .channel, .reaction, .input-action, .member, .header-action');
            clickables.forEach(el => {
              el.style.cursor = 'pointer';
              el.addEventListener('click', function(e) {
                console.log('Element clicked:', this);
                if (this.classList.contains('channel')) {
                  const name = this.querySelector('.truncate')?.textContent;
                  if (name) {
                    const topics = {
                      'Remote Work Debate': '1',
                      'AI Ethics': '2',
                      'Climate Solutions': '3',
                      'Education Reform': '4',
                      'Cryptocurrency Future': '5'
                    };
                    window.location.href = '/chat/' + (topics[name] || '1');
                  }
                }
              });
            });
          }
          document.addEventListener('DOMContentLoaded', makeClickable);
          if (document.readyState === 'complete') makeClickable();
          setTimeout(makeClickable, 1000);
        ` }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          <SpeedInsights />
          <Script src="/fix.js" strategy="afterInteractive" />
          <script dangerouslySetInnerHTML={{ __html: `
            setTimeout(function() {
              if (window.initInteractivity) {
                console.log('Running initInteractivity from inline fallback');
                window.initInteractivity();
              }
            }, 2000);
          ` }} />
        </AuthProvider>
      </body>
    </html>
  );
}
