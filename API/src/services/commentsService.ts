import { StatusCodes } from 'http-status-codes';
import { APIError } from '../errors/APIError.js';
import CommentRepository from '../repositories/commentsRepository.js';
import PostsRepository from '../repositories/postsRepository.js';
import { ExpandedComment } from '../models/Comment.js';

export default class CommentsService {
  constructor(
    private readonly currentUserId: number,
    private readonly commentRepository: CommentRepository = new CommentRepository(currentUserId),
    private readonly postsRepository: PostsRepository = new PostsRepository(currentUserId),
  ) {}

  async checkIfPostExists(postId: number) {
    if (!(await this.postsRepository.getPostById(postId))) {
      throw new APIError(`Post with id ${postId} not found`, StatusCodes.NOT_FOUND, true);
    }
  }

  async checkIfAuthorMatchesCurrentUser(commentId: number) {
    const comment = await this.commentRepository.getComment(commentId);
    if (comment.profile.id !== this.currentUserId) {
      throw new APIError('Current user is not the owner of this comment', StatusCodes.FORBIDDEN, true);
    }
  }

  async checkIfCommentExists(commentId: number) {
    if (!(await this.commentRepository.commentExists(commentId))) {
      throw new APIError(`Comment with id ${commentId} not found`, StatusCodes.BAD_REQUEST, true);
    }
  }

  async commentPost(postId: number, comment: string) {
    this.checkIfPostExists(postId);
    return await this.commentRepository.createPostComment(postId, comment);
  }

  async getComments(postId: number): Promise<ExpandedComment[]> {
    this.checkIfPostExists(postId);
    return await this.commentRepository.getPostComments(postId);
  }

  async getComment(commentId: number) {
    this.checkIfCommentExists(commentId);
    return await this.commentRepository.getComment(commentId);
  }

  async updateComment(commentId: number, comment: string) {
    this.checkIfCommentExists(commentId);
    this.checkIfAuthorMatchesCurrentUser(commentId);
    return await this.commentRepository.updateComment(commentId, comment);
  }

  async deleteComment(commentId: number) {
    return await this.commentRepository.deleteComment(commentId);
  }

  async likeComment(commentId: number) {
    this.checkIfCommentExists(commentId);

    const existingLike = await this.commentRepository.likedByCurrentUser(commentId);

    if (existingLike) {
      return await this.commentRepository.unlikeComment(commentId);
    } else {
      return await this.commentRepository.likeComment(commentId);
    }
  }
}
