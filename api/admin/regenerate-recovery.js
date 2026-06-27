import { sql, ensureSchema } from '../_lib/db.js';
import { generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode } from '../_lib/auth.js';

/**
 * Admin-only: issues a fresh recovery code for a username, used to resolve "lost my code"
 * GitHub issues (api/account-recovery.js). Protected by ADMIN_SECRET (a Vercel env var only the
 * repo owner knows) — call with `Authorization: Bearer <ADMIN_SECRET>`, e.g.:
 *
 *   curl -X POST https://<your-app>/api/admin/regenerate-recovery \
 *     -H "Authorization: Bearer <ADMIN_SECRET>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"username":"theirUsername"}'
 *
 * The response's `recoveryCode` is shown ONCE — paste it as a comment on the user's GitHub
 * issue, then it's gone (only its hash is stored).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }
  const auth = req.headers.authorization ?? '';
  if (auth !== `Bearer ${adminSecret}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { username } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) {
      res.status(400).json({ error: 'Missing "username" field' });
      return;
    }

    await ensureSchema();

    const existing = await sql`SELECT id FROM users WHERE username = ${username.trim()}`;
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'No such user' });
      return;
    }

    const recoveryCode = generateRecoveryCode();
    const recoveryCodeHash = await hashRecoveryCode(recoveryCode);
    const recoveryCodeEncrypted = encryptRecoveryCode(recoveryCode);
    await sql`
      UPDATE users SET recovery_code_hash = ${recoveryCodeHash}, recovery_code_encrypted = ${recoveryCodeEncrypted}
      WHERE id = ${existing.rows[0].id}
    `;

    res.status(200).json({ ok: true, username: username.trim(), recoveryCode });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Failed to regenerate code', detail: String(err) });
  }
}
