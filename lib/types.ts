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
  title: string;
  description: string;
  category: string;
  active: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_pinned: boolean;
  is_wizard: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
  reactions?: Reaction[];
  replies?: Message[];
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  type: string;
  created_at: string;
  user?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'pin' | 'genius' | 'harmony' | 'wizard';
  content: string;
  read: boolean;
  created_at: string;
}

export type ReactionType = 'upvote' | 'downvote' | 'genius' | string; // string for emoji codes

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
  author: Author;
  content: string;
  timestamp: string;
  reactions?: Reaction[];
  replies?: Reply[];
  attachment?: Attachment;
  isBot?: boolean;
  parentId?: string;
  topicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Topic type
export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// User type for members
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: 'admin' | 'moderator' | 'member' | 'guest';
  status?: 'online' | 'offline' | 'away' | 'dnd';
  isBot?: boolean;
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