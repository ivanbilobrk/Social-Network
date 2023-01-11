import { Router } from 'express';
import MessagesService from '../../services/messagesService.js';
import { forwardError } from '../forwardError.js';
import authenticateJwt from '../middleware/authMiddleware.js';
import { UserRequest } from '../middleware/authMiddleware.js';
import CreateMessageRequest from '../../requests/messages/CreateMessageRequest.js';
import UpdateMessageRequest from '../../requests/messages/UpdateMessageRequest.js';

const messagesRouter = Router();

messagesRouter.get(
  '',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const messages = await messagesService.getAllChats();
    res.json(messages);
  }),
);

messagesRouter.get(
  '/unreadCount',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const count = await messagesService.getUnreadCount();
    res.json(count);
  }),
);

messagesRouter.post(
  '/markAsRead/:otherUserId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const otherUserId = parseInt(req.params.otherUserId);
    await messagesService.markAsRead(otherUserId);
    res.end();
  }),
);

messagesRouter.get(
  '/:messageId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const message = await messagesService.getMessageById(parseInt(req.params.messageId));
    res.json(message);
  }),
);

messagesRouter.post(
  '',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const createMessageRequest: CreateMessageRequest = {
      content: req.body.content,
      receiverId: req.body.receiverId,
      senderId: userId,
      sent: new Date(),
    };
    const message = await messagesService.createMessage(createMessageRequest);
    res.json(message);
  }),
);

messagesRouter.put(
  '',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const updateMessageRequest: UpdateMessageRequest = {
      ...req.body,
    };
    const message = await messagesService.updateMessage(updateMessageRequest);
    res.json(message);
  }),
);

messagesRouter.delete(
  '/:messageId',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const userId = req.user?.id ?? 0;
    const messagesService = new MessagesService(userId);
    const message = await messagesService.deleteMessage(parseInt(req.params.messageId));
    res.json(message);
  }),
);

export default messagesRouter;
