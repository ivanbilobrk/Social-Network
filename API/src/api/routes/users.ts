import e, { Router } from 'express';
import UsersService from '../../services/usersService.js';
import { forwardError } from '../forwardError.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';

const usersRouter = Router();

usersRouter.get(
  '',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const usersService = new UsersService(userId);
    const users = await usersService.getUsers();
    res.json(users);
  }),
);

usersRouter.get(
  '/:userId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const usersService = new UsersService(userId);
    const user = await usersService.getUserById(parseInt(req.params.userId));
    res.json(user);
  }),
);

export default usersRouter;
