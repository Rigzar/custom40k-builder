import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

export default async function handler(req, res) {
  switch (req.query.action) {
    case 'update':          return updateProfile(req, res);
    case 'search':          return searchUsers(req, res);
    case 'friend-add':      return friendAdd(req, res);
    case 'friend-remove':   return friendRemove(req, res);
    case 'friend-respond':  return friendRespond(req, res);
    case 'friend-requests': return friendRequests(req, res);
    case 'friends':         return getFriends(req, res);
    case 'public-armies':   return getPublicArmies(req, res);
    case 'copy-army':       return copyArmy(req, res);
    case 'vote-army':       return voteArmy(req, res);
    case 'share-roster':    return shareRoster(req, res);
    case 'unshare-roster':  return unshareRoster(req, res);
    case 'roster-shares':   return getRosterShares(req, res);
    case 'shared-with-me':  return getSharedWithMe(req, res);
    default:
      res.status(404).json({ error: 'Unknown profile action' });
  }
}

async function updateProfile(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { avatar, socialLinks, socialPublic } = req.body ?? {};
    if (avatar !== undefined) {
      const val = avatar === null ? null : String(avatar).slice(0, 200000);
      await sql`UPDATE users SET avatar = ${val} WHERE id = ${userId}`;
    }
    if (socialLinks !== undefined && typeof socialLinks === 'object' && socialLinks !== null) {
      const ALLOWED = ['discord', 'twitter', 'instagram', 'twitch', 'youtube', 'reddit', 'github'];
      const clean = {};
      for (const k of ALLOWED) {
        if (typeof socialLinks[k] === 'string' && socialLinks[k].trim())
          clean[k] = socialLinks[k].trim().slice(0, 100);
      }
      await sql`UPDATE users SET social_links = ${JSON.stringify(clean)} WHERE id = ${userId}`;
    }
    if (typeof socialPublic === 'boolean') {
      await sql`UPDATE users SET social_public = ${socialPublic} WHERE id = ${userId}`;
    }
    const r = await sql`SELECT avatar, social_links, social_public FROM users WHERE id = ${userId}`;
    const u = r.rows[0];
    res.status(200).json({ ok: true, avatar: u.avatar ?? null, socialLinks: u.social_links ?? {}, socialPublic: u.social_public === true });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function searchUsers(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (q.length < 2) { res.status(400).json({ error: 'Query must be at least 2 characters' }); return; }
    const results = await sql`
      SELECT u.username, u.avatar,
        (SELECT status FROM friends WHERE user_id = ${userId} AND friend_id = u.id) AS my_status,
        (SELECT COUNT(*) FROM friends WHERE user_id = u.id AND friend_id = ${userId} AND status = 'pending')::int AS they_requested_me,
        (SELECT COUNT(*) FROM rosters WHERE user_id = u.id AND is_public = true)::int AS public_army_count
      FROM users u
      WHERE u.username ILIKE ${'%' + q + '%'} AND u.id != ${userId}
      ORDER BY u.username LIMIT 10
    `;
    res.status(200).json({ ok: true, users: results.rows.map(u => ({
      username: u.username, avatar: u.avatar ?? null,
      isFriend: u.my_status === 'accepted',
      requestPending: u.my_status === 'pending',
      theyRequestedMe: u.they_requested_me > 0,
      publicArmyCount: Number(u.public_army_count),
    }))});
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/**
 * Request/accept flow. Two rows model one friendship once both sides are 'accepted' — a
 * pending request is only ONE row (requester -> target). Mirrors the shape 'friends' already
 * had (a directed edge per row) instead of introducing a second table for this.
 */
async function friendAdd(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { username } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) { res.status(400).json({ error: 'Username required' }); return; }
    const target = await sql`SELECT id, username FROM users WHERE username = ${username.trim()}`;
    if (!target.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    const friendId = target.rows[0].id;
    if (friendId === userId) { res.status(400).json({ error: 'Cannot add yourself' }); return; }

    // They already sent ME a pending request — adding them back is accepting theirs, not a
    // second request. No new notification: they already know they asked.
    const theirs = await sql`SELECT id FROM friends WHERE user_id = ${friendId} AND friend_id = ${userId} AND status = 'pending'`;
    if (theirs.rows[0]) {
      await sql`UPDATE friends SET status = 'accepted' WHERE id = ${theirs.rows[0].id}`;
      await sql`
        INSERT INTO friends (user_id, friend_id, status) VALUES (${userId}, ${friendId}, 'accepted')
        ON CONFLICT (user_id, friend_id) DO UPDATE SET status = 'accepted'
      `;
      res.status(200).json({ ok: true, status: 'accepted' });
      return;
    }

    const existing = await sql`SELECT status FROM friends WHERE user_id = ${userId} AND friend_id = ${friendId}`;
    if (existing.rows[0]) { res.status(200).json({ ok: true, status: existing.rows[0].status }); return; }

    const me = await sql`SELECT username FROM users WHERE id = ${userId}`;
    await sql`INSERT INTO friends (user_id, friend_id, status) VALUES (${userId}, ${friendId}, 'pending')`;
    await sql`
      INSERT INTO messages (from_user_id, to_user_id, body, kind)
      VALUES (${userId}, ${friendId}, ${me.rows[0].username + ' wants to add you as a friend.'}, 'friend_request')
    `;
    res.status(200).json({ ok: true, status: 'pending' });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Accept or reject a request that's pending FROM `username` TO me (called from the friend-
 * request message in the inbox, or from a pending-requests list). */
async function friendRespond(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { username, accept } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) { res.status(400).json({ error: 'Username required' }); return; }
    const requester = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (!requester.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    const pending = await sql`SELECT id FROM friends WHERE user_id = ${requester.rows[0].id} AND friend_id = ${userId} AND status = 'pending'`;
    if (!pending.rows[0]) { res.status(404).json({ error: 'No pending request from that user' }); return; }
    if (accept) {
      await sql`UPDATE friends SET status = 'accepted' WHERE id = ${pending.rows[0].id}`;
      await sql`
        INSERT INTO friends (user_id, friend_id, status) VALUES (${userId}, ${requester.rows[0].id}, 'accepted')
        ON CONFLICT (user_id, friend_id) DO UPDATE SET status = 'accepted'
      `;
    } else {
      await sql`DELETE FROM friends WHERE id = ${pending.rows[0].id}`;
    }
    res.status(200).json({ ok: true, accepted: !!accept });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Requests pending FROM other people TO me — for a badge/list separate from the inbox. */
async function friendRequests(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const r = await sql`
      SELECT u.username, u.avatar, f.created_at
      FROM friends f JOIN users u ON u.id = f.user_id
      WHERE f.friend_id = ${userId} AND f.status = 'pending'
      ORDER BY f.created_at DESC
    `;
    res.status(200).json({ ok: true, requests: r.rows.map(row => ({
      username: row.username, avatar: row.avatar ?? null, createdAt: row.created_at,
    }))});
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function friendRemove(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { username } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) { res.status(400).json({ error: 'Username required' }); return; }
    const target = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (!target.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    // Removes the friendship both ways (my accepted edge and, if it was mutual, theirs), and
    // any pending request either direction — "remove" also doubles as "cancel"/"decline".
    await sql`DELETE FROM friends WHERE (user_id = ${userId} AND friend_id = ${target.rows[0].id})
                                      OR (user_id = ${target.rows[0].id} AND friend_id = ${userId})`;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function getFriends(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const results = await sql`
      SELECT u.username, u.avatar,
        (SELECT COUNT(*) FROM rosters WHERE user_id = u.id AND is_public = true)::int AS public_army_count
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ${userId} AND f.status = 'accepted'
      ORDER BY u.username
    `;
    res.status(200).json({ ok: true, friends: results.rows.map(r => ({
      username: r.username, avatar: r.avatar ?? null, publicArmyCount: Number(r.public_army_count),
    }))});
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function getPublicArmies(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    await ensureSchema();
    const type = req.query.type ?? 'all';
    const userId = getSessionUserId(req);

    const mapRow = r => ({
      ...r,
      avatar: r.avatar ?? null,
      upvotes:   Number(r.upvotes ?? 0),
      downvotes: Number(r.downvotes ?? 0),
      user_vote: r.user_vote != null ? Number(r.user_vote) : null,
    });

    if (type === 'friends') {
      if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
      const results = await sql`
        SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
          CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
          r.data->>'faction' AS faction_label,
          COALESCE(SUM(CASE WHEN rv.vote =  1 THEN 1 ELSE 0 END), 0)::int AS upvotes,
          COALESCE(SUM(CASE WHEN rv.vote = -1 THEN 1 ELSE 0 END), 0)::int AS downvotes,
          MAX(CASE WHEN rv.user_id = ${userId} THEN rv.vote END) AS user_vote
        FROM rosters r
        JOIN users u ON u.id = r.user_id
        JOIN friends f ON f.friend_id = r.user_id AND f.user_id = ${userId}
        LEFT JOIN roster_votes rv ON rv.roster_id = r.id
        WHERE r.is_public = true
        GROUP BY r.id, u.username, u.avatar
        ORDER BY r.updated_at DESC LIMIT 50
      `;
      res.status(200).json({ ok: true, armies: results.rows.map(mapRow) });
      return;
    }

    if (userId) {
      const results = await sql`
        SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
          CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
          r.data->>'faction' AS faction_label,
          COALESCE(SUM(CASE WHEN rv.vote =  1 THEN 1 ELSE 0 END), 0)::int AS upvotes,
          COALESCE(SUM(CASE WHEN rv.vote = -1 THEN 1 ELSE 0 END), 0)::int AS downvotes,
          MAX(CASE WHEN rv.user_id = ${userId} THEN rv.vote END) AS user_vote
        FROM rosters r
        JOIN users u ON u.id = r.user_id
        LEFT JOIN roster_votes rv ON rv.roster_id = r.id
        WHERE r.is_public = true
        GROUP BY r.id, u.username, u.avatar
        ORDER BY r.updated_at DESC LIMIT 50
      `;
      res.status(200).json({ ok: true, armies: results.rows.map(mapRow) });
    } else {
      const results = await sql`
        SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
          CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
          r.data->>'faction' AS faction_label,
          COALESCE(SUM(CASE WHEN rv.vote =  1 THEN 1 ELSE 0 END), 0)::int AS upvotes,
          COALESCE(SUM(CASE WHEN rv.vote = -1 THEN 1 ELSE 0 END), 0)::int AS downvotes,
          NULL::int AS user_vote
        FROM rosters r
        JOIN users u ON u.id = r.user_id
        LEFT JOIN roster_votes rv ON rv.roster_id = r.id
        WHERE r.is_public = true
        GROUP BY r.id, u.username, u.avatar
        ORDER BY r.updated_at DESC LIMIT 50
      `;
      res.status(200).json({ ok: true, armies: results.rows.map(mapRow) });
    }
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function voteArmy(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { rosterId, vote } = req.body ?? {};
    const id = Number(rosterId);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'Invalid rosterId' }); return; }
    if (vote !== 1 && vote !== -1) { res.status(400).json({ error: 'vote must be 1 or -1' }); return; }
    const pub = await sql`SELECT id FROM rosters WHERE id = ${id} AND is_public = true`;
    if (!pub.rows[0]) { res.status(404).json({ error: 'Army not found' }); return; }
    const existing = await sql`SELECT vote FROM roster_votes WHERE roster_id = ${id} AND user_id = ${userId}`;
    if (existing.rows[0]) {
      if (existing.rows[0].vote === vote) {
        await sql`DELETE FROM roster_votes WHERE roster_id = ${id} AND user_id = ${userId}`;
        res.status(200).json({ ok: true, user_vote: null });
      } else {
        await sql`UPDATE roster_votes SET vote = ${vote} WHERE roster_id = ${id} AND user_id = ${userId}`;
        res.status(200).json({ ok: true, user_vote: vote });
      }
    } else {
      await sql`INSERT INTO roster_votes (roster_id, user_id, vote) VALUES (${id}, ${userId}, ${vote})`;
      res.status(200).json({ ok: true, user_vote: vote });
    }
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function copyArmy(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { rosterId } = req.body ?? {};
    const id = Number(rosterId);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'Invalid rosterId' }); return; }
    const source = await sql`
      SELECT r.name, r.data, u.username
      FROM rosters r JOIN users u ON u.id = r.user_id
      WHERE r.id = ${id} AND (
        r.is_public = true
        OR EXISTS (SELECT 1 FROM roster_shares WHERE roster_id = r.id AND shared_with_user_id = ${userId})
      )
    `;
    if (!source.rows[0]) { res.status(404).json({ error: 'Army not found, not public, and not shared with you' }); return; }
    const { name, data, username: srcUsername } = source.rows[0];
    const inserted = await sql`
      INSERT INTO rosters (user_id, name, data, source_roster_id, source_username)
      VALUES (${userId}, ${name + ' (copy)'}, ${JSON.stringify(data)}, ${id}, ${srcUsername})
      RETURNING id, name, updated_at
    `;
    res.status(200).json({ ok: true, roster: inserted.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Owner shares one of THEIR OWN rosters with a specific other user — visible to that user
 * regardless of is_public. Doesn't require friendship: sharing with a searched-up stranger is
 * a deliberate, explicit act by the owner, same trust level as making the roster fully public. */
async function shareRoster(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { rosterId, username } = req.body ?? {};
    const id = Number(rosterId);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'Invalid rosterId' }); return; }
    if (typeof username !== 'string' || !username.trim()) { res.status(400).json({ error: 'Username required' }); return; }
    const owned = await sql`SELECT id FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
    if (!owned.rows[0]) { res.status(404).json({ error: 'Army not found' }); return; }
    const target = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (!target.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    if (target.rows[0].id === userId) { res.status(400).json({ error: 'Cannot share with yourself' }); return; }
    await sql`
      INSERT INTO roster_shares (roster_id, shared_with_user_id) VALUES (${id}, ${target.rows[0].id})
      ON CONFLICT DO NOTHING
    `;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function unshareRoster(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { rosterId, username } = req.body ?? {};
    const id = Number(rosterId);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'Invalid rosterId' }); return; }
    const owned = await sql`SELECT id FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
    if (!owned.rows[0]) { res.status(404).json({ error: 'Army not found' }); return; }
    const target = await sql`SELECT id FROM users WHERE username = ${String(username ?? '').trim()}`;
    if (!target.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    await sql`DELETE FROM roster_shares WHERE roster_id = ${id} AND shared_with_user_id = ${target.rows[0].id}`;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Who a roster I own is currently shared with — for the share-management UI on my own army. */
async function getRosterShares(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const id = Number(req.query.rosterId);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'Invalid rosterId' }); return; }
    const owned = await sql`SELECT id FROM rosters WHERE id = ${id} AND user_id = ${userId}`;
    if (!owned.rows[0]) { res.status(404).json({ error: 'Army not found' }); return; }
    const r = await sql`
      SELECT u.username, u.avatar FROM roster_shares rs JOIN users u ON u.id = rs.shared_with_user_id
      WHERE rs.roster_id = ${id} ORDER BY u.username
    `;
    res.status(200).json({ ok: true, sharedWith: r.rows.map(row => ({ username: row.username, avatar: row.avatar ?? null })) });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Other people's rosters shared with ME — the "shared with you" list, separate from the public feed. */
async function getSharedWithMe(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const r = await sql`
      SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
        CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
        r.data->>'faction' AS faction_label
      FROM roster_shares rs
      JOIN rosters r ON r.id = rs.roster_id
      JOIN users u ON u.id = r.user_id
      WHERE rs.shared_with_user_id = ${userId}
      ORDER BY r.updated_at DESC
    `;
    res.status(200).json({ ok: true, armies: r.rows.map(row => ({
      id: row.id, name: row.name, updated_at: row.updated_at, username: row.username,
      avatar: row.avatar ?? null, total_pts: row.total_pts, faction_label: row.faction_label,
    }))});
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}
