'use client';

import type { AppProps } from 'next/app';
import AuthProvider from '../lib/auth/AuthProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 