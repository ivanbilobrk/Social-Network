import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import config from '../../config/index.js';
import httpStatus from 'http-status';
import { UserClaims } from '../../services/authService.js';

export interface UserRequest extends Request {
  user?: JwtPayload;
}

declare module 'jsonwebtoken' {
  export interface JwtPayload extends UserClaims {
    id: number;
  }
}

const authenticateJwt = async (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwTokenKey, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (err) {
        return res.sendStatus(httpStatus.FORBIDDEN);
      }

      req.user = user as JwtPayload;
      next();
    });
  } else {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  }
};

export default authenticateJwt;
