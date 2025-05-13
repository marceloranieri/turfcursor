export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string | null
          email: string
          harmony_points: number
          genius_awards_remaining: number
          is_debate_maestro: boolean
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          email: string
          harmony_points?: number
          genius_awards_remaining?: number
          is_debate_maestro?: boolean
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          email?: string
          harmony_points?: number
          genius_awards_remaining?: number
          is_debate_maestro?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          user_id: string
          circle_id: string
          created_at: string
          updated_at: string | null
          upvotes: number
          downvotes: number
          is_pinned: boolean
          reply_to_id: string | null
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          circle_id: string
          created_at?: string
          updated_at?: string | null
          upvotes?: number
          downvotes?: number
          is_pinned?: boolean
          reply_to_id?: string | null
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          circle_id?: string
          created_at?: string
          updated_at?: string | null
          upvotes?: number
          downvotes?: number
          is_pinned?: boolean
          reply_to_id?: string | null
        }
      }
      reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      circles: {
        Row: {
          id: string
          topic: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          topic: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          topic?: string
          created_at?: string
          is_active?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general'
          content: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          user_id: string
          type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general'
          content: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general'
          content?: string
          created_at?: string
          is_read?: boolean
        }
      }
    }
  }
}

// Derived types for common use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type Circle = Database['public']['Tables']['circles']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row'] 