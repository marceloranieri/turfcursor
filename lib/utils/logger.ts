import { Logger } from '@/types'

export const createLogger = (tag: string): Logger => {
  const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  const shouldLog = (level: keyof typeof levels) => {
    return levels[level] >= levels[logLevel as keyof typeof levels]
  }

  const formatMessage = (level: string, message: string, args: unknown[]) => {
    const timestamp = new Date().toISOString()
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] [${tag}] ${message}${formattedArgs}`
  }

  const logger: Logger = {
    info: (message: string, ...args: unknown[]) => {
      if (shouldLog('info')) {
        console.info(formatMessage('info', message, args))
      }
    },
    warn: (message: string, ...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', message, args))
      }
    },
    error: (message: string, ...args: unknown[]) => {
      if (shouldLog('error')) {
        console.error(formatMessage('error', message, args))
      }
    },
    debug: (message: string, ...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.debug(formatMessage('debug', message, args))
      }
    },
    tagged: (newTag: string) => createLogger(`${tag}:${newTag}`),
    setLevel: (level: 'debug' | 'info' | 'warn' | 'error') => {
      process.env.NEXT_PUBLIC_LOG_LEVEL = level
    },
    getLevel: () => logLevel,
    withContext: (context: Record<string, unknown>) => {
      return createLogger(`${tag}:${JSON.stringify(context)}`)
    },
  }

  return logger
}

export type { Logger } 