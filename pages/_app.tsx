'use client';

import type { AppProps } from 'next/app';
import { AuthProviderWrapper } from '../lib/auth/AuthProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProviderWrapper>
        <Component {...pageProps} />
      </AuthProviderWrapper>
    </ErrorBoundary>
  );
}

export default App; 