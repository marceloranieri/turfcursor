// lib/logger.ts

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  warn: (...args: any[]) => {
    // We log warnings in both dev and prod as they might indicate issues
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Always log errors as they're critical
    console.error(...args);
    
    // In production, you might want to send errors to a monitoring service
    if (!isDevelopment) {
      // TODO: Add error reporting service integration here
      // e.g., Sentry, LogRocket, etc.
    }
  },
};

export default logger;
