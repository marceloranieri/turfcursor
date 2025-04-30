export interface RepositoryCardProps {
  username: string;
  limit?: number;
  onError?: (error: Error) => void;
  className?: string;
}

export interface Reaction {
  type: 'upvote' | 'downvote';
  user_id: string;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  reactions?: Reaction[];
  type?: string;
  metadata?: {
    title?: string;
    description?: string;
    url?: string;
  };
  isBot?: boolean; // Adding isBot as optional
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: Array<{
      sha: string;
      message: string;
      url: string;
    }>;
    issue?: {
      number: number;
      title: string;
      url: string;
    };
    pull_request?: {
      number: number;
      title: string;
      url: string;
    };
  };
  created_at: string;
} 