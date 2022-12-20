export default interface CreateMessageRequest {
  content: string;
  senderId: number;
  receiverId: number;
  sent: Date;
}
