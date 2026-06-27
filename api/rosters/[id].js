import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

/**
 * GET    /api/rosters/:id -> { roster: { id, name, data, updated_at } }
 * PUT    /api/rosters/:id -> update { name?, data? } (ownership checked via user_id match)
 * DELETE /api/rosters/:id
 */
export default async function handler(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid roster id' });
    return;
  }

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await sql`
        SELECT id, name, data, updated_at FROM rosters WHERE id = ${id} AND user_id = ${userId}
      `;
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json({ ok: true, roster: result.rows[0] });
      return;
    }

    if (req.method === 'PUT') {
      const { name, data } = req.body ?? {};
      const existing = await sql`SELECT id FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
      if (existing.rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
        res.status(400).json({ error: 'Invalid "name" field' });
        return;
      }
      const result = await sql`
        UPDATE rosters
        SET name = COALESCE(${name?.trim() ?? null}, name),
            data = COALESCE(${data !== undefined ? JSON.stringify(data) : null}, data),
            updated_at = now()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id, name, updated_at
      `;
      res.status(200).json({ ok: true, roster: result.rows[0] });
      return;
    }

    if (req.method === 'DELETE') {
      const result = await sql`DELETE FROM rosters WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}
