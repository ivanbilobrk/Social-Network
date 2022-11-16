import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import PostsRepository from '../repositories/postsRepository.js';
import Post from '../models/Post.js';
import PostRequest from '../requests/post/PostRequest.js';

export default class PostsService {
  constructor(
    private readonly currentUserId: number,
    private readonly postsRepository: PostsRepository = new PostsRepository(currentUserId),
  ) {}

  async getAllPosts(): Promise<Post[] | null> {
    return await this.postsRepository.getAllPosts();
  }

  async getAllUserPosts(userId: number): Promise<Post[] | null> {
    return await this.postsRepository.getAllUserPosts(userId);
  }

  async getPostById(postId: number): Promise<Post | null> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new APIError(`Post with id ${postId} not found`, StatusCodes.NOT_FOUND, true);
    }
    return post;
  }

  async createPost(postRequest: PostRequest): Promise<Post> {
    return await this.postsRepository.createPost({
      title: postRequest.title,
      content: postRequest.content,
      photo: postRequest.photo,
      authorId: this.currentUserId,
    });
  }

  async updatePost(postRequest: PostRequest): Promise<Post> {
    return await this.postsRepository.updatePost({
      id: postRequest.id,
      title: postRequest.title,
      content: postRequest.content,
      photo: postRequest.photo,
      authorId: this.currentUserId,
    });
  }

  async deletePost(postId: number) {
    return await this.postsRepository.deletePost(postId);
  }

  async likePost(postId: number) {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new APIError(`Post with id ${postId} not found`, StatusCodes.NOT_FOUND, true);
    }

    const existingLike = await this.postsRepository.likedByCurrentUser(postId);
    if (existingLike) {
      throw new APIError('Post already liked', StatusCodes.BAD_REQUEST, true);
    }

    return await this.postsRepository.createPostLike(postId);
  }

  async commentPost(postId: number, comment: string) {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new APIError(`Post with id ${postId} not found`, StatusCodes.NOT_FOUND, true);
    }

    return await this.postsRepository.createPostComment(postId, comment);
  }
}
