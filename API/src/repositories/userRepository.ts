import { PrismaClient } from '@prisma/client';
import User from '../models/User.js';
import { getNewEntityAuditData } from '../util/auditData.js';

const UserSelect = {
  id: true,
  email: true,
  user_type: true,
  username: true,
  first_name: true,
  last_name: true,
  date_of_birth: true,
  joined_at: true,
};

export default class UserRepository {
  private prisma: PrismaClient;

  constructor(private readonly currentUserId?: number) {
    this.prisma = new PrismaClient();
  }

  async create(data: User) {
    return await this.prisma.userProfile.create({
      data: { ...data, ...getNewEntityAuditData(this.currentUserId) },
    });
  }

  async updatePassword(id: number, password_hash: string) {
    return await this.prisma.userProfile.update({
      where: {
        id,
      },
      data: {
        password_hash,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.userProfile.findUnique({
      where: {
        id,
      },
      select: {
        ...UserSelect,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.userProfile.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return await this.prisma.userProfile.findMany({
      select: {
        ...UserSelect,
      },
    });
  }
}
