import { Router } from 'express';
import UsersService from '../../services/usersService.js';
import { forwardError } from '../forwardError.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import UpdateUserRequest from '../../requests/user/updateUserRequest.js';

const usersRouter = Router();

usersRouter.get(
  '/',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const usersService = new UsersService(userId);
    const users = await usersService.getUsers();
    res.json(users);
  }),
);

usersRouter.get(
  '/:userId/followers',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const usersService = new UsersService(userId);
    const followers = usersService.getFollowers(userId);
    res.json(followers);
  }),
);

usersRouter.get(
  '/:userId/followings',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const usersService = new UsersService(userId);
    const followings = usersService.getFollowings(userId);
    return res.json(followings);
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

usersRouter.put(
  '',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const fileReq = req as UserRequest & { file: Express.Multer.File };
    const updateRequest: UpdateUserRequest = {
      ...req.body,
      photo: fileReq.file
        ? {
            data: fileReq.file.buffer,
            name: fileReq.file.originalname || 'unknown',
            type: fileReq.file.mimetype,
          }
        : undefined,
    };
    const usersService = new UsersService(userId);
    const user = await usersService.updateUser(updateRequest);
    res.json(user);
  }),
);

export default usersRouter;
