import { Router } from 'express';
import { forwardError } from '../forwardError.js';
import LoginRequest from '../../requests/loginRequest.js';
import AuthService from '../../services/authService.js';
import RegistrationRequest from '../../requests/registrationRequest.js';
import { check, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const authRouter = Router();

authRouter.post(
  '/login',
  forwardError(async (req, res) => {
    const loginRequest: LoginRequest = req.body;
    const authService = new AuthService();
    res.json(await authService.login(loginRequest));
  }),
);

authRouter.post(
  '/register',
  [check('email').isEmail(), check('password').isLength({ min: 8 })],
  forwardError(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const registrationRequest: RegistrationRequest = req.body;
    const authService = new AuthService();
    res.json(await authService.register(registrationRequest));
  }),
);

export default authRouter;
