// lib/logger.ts

const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
  
  warn: (...args: any[]) => {
    // We log warnings in both dev and prod as they might indicate issues
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Always log errors as they're critical
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
    
    // In production, you might want to send errors to a monitoring service
    if (!process.env.NODE_ENV === 'development') {
      // TODO: Add error reporting service integration here
      // e.g., Sentry, LogRocket, etc.
    }
  },
};

export default logger;
