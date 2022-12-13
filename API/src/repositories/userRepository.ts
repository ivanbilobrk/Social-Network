import { PrismaClient } from '@prisma/client';
import UserProfileModel from '../models/UserProfileModel.js';
import { getNewEntityAuditData } from '../util/auditData.js';

export default class UserRepository {
  private prisma: PrismaClient;

  constructor(private readonly currentUserId?: number) {
    this.prisma = new PrismaClient();
  }

  async create(data: UserProfileModel) {
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
    return await this.prisma.userProfile.findAll();
  }
}
