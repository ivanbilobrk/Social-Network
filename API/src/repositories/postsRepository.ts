import { PrismaClient } from '@prisma/client';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';
import { ExpandedPost, Post } from '../models/Post.js';
import { ExpandedComment } from '../models/Comment.js';
import { SimpleUser } from '../models/UserProfile.js';

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
      profile: IncludedAuthor.author,
    },
  },
};

const IncludedComments = {
  comments: {
    select: {
      id: true,
      content: true,
      postId: true,
      profile: IncludedAuthor.author,
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
      },
    });
    return data.map(({ _count, ...rest }) => ({
      ...rest,
      likes: _count.postLikes,
    }));
  }

  async getAllUserPosts(userId: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        ...PostSelect,
        ...IncludedAuthor,
        ...IncludedLikesCount,
      },
    });
  }

  async getPostById(postId: number): Promise<ExpandedPost> {
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
      liked_by: postLikes.map((like) => like.profile),
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

  async deletePostLike(postId: number) {
    return await this.prisma.postLike.deleteMany({
      where: {
        postId: postId,
        profileId: this.currentUserId,
      },
    });
  }

  async getUsersWhoLikedPost(postId: number): Promise<Array<SimpleUser>> {
    const data = await this.prisma.postLike.findMany({
      where: {
        postId: postId,
      },
      select: {
        profile: IncludedAuthor.author,
      },
    });

    return data.map((post) => post.profile);
  }
}
