import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get resolutions for a council
router.get('/council/:councilId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { councilId } = req.params;
    const userId = req.user!.id;

    // Verify user is member
    const memberCheck = await query(
      'SELECT * FROM council_members WHERE council_id = $1 AND user_id = $2 AND status = $3',
      [councilId, userId, 'accepted']
    );

    if (memberCheck.rows.length === 0) {
      res.status(403).json({ error: 'Not a member of this council' });
      return;
    }

    const result = await query(
      `SELECT r.*,
              u.username as proposed_by_username,
              (
                SELECT json_agg(
                  json_build_object(
                    'username', vu.username,
                    'vote', rv.vote
                  )
                )
                FROM resolution_votes rv
                LEFT JOIN users vu ON rv.user_id = vu.id
                WHERE rv.resolution_id = r.id
              ) as votes
       FROM resolutions r
       LEFT JOIN users u ON r.proposed_by = u.id
       WHERE r.council_id = $1
       ORDER BY r.created_at DESC`,
      [councilId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    res.status(500).json({ error: 'Failed to fetch resolutions' });
  }
});

// Propose a resolution
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { councilId, type } = req.body;
    const userId = req.user!.id;

    if (!councilId || !type) {
      res.status(400).json({ error: 'Council ID and type are required' });
      return;
    }

    if (type !== 'resolve' && type !== 'close') {
      res.status(400).json({ error: 'Type must be resolve or close' });
      return;
    }

    // Verify user is member
    const memberCheck = await query(
      'SELECT * FROM council_members WHERE council_id = $1 AND user_id = $2 AND status = $3',
      [councilId, userId, 'accepted']
    );

    if (memberCheck.rows.length === 0) {
      res.status(403).json({ error: 'Not a member of this council' });
      return;
    }

    const result = await query(
      `INSERT INTO resolutions (council_id, proposed_by, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [councilId, userId, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating resolution:', error);
    res.status(500).json({ error: 'Failed to create resolution' });
  }
});

// Vote on a resolution
router.post('/:id/vote', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    const userId = req.user!.id;

    if (!vote) {
      res.status(400).json({ error: 'Vote is required' });
      return;
    }

    if (vote !== 'support' && vote !== 'oppose') {
      res.status(400).json({ error: 'Vote must be support or oppose' });
      return;
    }

    // Verify user is member of the council
    const councilCheck = await query(
      `SELECT cm.* FROM council_members cm
       JOIN resolutions r ON r.council_id = cm.council_id
       WHERE r.id = $1 AND cm.user_id = $2 AND cm.status = 'accepted'`,
      [id, userId]
    );

    if (councilCheck.rows.length === 0) {
      res.status(403).json({ error: 'Not a member of this council' });
      return;
    }

    // Upsert vote
    const result = await query(
      `INSERT INTO resolution_votes (resolution_id, user_id, vote)
       VALUES ($1, $2, $3)
       ON CONFLICT (resolution_id, user_id)
       DO UPDATE SET vote = $3
       RETURNING *`,
      [id, userId, vote]
    );

    // Check if resolution should pass (unanimous support for resolve)
    const resolution = await query('SELECT * FROM resolutions WHERE id = $1', [id]);
    const resolutionData = resolution.rows[0];

    if (resolutionData.type === 'resolve') {
      // Get all council members
      const members = await query(
        `SELECT COUNT(*) as total FROM council_members
         WHERE council_id = $1 AND status = 'accepted'`,
        [resolutionData.council_id]
      );

      // Get all support votes
      const supportVotes = await query(
        `SELECT COUNT(*) as total FROM resolution_votes
         WHERE resolution_id = $1 AND vote = 'support'`,
        [id]
      );

      // If unanimous, mark as passed and resolve council
      if (supportVotes.rows[0].total === members.rows[0].total) {
        await query(
          `UPDATE resolutions SET status = 'passed' WHERE id = $1`,
          [id]
        );
        await query(
          `UPDATE councils SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [resolutionData.council_id]
        );
      }
    } else if (resolutionData.type === 'close') {
      // For close, check if it has majority support
      const totalMembers = await query(
        `SELECT COUNT(*) as total FROM council_members
         WHERE council_id = $1 AND status = 'accepted'`,
        [resolutionData.council_id]
      );

      const supportVotes = await query(
        `SELECT COUNT(*) as total FROM resolution_votes
         WHERE resolution_id = $1 AND vote = 'support'`,
        [id]
      );

      if (supportVotes.rows[0].total > totalMembers.rows[0].total / 2) {
        await query(
          `UPDATE resolutions SET status = 'passed' WHERE id = $1`,
          [id]
        );
        await query(
          `UPDATE councils SET status = 'closed', resolved_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [resolutionData.council_id]
        );
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error voting on resolution:', error);
    res.status(500).json({ error: 'Failed to vote on resolution' });
  }
});

export default router;
