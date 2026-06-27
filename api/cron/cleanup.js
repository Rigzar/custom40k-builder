import { sql, ensureSchema } from '../_lib/db.js';

/**
 * Deletes accounts (and their rosters, via ON DELETE CASCADE) that haven't logged in for 12
 * months — so a user who loses both their password and recovery code, and never files a
 * recovery request, doesn't leave dead rows behind forever. Scheduled in vercel.json; Vercel
 * Cron calls this with `Authorization: Bearer ${CRON_SECRET}` automatically.
 */
export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization ?? '';
    if (auth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  try {
    await ensureSchema();
    const result = await sql`
      DELETE FROM users WHERE last_login_at < now() - INTERVAL '12 months' RETURNING id
    `;
    res.status(200).json({ ok: true, deleted: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Cleanup failed', detail: String(err) });
  }
}
