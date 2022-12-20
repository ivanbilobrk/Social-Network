import { StatusCodes } from 'http-status-codes';
import { APIError } from '../errors/APIError.js';
import Message from '../models/Message.js';
import MessagesRepository from '../repositories/messagesRepository.js';
import CreateMessageRequest from '../requests/messages/CreateMessageRequest.js';
import UpdateMessageRequest from '../requests/messages/UpdateMessageRequest.js';

export default class PostsService {
  constructor(
    private readonly currentUserId: number,
    private readonly messagesRepository: MessagesRepository = new MessagesRepository(currentUserId),
  ) {}

  async checkIfmessageExists(messageId: number) {
    const message = await this.messagesRepository.getMessageById(messageId);
    if (!message) {
      throw new APIError(`Message with id ${messageId} not found`, StatusCodes.NOT_FOUND, true);
    }
  }

  async checkIfUserIsOwnerOfMessage(messageId: number) {
    const message = await this.messagesRepository.getMessageById(messageId);
    return message.senderId === this.currentUserId;
  }

  async checkSenderAndReceiver(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new APIError('Sender and receiver cannot be the same', StatusCodes.BAD_REQUEST, true);
    }
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
    this.checkIfmessageExists(updateMessageRequest.id);
    return await this.messagesRepository.updateMessage(updateMessageRequest);
  }

  async deleteMessage(messageId: number) {
    this.checkIfmessageExists(messageId);
    return await this.messagesRepository.deleteMessage(messageId);
  }
}
