import { PrismaClient } from '@prisma/client';
import { Comment, ExpandedComment } from '../models/Comment.js';
import { getNewEntityAuditData, getUpdatedEntityAuditData } from '../util/auditData.js';

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

const IncludedCommentLikes = {
  commentLikes: {
    select: {
      profile: IncludedAuthor.author,
    },
  },
};

const CommentSelect = {
  id: true,
  content: true,
  postId: true,
  profileId: true,
  profile: IncludedAuthor.author,
  ...IncludedCommentLikes,
};

export default class PostsRepository {
  private readonly prisma: PrismaClient;

  constructor(private currentUserId: number) {
    this.prisma = new PrismaClient();
  }

  async commentExists(id: number): Promise<boolean> {
    return (await this.prisma.comment.count({ where: { id } })) > 0;
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

  async getPostComments(postId: number): Promise<ExpandedComment[]> {
    const data = await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: CommentSelect,
    });
    return data.map(({ commentLikes, ...rest }) => ({
      ...rest,
      liked_by: commentLikes.map((commentLike) => commentLike.profile),
    }));
  }

  async getComment(commentId: number): Promise<ExpandedComment> {
    const data = await this.prisma.comment.findFirstOrThrow({
      where: {
        id: commentId,
      },
      select: CommentSelect,
    });

    const { commentLikes, ...comment } = data;
    return {
      ...comment,
      liked_by: commentLikes.map((commentLike) => commentLike.profile),
    };
  }

  async updateComment(commentId: number, comment: string) {
    return await this.prisma.comment.update({
      data: {
        content: comment,
        ...getUpdatedEntityAuditData(this.currentUserId),
      },
      where: {
        id: commentId,
      },
    });
  }

  async deleteComment(commentId: number) {
    return await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async likedByCurrentUser(commentId: number) {
    return !!(await this.prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        profileId: this.currentUserId,
      },
    }));
  }

  async likeComment(commentId: number) {
    return await this.prisma.commentLike.create({
      data: {
        commentId: commentId,
        profileId: this.currentUserId,
        ...getNewEntityAuditData(this.currentUserId),
      },
    });
  }

  async unlikeComment(commentId: number) {
    return await this.prisma.commentLike.deleteMany({
      where: {
        commentId: commentId,
        profileId: this.currentUserId,
      },
    });
  }
}
