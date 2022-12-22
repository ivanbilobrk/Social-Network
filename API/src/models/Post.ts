import { SimpleUser } from './UserProfile.js';
import { Comment } from './Comment.js';

export interface Post {
  id?: number;
  title: string;
  content: string | null;
  photo: string | null;
  authorId: number;
  author?: SimpleUser;
  likes?: number;
}

export interface ExpandedPost {
  id?: number;
  title: string;
  content: string | null;
  photo: string | null;
  author?: SimpleUser;
  authorId: number;
  liked_by?: Array<SimpleUser>;
  comments?: Array<Comment>;
}
