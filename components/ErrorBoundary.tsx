'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import logger from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => Promise<void> | void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isResetting: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isResetting: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, isResetting: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logger service
    logger.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  async handleReset() {
    this.setState({ isResetting: true });
    try {
      await this.props.onReset?.();
      this.setState({ hasError: false, error: undefined });
    } catch (error) {
      logger.error('Error during reset:', error);
      this.setState({ error: error as Error });
    } finally {
      this.setState({ isResetting: false });
    }
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
              onClick={this.handleReset}
              disabled={this.state.isResetting}
              className={`w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors ${
                this.state.isResetting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {this.state.isResetting ? 'Resetting...' : 'Try again'}
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-background-tertiary rounded">
                <p className="text-sm font-mono text-text-secondary break-all">
                  {this.state.error.message}
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
