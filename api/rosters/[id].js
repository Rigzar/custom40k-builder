import { randomBytes } from 'crypto';
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
        SELECT id, name, data, updated_at, campaign_id, campaign_faction, campaign_visible FROM rosters
        WHERE id = ${id} AND (
          user_id = ${userId} OR is_public = true
          OR EXISTS (SELECT 1 FROM roster_shares WHERE roster_id = rosters.id AND shared_with_user_id = ${userId})
          OR (campaign_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM campaign_players cp
            WHERE cp.campaign_id = rosters.campaign_id AND cp.user_id = ${userId}
              AND (cp.role = 'gm' OR rosters.campaign_visible = true)
          ))
          -- A LIST ENTERED IN AN EVENT. Reported by Dominic and Unwise on Discord, 2026-09-22:
          -- every league list showed in the standings and most of them answered "Not found" when
          -- you clicked view. Rigzar found the cause: *"the thing i made is make public the NAME
          -- not the roster"* — entering a list never made it readable, so a player had to
          -- remember to tick "public" by hand and almost nobody did.
          --
          -- Three readers, and they are not the same:
          --   · the ORGANISER of that event, and any site admin, always. They referee it.
          --   · every other APPROVED participant, but only ONCE REGISTRATION HAS CLOSED —
          --     Dominic: "Event army lists should be public by default once the event starts /
          --     the registration closes". Before that, reading your rivals' lists is an
          --     advantage, so this deliberately does not open at registration time.
          -- An unpublished event opens nothing: a league nobody can join yet is not a reason to
          -- read anyone's army.
          OR EXISTS (
            SELECT 1
              FROM event_players ep
              JOIN events e ON e.id = ep.event_id
             WHERE ep.roster_id = rosters.id
               AND ep.status = 'approved'
               AND e.published = true
               AND (
                 e.organiser_user_id = ${userId}
                 OR EXISTS (SELECT 1 FROM users u WHERE u.id = ${userId} AND u.is_admin = true)
                 OR (
                   e.reg_closes_on IS NOT NULL AND e.reg_closes_on < CURRENT_DATE
                   AND EXISTS (
                     SELECT 1 FROM event_players me
                      WHERE me.event_id = e.id AND me.user_id = ${userId} AND me.status = 'approved'
                   )
                 )
               )
          )
        )
      `;
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json({ ok: true, roster: result.rows[0] });
      return;
    }

    if (req.method === 'PUT') {
      const { name, data, is_public, shareToken } = req.body ?? {};
      const existing = await sql`SELECT id FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
      if (existing.rows.length === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (typeof is_public === 'boolean') {
        await sql`UPDATE rosters SET is_public = ${is_public}, updated_at = now() WHERE id = ${id} AND user_id = ${userId}`;
        res.status(200).json({ ok: true });
        return;
      }
      // View-only share link. 'generate' is idempotent — a roster that already has a token keeps
      // it (re-clicking "get link" shouldn't invalidate a link someone already has); 'revoke'
      // clears it, which is the only way to kill a leaked link since there's no expiry.
      if (shareToken === 'generate' || shareToken === 'revoke') {
        if (shareToken === 'revoke') {
          await sql`UPDATE rosters SET share_token = NULL, updated_at = now() WHERE id = ${id} AND user_id = ${userId}`;
          res.status(200).json({ ok: true, shareToken: null });
          return;
        }
        const current = await sql`SELECT share_token FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
        if (current.rows[0].share_token) {
          res.status(200).json({ ok: true, shareToken: current.rows[0].share_token });
          return;
        }
        const token = randomBytes(16).toString('hex');
        await sql`UPDATE rosters SET share_token = ${token}, updated_at = now() WHERE id = ${id} AND user_id = ${userId}`;
        res.status(200).json({ ok: true, shareToken: token });
        return;
      }
      if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
        res.status(400).json({ error: 'Invalid "name" field' });
        return;
      }
      // A LIST SUBMITTED TO A LOCKED EVENT IS FROZEN.
      //
      // Reported by Unwise on Discord, 2026-09-25: "I just updated my League list (1 biomorph) and
      // I think it did not request any organiser/admin authorisation... My hive crone did not have
      // toxin sacs and now it does. I should not be allowed to update my League List without
      // organiser confirmation."
      //
      // He was right, and the hole was structural rather than a missing check: `event_players`
      // stores a roster_id pointing at a LIVE saved army. The events API already locks which list
      // you may ASSIGN once registration closes (`listLockReason`), so nobody could swap list A
      // for list B — but nothing stopped you editing list A itself, which is the same thing with
      // extra steps. The lock has to live where the army is written, not only where it is chosen.
      //
      // Scoped to the DATA: renaming a list, sharing it or making it public are not changes to the
      // army and stay allowed (they return above, before this). An organiser who needs to let
      // someone correct a genuine mistake can reopen registration, which is the same lever that
      // governs assignment — one rule, one place to change it.
      if (data !== undefined) {
        const locked = await sql`
          SELECT e.id, e.name, e.published, e.reg_closes_on
            FROM event_players ep
            JOIN events e ON e.id = ep.event_id
           WHERE ep.roster_id = ${id}
             AND ep.user_id = ${userId}
             AND ep.status = 'approved'
             AND (e.published = false OR (e.reg_closes_on IS NOT NULL AND e.reg_closes_on < CURRENT_DATE))
           LIMIT 1`;
        if (locked.rows[0]) {
          const ev = locked.rows[0];
          res.status(403).json({
            error: ev.published
              ? `This list is entered in "${ev.name}" and registration has closed, so it is locked. Ask the organiser to reopen registration if it needs correcting.`
              : `This list is entered in "${ev.name}", which is not open yet, so it is locked.`,
            // No i18n `key`: `translateError` falls back to the English `error` above, and
            // inventing a key with no entry behind it would print nothing at all.
            eventId: ev.id,
            eventName: ev.name,
          });
          return;
        }
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
