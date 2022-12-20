import { Router } from 'express';
import { forwardError } from '../forwardError.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import PostCommentRequest from '../../requests/post/postCommentRequest.js';
import CommentsService from '../../services/commentsService.js';

const commentsRouter = Router();

commentsRouter.get(
  '/:commentId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const commentId = parseInt(req.params.commentId);
    const commentsService = new CommentsService(userId);
    const comment = await commentsService.getComment(commentId);
    res.json(comment);
  }),
);

commentsRouter.put(
  '/:commentId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const commentId = parseInt(req.params.commentId);
    const commentRequest: PostCommentRequest = req.body;
    const commentsService = new CommentsService(userId);
    const comment = await commentsService.updateComment(commentId, commentRequest.content);
    res.json(comment);
  }),
);

commentsRouter.delete(
  '/:commentId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const commentId = parseInt(req.params.commentId);
    const commentsService = new CommentsService(userId);
    const comment = await commentsService.deleteComment(commentId);
    res.json(comment);
  }),
);

commentsRouter.post(
  '/:commentId/like',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const commentId = parseInt(req.params.commentId);
    const commentsService = new CommentsService(userId);
    const comment = await commentsService.likeComment(commentId);
    res.json(comment);
  }),
);

export default commentsRouter;
