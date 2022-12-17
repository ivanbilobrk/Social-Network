import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData } from '../util/auditData.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';

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

const IncludedFollowers = {
  _count: {
    select: {
      followers: true,
      following: true,
    },
  },
};

export default class UserRepository {
  private prisma: PrismaClient;

  constructor(private readonly currentUserId?: number) {
    this.prisma = new PrismaClient();
  }

  async create(data: User) {
    return await this.prisma.userProfile.create({
      data: {
        ...data,
        ...getNewEntityAuditData(this.currentUserId),
        followers: {},
        following: {},
      },
    });
  }

  async addAvatar(userId: number, avatar: string) {
    return await this.prisma.userProfile.update({
      where: {
        id: userId,
      },
      data: {
        avatar_url: avatar,
      },
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

  async findById(userId: number): Promise<UserProfile | null> {
    const data = await this.prisma.userProfile.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        ...UserSelect,
        ...IncludedFollowers,
      },
    });
    const { _count, ...user } = data;
    return {
      ...user,
      followers: _count.followers,
      following: _count.following,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.userProfile.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<UserProfile[]> {
    const data = await this.prisma.userProfile.findMany({
      select: {
        ...UserSelect,
        ...IncludedFollowers,
      },
    });
    return data.map(({ _count, ...user }) => ({
      ...user,
      followers: _count.followers,
      following: _count.following,
    }));
  }

  async findAllFollowers(userId: number): Promise<UserProfile[]> {
    const followers = await this.prisma.follower.findMany({
      where: {
        followedId: userId,
      },
      include: {
        followed: true,
        follower: true,
      },
    });
    return followers.map(({ follower }) => ({ ...follower }));
  }

  async findAllFollowings(userId: number): Promise<UserProfile[]> {
    const followings = await this.prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        followed: true,
        follower: true,
      },
    });
    return followings.map(({ followed }) => ({ ...followed }));
  }
}
