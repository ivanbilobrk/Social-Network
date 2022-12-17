import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';
import { ExpandedPost, Post } from '../models/Post.js';

const IncludedAuthor = {
  author: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      username: true,
      avatar_url: true,
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

const IncludedLikesCount = {
  _count: { select: { postLikes: true } },
};

const IncludedLikes = {
  postLikes: {
    select: {
      profile: {
        select: IncludedAuthor.author.select,
      },
    },
  },
};

const IncludedComments = {
  comments: {
    select: {
      id: true,
      content: true,
      profile: { select: IncludedAuthor.author.select },
      _count: { select: { commentLikes: true } },
    },
  },
};

export default class PostsRepository {
  private readonly prisma: PrismaClient;

  constructor(private currentUserId: number) {
    this.prisma = new PrismaClient();
  }

  async postExists(id: number): Promise<boolean> {
    return (await this.prisma.post.count({ where: { id } })) > 0;
  }

  async getAllPosts(): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikesCount,
        ...IncludedComments,
      },
    });
    return data.map(({ _count, comments, ...post }) => {
      const mappedComments = comments.map((comment) => {
        const { _count, ...rest } = comment;
        return { ...rest, likes: _count.commentLikes };
      });
      return {
        ...post,
        likes: _count.postLikes,
      };
    });
  }

  async getAllUserPosts(userId: number): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikesCount,
        ...IncludedComments,
      },
    });
    return data.map(({ _count, ...post }) => ({ ...post, likes: _count.postLikes }));
  }

  async getPostById(postId: number): Promise<ExpandedPost | null> {
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
    const { postLikes, comments, ...post } = data;
    const mappedComments = comments.map((comment) => {
      const { _count, ...rest } = comment;
      return { ...rest, likes: _count.commentLikes };
    });
    return {
      ...post,
      comments: mappedComments,
      liked_by: data.postLikes.map((like) => like.profile),
    };
  }

  async createPost(data: Post) {
    const { author, ...post } = data;
    return await this.prisma.post.create({
      data: { ...post, authorId: this.currentUserId ?? 1, ...getNewEntityAuditData(this.currentUserId) },
    });
  }

  async addPostPhoto(postId: number, photo: string) {
    return await this.prisma.post.update({
      where: { id: postId },
      data: { photo },
    });
  }

  async updatePost(data: Post) {
    return await this.prisma.post.update({
      data: {
        title: data.title,
        content: data.content,
        photo: data.photo ?? undefined,
        ...getUpdatedEntityAuditData(this.currentUserId),
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
