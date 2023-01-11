import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import PostsRepository from '../repositories/postsRepository.js';
import { Post, ExpandedPost } from '../models/Post.js';
import PostRequest from '../requests/post/PostRequest.js';
import FilesRepository from '../repositories/filesRepository.js';
import intoStream from 'into-stream';

export default class PostsService {
  constructor(
    private readonly currentUserId: number,
    private readonly postsRepository: PostsRepository = new PostsRepository(currentUserId),
    private readonly filesRepository: FilesRepository = new FilesRepository(),
  ) {}

  async checkIfPostExists(postId: number) {
    if (!(await this.postsRepository.postExists(postId))) {
      throw new APIError(`Post with id ${postId} not found`, StatusCodes.NOT_FOUND, true);
    }
  }

  async checkIfAuthorMatchesCurrentUser(postId: number) {
    const post = await this.postsRepository.getPostById(postId);

    if (post.authorId !== this.currentUserId) {
      throw new APIError('Current user is not the owner of this post', StatusCodes.FORBIDDEN, true);
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postsRepository.getAllPosts();
  }

  async getAllUserPosts(userId: number): Promise<Post[]> {
    return await this.postsRepository.getAllUserPosts(userId);
  }

  async getPostById(postId: number): Promise<ExpandedPost> {
    this.checkIfPostExists(postId);
    return await this.postsRepository.getPostById(postId);
  }

  async createPost(postRequest: PostRequest): Promise<Post> {
    const post = await this.postsRepository.createPost({
      title: postRequest.title,
      content: postRequest.content,
      photo: null,
      authorId: this.currentUserId,
    });

    let photoUrl: string | null = null;
    if (postRequest.photo) {
      photoUrl = await this.filesRepository.upload(
        `post-${post.id}/${postRequest.photo.name}`,
        postRequest.photo.type,
        intoStream(postRequest.photo.data),
      );
      return await this.postsRepository.addPostPhoto(post.id, photoUrl);
    }

    return post;
  }

  async updatePost(postRequest: PostRequest): Promise<Post> {
    await this.checkIfPostExists(postRequest.id ?? 0);
    await this.checkIfAuthorMatchesCurrentUser(postRequest.id ?? 0);

    let photoUrl: string | null = null;
    if (postRequest.photo) {
      photoUrl = await this.filesRepository.upload(
        `post-${postRequest.id}/${postRequest.photo.name}`,
        postRequest.photo.type,
        intoStream(postRequest.photo.data),
      );
    }

    return await this.postsRepository.updatePost({
      id: postRequest.id,
      title: postRequest.title,
      content: postRequest.content,
      photo: photoUrl,
      authorId: this.currentUserId,
    });
  }

  async deletePost(postId: number) {
    await this.checkIfPostExists(postId);
    await this.checkIfAuthorMatchesCurrentUser(postId);
    return await this.postsRepository.deletePost(postId);
  }

  async likePost(postId: number) {
    await this.checkIfPostExists(postId);

    const existingLike = await this.postsRepository.likedByCurrentUser(postId);
    if (existingLike) {
      return await this.postsRepository.deletePostLike(postId);
    } else {
      return await this.postsRepository.createPostLike(postId);
    }
  }

  async getUsersWhoLikedPost(postId: number) {
    await this.checkIfPostExists(postId);
    return await this.postsRepository.getUsersWhoLikedPost(postId);
  }
}
