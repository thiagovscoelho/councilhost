import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all conclusions for a council
router.get('/council/:councilId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { councilId } = req.params;
    const userId = req.user!.id;

    // Verify user is member
    const memberCheck = await query(
      'SELECT * FROM council_members WHERE council_id = $1 AND user_id = $2 AND status = $3',
      [councilId, userId, 'accepted']
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this council' });
    }

    const result = await query(
      `SELECT c.*,
              u.username as proposed_by_username,
              u.display_name as proposed_by_display_name,
              (
                SELECT json_agg(
                  json_build_object(
                    'id', o.id,
                    'stance', o.stance,
                    'reasoning', o.reasoning,
                    'username', ou.username,
                    'created_at', o.created_at
                  )
                )
                FROM opinions o
                LEFT JOIN users ou ON o.user_id = ou.id
                WHERE o.conclusion_id = c.id
              ) as opinions
       FROM conclusions c
       LEFT JOIN users u ON c.proposed_by = u.id
       WHERE c.council_id = $1
       ORDER BY c.created_at DESC`,
      [councilId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching conclusions:', error);
    res.status(500).json({ error: 'Failed to fetch conclusions' });
  }
});

// Create a proposal
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { councilId, text, isAmendment, replacesId } = req.body;
    const userId = req.user!.id;

    if (!councilId || !text) {
      return res.status(400).json({ error: 'Council ID and text are required' });
    }

    // Verify user is member
    const memberCheck = await query(
      'SELECT * FROM council_members WHERE council_id = $1 AND user_id = $2 AND status = $3',
      [councilId, userId, 'accepted']
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this council' });
    }

    const result = await query(
      `INSERT INTO conclusions (council_id, text, proposed_by, is_amendment, replaces_conclusion_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [councilId, text, userId, isAmendment || false, replacesId || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating conclusion:', error);
    res.status(500).json({ error: 'Failed to create conclusion' });
  }
});

// Create or update an opinion
router.post('/:id/opinion', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { stance, reasoning } = req.body;
    const userId = req.user!.id;

    if (!stance || !reasoning) {
      return res.status(400).json({ error: 'Stance and reasoning are required' });
    }

    if (stance !== 'support' && stance !== 'oppose') {
      return res.status(400).json({ error: 'Stance must be support or oppose' });
    }

    // Verify user is member of the council
    const councilCheck = await query(
      `SELECT cm.* FROM council_members cm
       JOIN conclusions c ON c.council_id = cm.council_id
       WHERE c.id = $1 AND cm.user_id = $2 AND cm.status = 'accepted'`,
      [id, userId]
    );

    if (councilCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this council' });
    }

    // Upsert opinion
    const result = await query(
      `INSERT INTO opinions (conclusion_id, user_id, stance, reasoning)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (conclusion_id, user_id)
       DO UPDATE SET stance = $3, reasoning = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [id, userId, stance, reasoning]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating opinion:', error);
    res.status(500).json({ error: 'Failed to create opinion' });
  }
});

export default router;
