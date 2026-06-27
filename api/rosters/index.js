import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

/**
 * GET  /api/rosters       -> list this user's saved armies (id, name, updated_at — no data payload,
 *                             keeps the list lightweight; fetch the full army via /api/rosters/[id]).
 * POST /api/rosters       -> create a new saved army { name, data } -> { id }.
 */
export default async function handler(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await sql`
        SELECT id, name, updated_at FROM rosters
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
      `;
      res.status(200).json({ ok: true, rosters: result.rows });
      return;
    }

    if (req.method === 'POST') {
      const { name, data } = req.body ?? {};
      if (typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ error: 'Missing "name" field' });
        return;
      }
      if (data === undefined) {
        res.status(400).json({ error: 'Missing "data" field' });
        return;
      }
      const inserted = await sql`
        INSERT INTO rosters (user_id, name, data)
        VALUES (${userId}, ${name.trim()}, ${JSON.stringify(data)})
        RETURNING id, name, updated_at
      `;
      res.status(200).json({ ok: true, roster: inserted.rows[0] });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}
