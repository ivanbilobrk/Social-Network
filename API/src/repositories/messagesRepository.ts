import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';
import Message from '../models/Message.js';
import MessageRequest from '../requests/messages/CreateMessageRequest.js';
import CreateMessageRequest from '../requests/messages/CreateMessageRequest.js';
import UpdateMessageRequest from '../requests/messages/UpdateMessageRequest.js';

const SelectUser = {
  id: true,
  first_name: true,
  last_name: true,
  username: true,
  avatar_url: true,
};

const MessageSelect = {
  id: true,
  content: true,
  sent: true,
  senderId: true,
  sender: { select: SelectUser },
  receiverId: true,
  receiver: { select: SelectUser },
};

export default class MessagesRepository {
  private readonly prisma: PrismaClient;

  constructor(private currentUserId: number) {
    this.prisma = new PrismaClient();
  }

  async getMessageById(messageId: number): Promise<Message> {
    const data = await this.prisma.message.findUniqueOrThrow({
      where: {
        id: messageId,
      },
      select: { ...MessageSelect },
    });
    const { sent, ...rest } = data;
    return {
      sentAt: sent,
      ...rest,
    };
  }

  async getMessagesWithUser(userId: number): Promise<Message[]> {
    const data = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: this.currentUserId },
          { senderId: this.currentUserId, receiverId: userId },
        ],
      },
      select: { ...MessageSelect },
      orderBy: { sent: 'asc' },
    });
    return data.map(({ sent, ...rest }) => ({
      sentAt: sent,
      ...rest,
    }));
  }

  async createMessage(createMessageRequest: CreateMessageRequest) {
    return await this.prisma.message.create({
      data: {
        ...createMessageRequest,
        ...getNewEntityAuditData(this.currentUserId),
      },
    });
  }

  async updateMessage(updateMessageRequest: UpdateMessageRequest) {
    return await this.prisma.message.update({
      where: {
        id: updateMessageRequest.id,
      },
      data: {
        ...updateMessageRequest,
        ...getUpdatedEntityAuditData(this.currentUserId),
      },
    });
  }

  async deleteMessage(messageId: number) {
    return await this.prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  }
}
