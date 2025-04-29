'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import logger from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logger service
    logger.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary">
          <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-text-secondary mb-4">
              We apologize for the inconvenience. An error has occurred and our team has been notified.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
            >
              Try again
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-background-tertiary rounded">
                <p className="text-sm font-mono text-text-secondary break-all">
                  {this.state.error?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
