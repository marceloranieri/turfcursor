export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  harmony_points: number;
  genius_awards_received: number;
  genius_awards_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Author type for messages and replies
export interface Author {
  id: string;
  name: string;
  avatar: string;
  isBot?: boolean;
}

// Reaction type for message reactions
export interface Reaction {
  emoji: string;
  count: number;
  active?: boolean;
}

// Reply type for message replies
export interface Reply {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}

// Attachment type for message media
export interface Attachment {
  type: 'image' | 'video' | 'file' | 'audio';
  url: string;
  alt?: string;
  size?: number;
  name?: string;
}

// Main Message type
export interface Message {
  id: string;
  topic_id: string;
  author: Author;
  content: string;
  timestamp: string;
  is_pinned: boolean;
  is_wizard: boolean;
  reactions?: Reaction[];
  replies?: Reply[];
  attachment?: Attachment;
  created_at: string;
  updated_at: string;
}

// User type for members
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  role?: 'admin' | 'moderator' | 'member' | 'guest';
  status?: 'online' | 'offline' | 'away' | 'dnd';
  isBot?: boolean;
  harmony_points?: number;
  genius_awards_received?: number;
  genius_awards_remaining?: number;
  created_at?: string;
  updated_at?: string;
}

// Notification type
export interface Notification {
  id: string;
  userId: string;
  type: 'reaction' | 'reply' | 'mention' | 'system';
  messageId?: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Form submission types
export interface MessageFormData {
  content: string;
  attachment?: File;
  replyToId?: string;
} 