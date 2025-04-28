// lib/logger.ts

const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(...args);
    }
  },
};

export default logger;
