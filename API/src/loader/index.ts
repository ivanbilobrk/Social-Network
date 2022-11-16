import express, { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import logger from '../config/logger.js';
import { APIError } from '../errors/APIError.js';
import config from '../config/index.js';
import httpStatus from 'http-status';
import router from '../api/index.js';
import cors from 'cors';

export default ({ app }: { app: express.Application }): Server | undefined => {
  // setup logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`HTTP ${req.method} ${req.url}`);
    next();
  });

  app.use(cors({credentials: true, origin: true}));
  // parses body params and attaches them to req.body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Routes
   */

  // provide health status of the API
  app.get('/health-check', (_req: Request, res: Response) => {
    res.sendStatus(httpStatus.OK);
  });

  // inject routes
  app.use(router);

  /**
   * Error handling
   */

  // catches 404 (non-existing route)
  app.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Not found' });
  });

  // logs APIErrors
  app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error during API request ', { error });

    res.status(error.status).json({
      message: error.isPublic ? error.message : httpStatus[error.status],
      stack: config.environment === 'development' ? error.stack : {},
    });
    next();
  });

  if (config.environment !== 'test') {
    return app.listen(config.port, () => {
      logger.info(`API listening on port ${config.port}`);
    });
  }
};
