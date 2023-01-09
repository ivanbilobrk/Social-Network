import { StatusCodes } from 'http-status-codes';
import { APIError } from '../errors/APIError.js';
import MessagesRepository from '../repositories/messagesRepository.js';
import CreateMessageRequest from '../requests/messages/CreateMessageRequest.js';
import UpdateMessageRequest from '../requests/messages/UpdateMessageRequest.js';
import Message from '../models/Message.js';

export default class PostsService {
  constructor(
    private readonly currentUserId: number,
    private readonly messagesRepository: MessagesRepository = new MessagesRepository(currentUserId),
  ) {}

  async checkIfmessageExists(messageId: number) {
    if (!(await this.messagesRepository.messageExists(messageId))) {
      throw new APIError(`Message with id ${messageId} not found`, StatusCodes.NOT_FOUND, true);
    }
  }

  async checkIfUserIsOwnerOfMessage(messageId: number) {
    const message = await this.messagesRepository.getMessageById(messageId);
    if (message?.senderId !== this.currentUserId) {
      throw new APIError('User is not the owner of this message', StatusCodes.FORBIDDEN, true);
    }
  }

  async checkSenderAndReceiver(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new APIError('Sender and receiver cannot be the same', StatusCodes.BAD_REQUEST, true);
    }
  }

  async getMessageById(messageId: number): Promise<Message> {
    await this.checkIfmessageExists(messageId);
    await this.checkIfUserIsOwnerOfMessage(messageId);
    return await this.messagesRepository.getMessageById(messageId);
  }

  async getAllChats(): Promise<Message[]> {
    return await this.messagesRepository.getAllChats();
  }

  async getAllMessagesWithUser(userId: number): Promise<Message[]> {
    this.checkSenderAndReceiver(this.currentUserId, userId);
    return await this.messagesRepository.getMessagesWithUser(userId);
  }

  async createMessage(createMessageRequest: CreateMessageRequest) {
    this.checkSenderAndReceiver(createMessageRequest.senderId, createMessageRequest.receiverId);
    return await this.messagesRepository.createMessage(createMessageRequest);
  }

  async updateMessage(updateMessageRequest: UpdateMessageRequest) {
    await this.checkIfmessageExists(updateMessageRequest.id);
    await this.checkIfUserIsOwnerOfMessage(updateMessageRequest.id);
    return await this.messagesRepository.updateMessage(updateMessageRequest);
  }

  async deleteMessage(messageId: number) {
    await this.checkIfmessageExists(messageId);
    return await this.messagesRepository.deleteMessage(messageId);
  }

  async markAsRead(otherUserId: number) {
    await this.messagesRepository.markMessagesAsRead(this.currentUserId, otherUserId);
  }

  async getUnreadCount() {
    return { count: await this.messagesRepository.getUnreadMessagesCount() };
  }
}
