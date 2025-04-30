'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ToastProvider } from './ToastContext';
import { Toast } from './Toast';

function ToastErrorFallback() {
  // Silent failure for toast components
  return null;
}

interface ToastWrapperProps {
  children: React.ReactNode;
}

export function ToastWrapper({ children }: ToastWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={ToastErrorFallback}>
      <ToastProvider>
        {children}
        <Toast />
      </ToastProvider>
    </ErrorBoundary>
  );
} 