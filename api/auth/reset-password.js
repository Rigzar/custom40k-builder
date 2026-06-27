import { sql, ensureSchema } from '../_lib/db.js';
import {
  verifyRecoveryCode, hashPassword, generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode,
  verifySecretAnswer, isValidPassword,
} from '../_lib/auth.js';

/**
 * Self-service password reset using the recovery code shown once at registration (or the most
 * recent one issued by api/admin/regenerate-recovery.js). Rotates the recovery code on success
 * so a leaked/used code can't be replayed.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { username, recoveryCode, secretAnswer, newPassword } = req.body ?? {};
    if (typeof username !== 'string' || typeof recoveryCode !== 'string') {
      res.status(400).json({ error: 'Username and recovery code are required.' });
      return;
    }
    if (!isValidPassword(newPassword)) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }

    await ensureSchema();

    const result = await sql`
      SELECT id, recovery_code_hash, secret_question, secret_answer_hash FROM users WHERE username = ${username}
    `;
    const user = result.rows[0];
    if (!user || !(await verifyRecoveryCode(recoveryCode, user.recovery_code_hash))) {
      res.status(401).json({ error: 'Username or recovery code is incorrect.' });
      return;
    }
    // Extra factor: if this account has a secret question configured, the answer is required
    // too — knowing the recovery code alone is no longer enough.
    if (user.secret_question) {
      if (typeof secretAnswer !== 'string' || !(await verifySecretAnswer(secretAnswer, user.secret_answer_hash))) {
        res.status(401).json({ error: 'Secret question answer is incorrect.' });
        return;
      }
    }

    const newPasswordHash = await hashPassword(newPassword);
    const newRecoveryCode = generateRecoveryCode();
    const newRecoveryCodeHash = await hashRecoveryCode(newRecoveryCode);
    const newRecoveryCodeEncrypted = encryptRecoveryCode(newRecoveryCode);

    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, recovery_code_hash = ${newRecoveryCodeHash},
          recovery_code_encrypted = ${newRecoveryCodeEncrypted}
      WHERE id = ${user.id}
    `;

    res.status(200).json({ ok: true, recoveryCode: newRecoveryCode });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Reset failed', detail: String(err) });
  }
}
