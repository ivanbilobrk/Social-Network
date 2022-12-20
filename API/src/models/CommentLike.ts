import { Comment } from './Comment.js';
import UserProfile from './UserProfile.js';

export default interface CommentLike {
  id: number;
  commentId: number;
  comment: Comment;
  userId: number;
  user: UserProfile;
}
