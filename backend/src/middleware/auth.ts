import { Request, Response, NextFunction, RequestHandler } from 'express';

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

export const optionalAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Passes through whether authenticated or not
  next();
};
