/**
 * Direct messaging between users. Cookie-session authed (not admin-gated).
 *   GET  /api/messages/unread            -> { count }
 *   GET  /api/messages/inbox             -> { conversations: [{ username, is_admin, last, created_at, unread }] }
 *   GET  /api/messages/thread?with=NAME  -> { messages: [...] }  (also marks the thread read)
 *   POST /api/messages/send { to, body } -> { ok }
 */
import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

async function requireUser(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return null; }
  await ensureSchema();
  return userId;
}

export default async function handler(req, res) {
  switch (req.query.action) {
    case 'unread': return unread(req, res);
    case 'inbox':  return inbox(req, res);
    case 'thread': return thread(req, res);
    case 'send':   return send(req, res);
    default:       res.status(404).json({ error: 'Unknown action' });
  }
}

async function unread(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const me = await requireUser(req, res); if (!me) return;
  try {
    const r = await sql`SELECT COUNT(*)::int AS n FROM messages WHERE to_user_id = ${me} AND read_at IS NULL`;
    res.status(200).json({ ok: true, count: r.rows[0].n });
  } catch (err) { res.status(500).json({ error: String(err) }); }
}

async function inbox(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const me = await requireUser(req, res); if (!me) return;
  try {
    // all messages involving me, newest first; aggregate by counterpart in JS
    const r = await sql`
      SELECT m.id, m.from_user_id, m.to_user_id, m.body, m.created_at, m.read_at,
             uf.username AS from_username, ut.username AS to_username,
             uf.is_admin AS from_admin, ut.is_admin AS to_admin
      FROM messages m
      JOIN users uf ON uf.id = m.from_user_id
      JOIN users ut ON ut.id = m.to_user_id
      WHERE m.from_user_id = ${me} OR m.to_user_id = ${me}
      ORDER BY m.created_at DESC
      LIMIT 500
    `;
    const convos = new Map();
    for (const m of r.rows) {
      const iAmSender = m.from_user_id === me;
      const other = iAmSender
        ? { username: m.to_username, is_admin: m.to_admin }
        : { username: m.from_username, is_admin: m.from_admin };
      if (!convos.has(other.username)) {
        convos.set(other.username, { username: other.username, is_admin: other.is_admin, last: m.body, created_at: m.created_at, unread: 0 });
      }
      if (!iAmSender && m.read_at == null) convos.get(other.username).unread += 1;
    }
    res.status(200).json({ ok: true, conversations: Array.from(convos.values()) });
  } catch (err) { res.status(500).json({ error: String(err) }); }
}

async function thread(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const me = await requireUser(req, res); if (!me) return;
  const withName = String(req.query.with ?? '').trim();
  if (!withName) return res.status(400).json({ error: 'Missing "with"' });
  try {
    const other = await sql`SELECT id, username, is_admin FROM users WHERE LOWER(username) = LOWER(${withName})`;
    if (!other.rows[0]) return res.status(404).json({ error: 'User not found' });
    const oid = other.rows[0].id;
    const r = await sql`
      SELECT m.id, m.from_user_id, m.body, m.created_at, m.read_at,
             uf.username AS from_username, uf.is_admin AS from_admin
      FROM messages m JOIN users uf ON uf.id = m.from_user_id
      WHERE (m.from_user_id = ${me} AND m.to_user_id = ${oid})
         OR (m.from_user_id = ${oid} AND m.to_user_id = ${me})
      ORDER BY m.created_at ASC
      LIMIT 500
    `;
    // mark their messages to me as read
    await sql`UPDATE messages SET read_at = now() WHERE to_user_id = ${me} AND from_user_id = ${oid} AND read_at IS NULL`;
    res.status(200).json({ ok: true, messages: r.rows, other: other.rows[0] });
  } catch (err) { res.status(500).json({ error: String(err) }); }
}

async function send(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const me = await requireUser(req, res); if (!me) return;
  const { to, body } = req.body ?? {};
  if (!to || typeof body !== 'string' || !body.trim()) return res.status(400).json({ error: 'Missing "to"/"body"' });
  if (body.length > 4000) return res.status(400).json({ error: 'Message too long' });
  try {
    const other = await sql`SELECT id FROM users WHERE LOWER(username) = LOWER(${String(to).trim()})`;
    if (!other.rows[0]) return res.status(404).json({ error: 'Recipient not found' });
    if (other.rows[0].id === me) return res.status(400).json({ error: 'Cannot message yourself' });
    await sql`INSERT INTO messages (from_user_id, to_user_id, body) VALUES (${me}, ${other.rows[0].id}, ${body.trim()})`;
    res.status(200).json({ ok: true });
  } catch (err) { res.status(500).json({ error: String(err) }); }
}
