import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(200).json({ ok: true, loggedIn: false });
    return;
  }

  try {
    await ensureSchema();
    const result = await sql`SELECT username FROM users WHERE id = ${userId}`;
    const user = result.rows[0];
    if (!user) {
      res.status(200).json({ ok: true, loggedIn: false });
      return;
    }
    res.status(200).json({ ok: true, loggedIn: true, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check session', detail: String(err) });
  }
}
