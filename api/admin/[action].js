import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId, hashPassword, generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode } from '../_lib/auth.js';

async function requireAdmin(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return null; }
  await ensureSchema();
  const r = await sql`SELECT is_admin FROM users WHERE id = ${userId}`;
  if (!r.rows[0]?.is_admin) { res.status(403).json({ error: 'Forbidden' }); return null; }
  return userId;
}

export default async function handler(req, res) {
  switch (req.query.action) {
    case 'stats':   return stats(req, res);
    case 'users':   return users(req, res);
    case 'pw':      return resetPw(req, res);
    case 'del':     return delUser(req, res);
    case 'promote': return promote(req, res);
    default:        res.status(404).json({ error: 'Unknown action' });
  }
}

async function stats(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const [uCount, rCount, rPerUser] = await Promise.all([
      sql`SELECT COUNT(*)::int AS n FROM users`,
      sql`SELECT COUNT(*)::int AS n FROM rosters`,
      sql`SELECT u.id, u.username, u.created_at, u.last_seen_at, u.last_login_at, u.is_admin,
               COUNT(r.id)::int AS roster_count
          FROM users u LEFT JOIN rosters r ON r.user_id = u.id
          GROUP BY u.id ORDER BY u.last_seen_at DESC NULLS LAST`,
    ]);
    res.status(200).json({
      ok: true,
      totalUsers: uCount.rows[0].n,
      totalRosters: rCount.rows[0].n,
      users: rPerUser.rows,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function users(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const r = await sql`SELECT id, username, created_at, last_seen_at, last_login_at, is_admin FROM users ORDER BY created_at DESC`;
    res.status(200).json({ ok: true, users: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function resetPw(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const newPw = generateRecoveryCode().toLowerCase().replace(/-/g, '');
    const hash = await hashPassword(newPw);
    const rc = generateRecoveryCode();
    const rcHash = await hashRecoveryCode(rc);
    const rcEnc = encryptRecoveryCode(rc);
    await sql`UPDATE users SET password_hash=${hash}, recovery_code_hash=${rcHash}, recovery_code_encrypted=${rcEnc} WHERE id=${userId} AND id != ${adminId}`;
    res.status(200).json({ ok: true, tempPassword: newPw, recoveryCode: rc });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function delUser(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  if (Number(userId) === adminId) return res.status(400).json({ error: 'Cannot delete own account here' });
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function promote(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId, makeAdmin } = req.body ?? {};
  if (userId == null) return res.status(400).json({ error: 'Missing userId' });
  if (Number(userId) === adminId) return res.status(400).json({ error: 'Cannot change own admin status' });
  try {
    await sql`UPDATE users SET is_admin = ${!!makeAdmin} WHERE id = ${userId}`;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
