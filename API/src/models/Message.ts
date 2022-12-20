import { SimpleUser } from './UserProfile.js';

export default interface Message {
  id: number;
  content: string;
  sentAt: Date;
  senderId: number;
  sender: SimpleUser;
  receiverId: number;
  receiver: SimpleUser;
}
