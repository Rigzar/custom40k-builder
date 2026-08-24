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
          campaign_id, campaign_faction, campaign_visible,
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
      const { name, data, campaignId, campaignFaction } = req.body ?? {};
      if (typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ error: 'Missing "name" field' });
        return;
      }
      if (data === undefined) {
        res.status(400).json({ error: 'Missing "data" field' });
        return;
      }

      let cId = null, cFaction = null;
      if (Number.isInteger(campaignId)) {
        // Must be a member of that campaign to tag a roster with it — anyone who's joined can
        // build a list for the campaign, not just the faction they're formally registered as.
        const membership = await sql`SELECT id FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
        if (!membership.rows.length) { res.status(403).json({ error: 'Not a member of that campaign.' }); return; }
        const camp = await sql`SELECT factions FROM campaigns WHERE id = ${campaignId}`;
        if (!camp.rows.length) { res.status(404).json({ error: 'Campaign not found.' }); return; }
        cId = campaignId;
        cFaction = typeof campaignFaction === 'string' && camp.rows[0].factions.includes(campaignFaction) ? campaignFaction : null;
      }

      const inserted = await sql`
        INSERT INTO rosters (user_id, name, data, campaign_id, campaign_faction)
        VALUES (${userId}, ${name.trim()}, ${JSON.stringify(data)}, ${cId}, ${cFaction})
        RETURNING id, name, updated_at, campaign_id, campaign_faction
      `;
      res.status(200).json({ ok: true, roster: inserted.rows[0] });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}
