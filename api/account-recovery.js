import { sql, ensureSchema } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    await ensureSchema();
    const { username, message } = req.body ?? {};
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.status(400).json({ error: 'Missing "username" field' }); return;
    }
    const uname = username.trim().slice(0, 60);
    const msg   = typeof message === 'string' ? message.trim().slice(0, 500) : null;

    const user = await sql`SELECT id FROM users WHERE username = ${uname}`;
    if (!user.rows[0]) { res.status(404).json({ error: 'Username not found' }); return; }

    const r = await sql`
      INSERT INTO recovery_requests (username, message)
      VALUES (${uname}, ${msg})
      RETURNING id
    `;
    res.status(200).json({ ok: true, requestId: r.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}
