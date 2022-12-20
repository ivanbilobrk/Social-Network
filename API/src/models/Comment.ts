import { SimpleUser } from './UserProfile.js';

export interface Comment {
  id: number;
  content: string;
  postId: number;
  profile: SimpleUser;
  likes: number;
}

export interface ExpandedComment {
  id: number;
  content: string;
  postId: number;
  profile: SimpleUser;
  liked_by: Array<SimpleUser>;
}
