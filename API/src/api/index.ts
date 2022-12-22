import { Router } from 'express';
import dummyPostsRouter from './routes/dummyPosts.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/dummyPosts', dummyPostsRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);

export default router;
