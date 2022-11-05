import { DummyPost, getPostById, updatePost, createPost } from '../repositories/dummyPostsRepository';
import { APIError } from '../errors/APIError';
import logger from '../config/logger';

export const getDummyPostById = async (id: number): Promise<DummyPost> => {
  let post = getPostById(id);
  if (post === undefined) {
    throw new APIError(`Post with id ${id} not found`, 404, true);
  }

  post.views++;
  updatePost(post);

  return post;
};

export const createNewPost = async (title: string, content: string): Promise<DummyPost> => {
  let new_post = createPost({ title, content, views: 0, id: 0 });

  logger.info(`Created new post with id ${new_post.id} and title ${new_post.title}`);

  return new_post;
};
