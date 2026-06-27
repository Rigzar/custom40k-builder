import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId, decryptRecoveryCode } from '../_lib/auth.js';

/**
 * GET /api/auth/recovery-code -> the logged-in user's current recovery code, decrypted, for the
 * account page's eye-icon reveal. { hasCode: true, code } | { hasCode: false } (accounts created
 * before recovery_code_encrypted existed have no recoverable original — they get a real one back
 * the next time they reset their password or hit "lost my code").
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  try {
    await ensureSchema();
    const result = await sql`SELECT recovery_code_encrypted FROM users WHERE id = ${userId}`;
    const user = result.rows[0];
    if (!user?.recovery_code_encrypted) {
      res.status(200).json({ ok: true, hasCode: false });
      return;
    }
    const code = decryptRecoveryCode(user.recovery_code_encrypted);
    res.status(200).json({ ok: true, hasCode: true, code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recovery code', detail: String(err) });
  }
}
