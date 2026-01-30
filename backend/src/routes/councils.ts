import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import '../types/express.js';

const router = Router();

// Get all councils for current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await query(
      `SELECT c.*,
              json_agg(
                json_build_object(
                  'username', u.username,
                  'display_name', u.display_name,
                  'status', cm.status,
                  'joined_at', cm.joined_at
                )
              ) as members
       FROM councils c
       LEFT JOIN council_members cm ON c.id = cm.council_id
       LEFT JOIN users u ON cm.user_id = u.id
       WHERE c.id IN (
         SELECT council_id FROM council_members WHERE user_id = $1
       )
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching councils:', error);
    res.status(500).json({ error: 'Failed to fetch councils' });
  }
});

// Get a specific council
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is a member
    const memberCheck = await query(
      'SELECT * FROM council_members WHERE council_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      res.status(403).json({ error: 'Not a member of this council' });
      return;
    }

    const result = await query(
      `SELECT c.*,
              json_agg(
                json_build_object(
                  'username', u.username,
                  'display_name', u.display_name,
                  'status', cm.status,
                  'joined_at', cm.joined_at
                )
              ) as members
       FROM councils c
       LEFT JOIN council_members cm ON c.id = cm.council_id
       LEFT JOIN users u ON cm.user_id = u.id
       WHERE c.id = $1
       GROUP BY c.id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Council not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching council:', error);
    res.status(500).json({ error: 'Failed to fetch council' });
  }
});

// Create a new council
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { issue, invitedUsernames } = req.body;
    const userId = req.user!.id;

    if (!issue || !invitedUsernames || !Array.isArray(invitedUsernames)) {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    // Create council
    const councilResult = await query(
      'INSERT INTO councils (issue, convener_id) VALUES ($1, $2) RETURNING *',
      [issue, userId]
    );

    const council = councilResult.rows[0];

    // Add convener as accepted member
    await query(
      `INSERT INTO council_members (council_id, user_id, status, joined_at)
       VALUES ($1, $2, 'accepted', CURRENT_TIMESTAMP)`,
      [council.id, userId]
    );

    // Find or create invited users and add them as members
    for (const username of invitedUsernames) {
      if (username === req.user!.username) continue; // Skip convener

      const userResult = await query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (userResult.rows.length > 0) {
        await query(
          `INSERT INTO council_members (council_id, user_id, status)
           VALUES ($1, $2, 'invited')
           ON CONFLICT (council_id, user_id) DO NOTHING`,
          [council.id, userResult.rows[0].id]
        );
      }
    }

    res.status(201).json(council);
  } catch (error) {
    console.error('Error creating council:', error);
    res.status(500).json({ error: 'Failed to create council' });
  }
});

// Accept invitation
router.post('/:id/accept', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await query(
      `UPDATE council_members
       SET status = 'accepted', joined_at = CURRENT_TIMESTAMP
       WHERE council_id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Invitation not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Decline invitation
router.post('/:id/decline', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await query(
      `UPDATE council_members
       SET status = 'declined'
       WHERE council_id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Invitation not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error declining invitation:', error);
    res.status(500).json({ error: 'Failed to decline invitation' });
  }
});

export default router;
