import { SimpleUser } from './UserProfile.js';

export interface Comment {
  id: number;
  content: string;
  profile: SimpleUser;
  likes: number;
}
