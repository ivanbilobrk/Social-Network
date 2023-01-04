import { Router } from 'express';
import { createNewPost, getDummyPostById } from '../../services/dummyPostsService.js';
import { forwardError } from '../forwardError.js';

const dummyPostsRouter = Router();

dummyPostsRouter.get(
  '/:postId',
  forwardError(async (req, res) => {
    const post = await getDummyPostById(parseInt(req.params.postId));
    res.json(post);
  }),
);

dummyPostsRouter.post(
  '/',
  forwardError(async (req, res) => {
    const post = await createNewPost(req.body.title, req.body.content);
    res.json(post);
  }),
);

export default dummyPostsRouter;
