import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    twitter_id: string;
    username: string;
    display_name: string;
    profile_image_url?: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Passes through whether authenticated or not
  next();
}
