'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/AuthContext';
import Script from 'next/script';
import InteractionDebugger from '@/components/InteractionDebugger';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { ToastProvider } from '@/components/ui/ToastContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="flex-grow">
            {children}
          </div>
          <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
            <a href="/legal/privacy" className="hover:underline">Privacy Policy</a> • <a href="/legal/terms" className="hover:underline">Terms of Service</a>
          </footer>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-background-secondary dark:text-text-primary',
              style: {
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)',
              },
            }}
          />
          {/* Add our InteractionDebugger component */}
          <InteractionDebugger />
          {/* Fallback loading of fix script */}
          <Script src="/interaction-fix.js" strategy="afterInteractive" />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 