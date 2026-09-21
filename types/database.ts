export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  cover_photo?: string;
  karma: number;
  is_admin: boolean;
  created_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  author: string;
  author_avatar?: string;
  text: string;
  image_url?: string | null;
  video_url?: string | null;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    total_votes: number;
    user_voted?: number;
  } | null;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author: string;
  author_avatar?: string;
  text: string;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}
