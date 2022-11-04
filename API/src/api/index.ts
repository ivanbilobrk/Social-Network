import { Router } from 'express';
import dummyPostsRouter from './routes/dummyPosts.js';
import authRouter from './routes/auth.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/dummyPosts', dummyPostsRouter);

export default router;
