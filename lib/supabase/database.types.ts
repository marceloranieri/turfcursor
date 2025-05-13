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
      users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          created_at: string
          harmony_points: number
          genius_awards_received: number
          genius_awards_remaining: number
          is_debate_maestro: boolean
        }
        Insert: {
          id: string
          username: string
          email: string
          avatar_url?: string | null
          created_at?: string
          harmony_points?: number
          genius_awards_received?: number
          genius_awards_remaining?: number
          is_debate_maestro?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          harmony_points?: number
          genius_awards_received?: number
          genius_awards_remaining?: number
          is_debate_maestro?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          circle_id: string
          reply_to: string | null
          is_pinned: boolean
          is_wizard: boolean
          upvotes: number
          downvotes: number
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          circle_id: string
          reply_to?: string | null
          is_pinned?: boolean
          is_wizard?: boolean
          upvotes?: number
          downvotes?: number
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          circle_id?: string
          reply_to?: string | null
          is_pinned?: boolean
          is_wizard?: boolean
          upvotes?: number
          downvotes?: number
        }
      }
      reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          type: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          type: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          type?: string
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
          content: string
          type: string
          is_read: boolean
          created_at: string
          related_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          type: string
          is_read?: boolean
          created_at?: string
          related_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          type?: string
          is_read?: boolean
          created_at?: string
          related_id?: string | null
        }
      }
      topics: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          created_at: string
          active: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          created_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          created_at?: string
          active?: boolean
        }
      }
      topic_history: {
        Row: {
          topic_id: string
          used_on: string
        }
        Insert: {
          topic_id: string
          used_on?: string
        }
        Update: {
          topic_id?: string
          used_on?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_genius: {
        Args: {
          p_message_id: string
          p_from_user_id: string
          p_to_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 