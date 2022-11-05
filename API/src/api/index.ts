import { Router } from 'express';
import dummyPostsRouter from './routes/dummyPosts';
import authRouter from './routes/auth';

const router = Router();

router.use('/auth', authRouter);
router.use('/dummyPosts', dummyPostsRouter);

export default router;
