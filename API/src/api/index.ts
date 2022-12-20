import { Router } from 'express';
import dummyPostsRouter from './routes/dummyPosts.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/dummyPosts', dummyPostsRouter);
router.use('/users', usersRouter);
router.use('/messages', messagesRouter);

export default router;
