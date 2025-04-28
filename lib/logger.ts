/**
 * Application logger with different log levels and environment-awareness
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
type LoggerOptions = {
  enabledLevels?: {
    [key in LogLevel]?: boolean;
  };
  enableAllInProduction?: boolean;
};

/**
 * Environment-aware logger with support for log levels and tagging
 */
class Logger {
  private options: LoggerOptions;
  private tag?: string;

  constructor(options: LoggerOptions = {}, tag?: string) {
    this.options = {
      enabledLevels: {
        log: process.env.NODE_ENV !== 'production',
        info: process.env.NODE_ENV !== 'production',
        warn: true, // Warnings enabled by default, even in production
        error: true, // Errors always enabled
        debug: process.env.NODE_ENV !== 'production',
        ...options.enabledLevels,
      },
      enableAllInProduction: options.enableAllInProduction || false,
    };
    this.tag = tag;
  }

  /**
   * Create a tagged logger instance for a specific component/module
   */
  tagged(tag: string): Logger {
    return new Logger(this.options, tag);
  }

  /**
   * Format log message with optional tag
   */
  private formatMessage(message: string): string {
    return this.tag ? `[${this.tag}] ${message}` : message;
  }

  /**
   * Check if a log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    if (this.options.enableAllInProduction) {
      return true;
    }

    return !!this.options.enabledLevels?.[level];
  }

  log(message: string, ...args: unknown[]): void {
    if (this.isLevelEnabled('log')) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.isLevelEnabled('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.isLevelEnabled('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.isLevelEnabled('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isLevelEnabled('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }
}

// Create default logger instance
const logger = new Logger();

export default logger;
