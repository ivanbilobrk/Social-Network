import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';
import Post from '../models/Post.js';

const IncludedAuthor = {
  author: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      username: true,
    },
  },
};

const PostSelect = {
  id: true,
  title: true,
  content: true,
  photo: true,
  authorId: true,
};

const IncludedLikes = {
  _count: { select: { postLikes: true } },
};

const IncludedComments = {
  comments: { select: { id: true, content: true } },
};

export default class PostsRepository {
  private readonly prisma: PrismaClient;

  constructor(private currentUserId: number) {
    this.prisma = new PrismaClient();
  }

  async getAllPosts(): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikes,
        ...IncludedComments,
      },
    });
    return data.map(({ _count, ...post }) => ({ ...post, likes: _count.postLikes }));
  }

  async getAllUserPosts(userId: number): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikes,
        ...IncludedComments,
      },
    });
    return data.map(({ _count, ...post }) => ({ ...post, likes: _count.postLikes }));
  }

  async getPostById(postId: number): Promise<Post | null> {
    const data = await this.prisma.post.findFirstOrThrow({
      where: {
        id: postId,
      },
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikes,
        ...IncludedComments,
      },
    });
    const { _count, ...post } = data;
    return { ...post, likes: _count.postLikes };
  }

  async createPost(data: Post) {
    const { author, ...post } = data;
    return await this.prisma.post.create({
      data: { ...post, authorId: this.currentUserId ?? 1, ...getNewEntityAuditData(this.currentUserId) },
    });
  }

  async updatePost(data: Post) {
    return await this.prisma.post.update({
      data: {
        title: data.title,
        content: data.content,
        photo: data.photo,
        ...getUpdatedEntityAuditData(data.authorId),
      },
      where: {
        id: data.id,
      },
    });
  }

  async deletePost(postId: number) {
    return await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async createPostComment(postId: number, content: string) {
    return await this.prisma.comment.create({
      data: {
        content,
        postId,
        profileId: this.currentUserId,
        ...getNewEntityAuditData(this.currentUserId),
      },
    });
  }

  async likedByCurrentUser(postId: number) {
    return !!(await this.prisma.postLike.findFirst({
      where: {
        postId,
        profileId: this.currentUserId,
      },
    }));
  }

  async createPostLike(postId: number) {
    return await this.prisma.postLike.create({
      data: {
        postId,
        profileId: this.currentUserId,
        ...getNewEntityAuditData(this.currentUserId),
      },
    });
  }
}
