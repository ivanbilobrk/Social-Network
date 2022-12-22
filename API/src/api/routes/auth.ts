import { Request, Router } from 'express';
import { forwardError } from '../forwardError.js';
import LoginRequest from '../../requests/auth/loginRequest.js';
import AuthService from '../../services/authService.js';
import RegistrationRequest from '../../requests/auth/registrationRequest.js';
import { check, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import authenticateJwt, { UserRequest } from '../middleware/authMiddleware.js';
import multer from 'multer';

const authRouter = Router();
const upload = multer();

authRouter.post(
  '/login',
  forwardError(async (req, res) => {
    const loginRequest: LoginRequest = req.body;
    const authService = new AuthService();
    res.json(await authService.login(loginRequest));
  }),
);

authRouter.post(
  '/change-password',
  authenticateJwt,
  forwardError(async (req: UserRequest, res) => {
    const authService = new AuthService(req.user);
    await authService.changePassword(req.body);
    res.sendStatus(StatusCodes.OK);
  }),
);

authRouter.post(
  '/register',
  upload.single('photo'),
  [check('email').isEmail(), check('password').isLength({ min: 8 })],
  forwardError(async (req, res) => {
    const fileReq = req as Request & { file: Express.Multer.File };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const registrationRequest: RegistrationRequest = {
      ...req.body,
      photo: fileReq.file
        ? {
            data: fileReq.file.buffer,
            name: fileReq.file.originalname || 'unknown',
            type: fileReq.file.mimetype,
          }
        : undefined,
    };
    const authService = new AuthService();
    res.json(await authService.register(registrationRequest));
  }),
);

export default authRouter;
