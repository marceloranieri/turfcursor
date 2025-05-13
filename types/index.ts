import { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  session: Session | null
  error: Error | null
  accessToken: string | null
}

export interface Message {
  id: string
  content: string
  user_id: string
  isBot: boolean
  created_at: string
  reactions?: Reaction[]
  type?: string
  metadata?: {
    title?: string
    description?: string
    url?: string
  }
}

export interface Reaction {
  id: string
  type: string
  user_id: string
  message_id: string
  created_at: string
  metadata?: {
    emoji?: string
    label?: string
    [key: string]: unknown
  }
}

export interface Topic {
  id: string
  title: string
  category: string
  description?: string
  created_at: string
  updated_at: string
  user_id?: string
  status?: 'active' | 'archived' | 'draft'
  tags?: string[]
  metadata?: {
    [key: string]: unknown
  }
}

export interface AuthResponse {
  user: User | null
  session: Session | null
  error: Error | null
}

export interface ActivityFeedProps {
  username: string
  token?: string
  limit?: number
  selectedRepos?: string[]
  onError?: (error: Error) => void
  onRateLimitExceeded?: () => void
  className?: string
  showAvatar?: boolean
  showRepoName?: boolean
  showEventType?: boolean
  showTimestamp?: boolean
}

export interface Logger {
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  debug: (message: string, ...args: unknown[]) => void
  tagged: (tag: string) => Logger
  setLevel: (level: 'debug' | 'info' | 'warn' | 'error') => void
  getLevel: () => string
  withContext: (context: Record<string, unknown>) => Logger
} 