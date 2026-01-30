import { Router, Request, Response } from 'express';
import passport from 'passport';
import '../types/express.js';

const router = Router();

// Initiate Twitter OAuth
router.get('/twitter', passport.authenticate('twitter'));

// Twitter OAuth callback
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

// Get current user
router.get('/me', (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(req.user);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
