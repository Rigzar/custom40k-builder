import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

/**
 * GET  /api/rosters               -> list this user's saved armies (id, name, updated_at — no data
 *                                     payload, keeps the list lightweight; fetch the full army via
 *                                     /api/rosters/[id]).
 * GET  /api/rosters?token=TOKEN   -> PUBLIC, no login: the read-only army data for a roster's share
 *                                     link (see [id].js's PUT shareToken:'generate'). Deliberately a
 *                                     query param on this existing route rather than a new file —
 *                                     the Vercel Hobby plan's 12-function cap is already maxed out.
 * POST /api/rosters               -> create a new saved army { name, data } -> { id }.
 */
export default async function handler(req, res) {
  if (req.method === 'GET' && typeof req.query.token === 'string' && req.query.token) {
    try {
      await ensureSchema();
      const result = await sql`
        SELECT name, data, updated_at FROM rosters WHERE share_token = ${req.query.token}
      `;
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Link not found or revoked.' });
        return;
      }
      res.status(200).json({ ok: true, roster: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Request failed', detail: String(err) });
    }
    return;
  }

  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await sql`
        SELECT id, name, updated_at, is_public, share_token, source_username, source_roster_id,
          CAST(NULLIF(data->>'totalPts', '') AS INTEGER) AS total_pts,
          data->>'faction' AS faction_label
        FROM rosters
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
