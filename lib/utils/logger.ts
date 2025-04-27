'use client';

import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  context?: Record<string, any>;
  shouldReport?: boolean;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  info(message: string, options: LogOptions = {}) {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, options.context));
    }
  }

  warn(message: string, options: LogOptions = {}) {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, options.context));
    }

    if (options.shouldReport) {
      Sentry.addBreadcrumb({
        category: 'warning',
        message,
        level: 'warning',
        data: options.context,
      });
    }
  }

  error(error: Error | string, options: LogOptions = {}) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const message = errorObj.message || String(errorObj);

    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message, options.context));
    }

    if (options.shouldReport) {
      Sentry.captureException(errorObj, {
        extra: options.context,
      });
    }
  }

  // For critical errors that should always be reported
  critical(error: Error | string, context?: Record<string, any>) {
    this.error(error, { context, shouldReport: true });
  }
}

export const logger = new Logger(); 