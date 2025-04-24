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