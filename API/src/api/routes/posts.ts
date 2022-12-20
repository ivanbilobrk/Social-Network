import { Router } from 'express';
import { forwardError } from '../forwardError.js';
import PostRequest from '../../requests/post/PostRequest.js';
import PostsService from '../../services/postsService.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import PostCommentRequest from '../../requests/post/postCommentRequest.js';
import multer from 'multer';
import CommentsService from '../../services/commentsService.js';

const postsRouter = Router();
const upload = multer();

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
  upload.single('photo'),
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const fileReq = req as UserRequest & { file?: Express.Multer.File };
    const postsService = new PostsService(userId);
    console.log(fileReq.file);
    const postRequest: PostRequest = {
      ...fileReq.body,
      photo: fileReq.file
        ? {
            data: fileReq.file.buffer,
            name: fileReq.file.originalname || 'unknown',
            type: fileReq.file.mimetype,
          }
        : undefined,
    };
    const post = await postsService.createPost(postRequest);
    res.json(post);
  }),
);

postsRouter.put(
  '/:postId',
  authenticateJwt,
  upload.single('photo'),
  forwardError(async (req: UserRequest, res) => {
    const fileReq = req as UserRequest & { file: Express.Multer.File };
    const userId = req.user?.id ?? 0;
    const postsService = new PostsService(userId);
    const postRequest: PostRequest = {
      ...fileReq.body,
      photo: fileReq.file
        ? {
            data: fileReq.file.buffer,
            name: fileReq.file?.originalname || 'unknown',
            type: fileReq.file.mimetype,
          }
        : undefined,
      id: parseInt(req.params.postId),
    };
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

postsRouter.get(
  '/:postId/likes',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postId = parseInt(req.params.postId);
    const postsService = new PostsService(userId);
    const userLikes = await postsService.getUsersWhoLikedPost(postId);
    res.json(userLikes);
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

postsRouter.get(
  '/:postId/comments',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postId = parseInt(req.params.postId);
    const commentsService = new CommentsService(userId);
    const comments = await commentsService.getComments(postId);
    res.json(comments);
  }),
);

postsRouter.post(
  '/:postId/comment',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const postId = parseInt(req.params.postId);
    const commentRequest: PostCommentRequest = req.body;
    const commentsService = new CommentsService(userId);
    const comment = await commentsService.commentPost(postId, commentRequest.content);
    res.json(comment);
  }),
);

export default postsRouter;
