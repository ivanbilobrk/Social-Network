import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';
import Message, { MessageOverview } from '../models/Message.js';
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

  async messageExists(id: number): Promise<boolean> {
    return (await this.prisma.message.count({ where: { id } })) > 0;
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

  async getAllChats(): Promise<Message[]> {
    // Get all chats / messaged users
    const chats = await this.prisma.message.findMany({
      distinct: ['senderId', 'receiverId'],
      select: { senderId: true, receiverId: true },
      where: {
        OR: [{ senderId: this.currentUserId }, { receiverId: this.currentUserId }],
      },
    });

    const latestMessages: Message[] = [];

    // Get latest message for each chat
    for (const chat of chats) {
      let latestMessage: Message;
      if (chat.senderId === this.currentUserId) {
        latestMessage = await this.getLatestMessageWithUser(chat.receiverId);
      } else {
        latestMessage = await this.getLatestMessageWithUser(chat.senderId);
      }

      // Add latest message to array if not already added
      if (latestMessages.findIndex((message) => message.id === latestMessage.id) === -1) {
        latestMessages.push(latestMessage);
      }
    }

    return latestMessages;
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

  async getLatestMessageWithUser(userId: number): Promise<Message> {
    const data = await this.prisma.message.findFirstOrThrow({
      where: {
        OR: [
          { senderId: userId, receiverId: this.currentUserId },
          { senderId: this.currentUserId, receiverId: userId },
        ],
      },
      select: { ...MessageSelect },
      orderBy: { sent: 'desc' },
    });

    const { sent, ...rest } = data;

    return {
      sentAt: sent,
      ...rest,
    };
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

  async markMessagesAsRead(to: number, from: number) {
    return await this.prisma.message.updateMany({
      where: {
        senderId: from,
        receiverId: to,
        received: null,
      },
      data: {
        received: new Date(),
      },
    });
  }

  async getUnreadMessagesCount() {
    return await this.prisma.message.count({
      where: {
        receiverId: this.currentUserId,
        received: null,
      },
    });
  }
}
