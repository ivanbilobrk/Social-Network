import { Router } from 'express';
import dummyPostsRouter from './routes/dummyPosts.js';

const router = Router();

router.use('/dummyPosts', dummyPostsRouter);

export default router;
