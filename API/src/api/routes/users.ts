import { Router } from 'express';
import UsersService from '../../services/usersService.js';
import { forwardError } from '../forwardError.js';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import MessagesService from '../../services/messagesService.js';
import UpdateUserRequest from '../../requests/user/updateUserRequest.js';
import multer from 'multer';

const usersRouter = Router();
const upload = multer();

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
    const userId = parseInt(req.params.userId);
    const usersService = new UsersService(userId);
    const followers = await usersService.getFollowers(userId);
    res.json(followers);
  }),
);

usersRouter.get(
  '/:userId/followings',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = parseInt(req.params.userId);
    const usersService = new UsersService(userId);
    const followings = await usersService.getFollowings(userId);
    res.json(followings);
  }),
);

usersRouter.get(
  '/:userId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = parseInt(req.params.userId);
    const usersService = new UsersService(userId);
    const user = await usersService.getUserById(parseInt(req.params.userId));
    res.json(user);
  }),
);

usersRouter.post(
  '/:userId/follow',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const followedUserId = parseInt(req.params.userId);
    const usersService = new UsersService(userId);
    await usersService.follow(followedUserId);
    res.end();
  }),
);

usersRouter.put(
  '',
  authenticateJwt,
  upload.single('photo'),
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
    await usersService.updateUser(updateRequest);
    res.end();
  }),
);

usersRouter.get(
  '/messages/:receiverId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const receiverId = parseInt(req.params.receiverId);
    const messagesService = new MessagesService(userId);
    const messages = await messagesService.getAllMessagesWithUser(receiverId);
    res.json(messages);
  }),
);

export default usersRouter;
