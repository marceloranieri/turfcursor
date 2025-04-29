/**
 * Application logger with different log levels and environment-awareness
 */

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[${this.context}] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[${this.context}] ${message}`, ...args);
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    console.error(`[${this.context}] ${message}`, error, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${this.context}] ${message}`, ...args);
    }
  }

  tagged(tag: string): Logger {
    return new Logger(`${this.context}:${tag}`);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export default createLogger('App');
