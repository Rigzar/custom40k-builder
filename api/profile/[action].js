import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

export default async function handler(req, res) {
  switch (req.query.action) {
    case 'update':        return updateProfile(req, res);
    case 'search':        return searchUsers(req, res);
    case 'friend-add':    return friendAdd(req, res);
    case 'friend-remove': return friendRemove(req, res);
    case 'friends':       return getFriends(req, res);
    case 'public-armies': return getPublicArmies(req, res);
    case 'copy-army':     return copyArmy(req, res);
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
        (SELECT COUNT(*) FROM friends WHERE user_id = ${userId} AND friend_id = u.id)::int AS is_friend,
        (SELECT COUNT(*) FROM rosters WHERE user_id = u.id AND is_public = true)::int AS public_army_count
      FROM users u
      WHERE u.username ILIKE ${'%' + q + '%'} AND u.id != ${userId}
      ORDER BY u.username LIMIT 10
    `;
    res.status(200).json({ ok: true, users: results.rows.map(u => ({
      username: u.username, avatar: u.avatar ?? null,
      isFriend: u.is_friend > 0, publicArmyCount: Number(u.public_army_count),
    }))});
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

async function friendAdd(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
  try {
    await ensureSchema();
    const { username } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) { res.status(400).json({ error: 'Username required' }); return; }
    const target = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (!target.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    const friendId = target.rows[0].id;
    if (friendId === userId) { res.status(400).json({ error: 'Cannot add yourself' }); return; }
    await sql`INSERT INTO friends (user_id, friend_id) VALUES (${userId}, ${friendId}) ON CONFLICT DO NOTHING`;
    res.status(200).json({ ok: true });
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
    await sql`DELETE FROM friends WHERE user_id = ${userId} AND friend_id = ${target.rows[0].id}`;
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
      WHERE f.user_id = ${userId}
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

    if (type === 'friends') {
      if (!userId) { res.status(401).json({ error: 'Not logged in' }); return; }
      const results = await sql`
        SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
          CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
          r.data->>'faction' AS faction_label
        FROM rosters r
        JOIN users u ON u.id = r.user_id
        JOIN friends f ON f.friend_id = r.user_id AND f.user_id = ${userId}
        WHERE r.is_public = true
        ORDER BY r.updated_at DESC LIMIT 50
      `;
      res.status(200).json({ ok: true, armies: results.rows.map(r => ({ ...r, avatar: r.avatar ?? null })) });
      return;
    }

    const results = await sql`
      SELECT r.id, r.name, r.updated_at, u.username, u.avatar,
        CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
        r.data->>'faction' AS faction_label
      FROM rosters r
      JOIN users u ON u.id = r.user_id
      WHERE r.is_public = true
      ORDER BY r.updated_at DESC LIMIT 50
    `;
    res.status(200).json({ ok: true, armies: results.rows.map(r => ({ ...r, avatar: r.avatar ?? null })) });
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
      WHERE r.id = ${id} AND r.is_public = true
    `;
    if (!source.rows[0]) { res.status(404).json({ error: 'Army not found or not public' }); return; }
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
