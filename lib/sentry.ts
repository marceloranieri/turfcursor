import logger from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!SENTRY_DSN) {
    logger.warn('Sentry DSN not found. Error tracking will be disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
      }),
    ],
  });
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV !== 'production') {
    logger.error('Error captured in development:', error, context);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[${level}] ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Setting user context:', user);
    return;
  }

  Sentry.setUser(user);
}

export function clearUserContext() {
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Clearing user context');
    return;
  }

  Sentry.setUser(null);
} 