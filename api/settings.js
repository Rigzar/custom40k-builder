/**
 * Public, read-only app settings for the landing page (announcement banner + per-faction
 * availability overrides). No auth — these are meant to be shown to everyone.
 *
 * Deliberately fail-soft: on ANY error it still returns 200 with nulls, so the frontend simply
 * falls back to its hard-coded defaults and the critical landing path never breaks.
 */
import { sql, ensureSchema } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    await ensureSchema();
    const r = await sql`SELECT key, value FROM app_settings WHERE key IN ('announcement', 'faction_flags')`;
    const map = {};
    for (const row of r.rows) map[row.key] = row.value;
    res.status(200).json({
      ok: true,
      announcement: map.announcement ?? null,
      factionFlags: map.faction_flags ?? null,
    });
  } catch {
    res.status(200).json({ ok: true, announcement: null, factionFlags: null });
  }
}
