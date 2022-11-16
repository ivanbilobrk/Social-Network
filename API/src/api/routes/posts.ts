import { Router } from 'express';
import { forwardError } from '../forwardError.js';
import PostRequest from '../../requests/post/PostRequest.js';
import PostsService from '../../services/postsService.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import PostCommentRequest from '../../requests/post/postCommentRequest.js';

const postsRouter = Router();

postsRouter.get(
  '/:postId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const post = await postsService.getPostById(parseInt(req.params.postId));
    res.json(post);
  }),
);

postsRouter.get(
  '/',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const posts = await postsService.getAllPosts();
    res.json(posts);
  }),
);

postsRouter.post(
  '/',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const postRequest: PostRequest = req.body;
    const post = await postsService.createPost(postRequest);
    res.json(post);
  }),
);

postsRouter.put(
  '/:postId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const postRequest: PostRequest = req.body;
    postRequest.id = parseInt(req.params.postId);
    const post = await postsService.updatePost(postRequest);
    res.json(post);
  }),
);

postsRouter.delete(
  '/:postId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const postId = parseInt(req.params.postId);
    const post = await postsService.deletePost(postId);
    res.json(post);
  }),
);

postsRouter.post(
  '/:postId/like',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const postId = parseInt(req.params.postId);
    const post = await postsService.likePost(postId);
    res.json(post);
  }),
);

postsRouter.post(
  '/:postId/comment',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postId = parseInt(req.params.postId);
    const commentRequest: PostCommentRequest = req.body;
    const postsService = new PostsService(userId);
    const comment = await postsService.commentPost(postId, commentRequest.content);
    res.json(comment);
  }),
);

export default postsRouter;
