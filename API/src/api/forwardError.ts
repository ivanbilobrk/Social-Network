import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
type ExpressCallback = (req: Request, res: Response, next: NextFunction) => any;

export const forwardError =
  (callback: ExpressCallback) =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await callback(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
