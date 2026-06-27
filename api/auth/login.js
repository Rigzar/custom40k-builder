import { sql, ensureSchema } from '../_lib/db.js';
import { verifyPassword, createSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    await ensureSchema();

    const result = await sql`SELECT id, password_hash FROM users WHERE username = ${username}`;
    const user = result.rows[0];
    // Generic error for both "no such user" and "wrong password" — don't leak which one.
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      res.status(401).json({ error: 'Incorrect username or password.' });
      return;
    }

    await sql`UPDATE users SET last_login_at = now() WHERE id = ${user.id}`;

    res.setHeader('Set-Cookie', createSessionCookie(user.id));
    res.status(200).json({ ok: true, username });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Login failed', detail: String(err) });
  }
}
