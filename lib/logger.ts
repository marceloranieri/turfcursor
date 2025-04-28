// lib/logger.ts

export default function logger(...args: any[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}
