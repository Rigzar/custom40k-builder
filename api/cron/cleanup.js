import { sql, ensureSchema } from '../_lib/db.js';
import { checkAllCodexContent } from '../_lib/codexContent.js';

/**
 * Deletes accounts (and their rosters, via ON DELETE CASCADE) that haven't logged in for 12
 * months — so a user who loses both their password and recovery code, and never files a
 * recovery request, doesn't leave dead rows behind forever. Scheduled in vercel.json; Vercel
 * Cron calls this with `Authorization: Bearer ${CRON_SECRET}` automatically.
 *
 * Also runs the codex content-hash check daily (see _lib/codexContent.js) and stores which
 * factions currently differ from their last-accepted baseline under the `codex_content_alerts`
 * setting — so a sheet edit gets flagged even on a day nobody happens to open the admin panel and
 * click "CHECK CONTENT" by hand. Read-only against the codices themselves; only ever writes the
 * alert list, never the baseline (an admin has to review and explicitly Accept for that).
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

    let codexAlerts = null;
    try {
      const contentResults = await checkAllCodexContent(sql);
      const flagged = Object.fromEntries(
        Object.entries(contentResults)
          .filter(([, r]) => r.status === 'changed')
          .map(([key, r]) => [key, { newTabs: r.newTabs, removedTabs: r.removedTabs, changedTabs: r.changedTabs, flaggedAt: new Date().toISOString() }]),
      );
      await sql`
        INSERT INTO app_settings (key, value, updated_at) VALUES ('codex_content_alerts', ${JSON.stringify(flagged)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(flagged)}::jsonb, updated_at = now()
      `;
      codexAlerts = Object.keys(flagged).length;
    } catch { /* best-effort — a codex-check failure must not block the account cleanup above */ }

    res.status(200).json({ ok: true, deleted: result.rows.length, codexAlerts });
  } catch (err) {
    res.status(500).json({ error: 'Cleanup failed', detail: String(err) });
  }
}
