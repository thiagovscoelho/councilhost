import { Router } from 'express';
import passport from 'passport';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Initiate Twitter OAuth
router.get('/twitter', passport.authenticate('twitter'));

// Twitter OAuth callback
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

// Get current user
router.get('/me', (req: AuthRequest, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
