import { sql, ensureSchema } from '../_lib/db.js';
import {
  hashPassword, generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode, hashSecretAnswer,
  createSessionCookie, isValidUsername, isValidPassword,
} from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { username, password, secretQuestion, secretAnswer } = req.body ?? {};
    if (!isValidUsername(username)) {
      res.status(400).json({ error: 'Username must be 3-24 characters: letters, numbers, _ or -.' });
      return;
    }
    if (!isValidPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }
    const wantsSecretQuestion = typeof secretQuestion === 'string' && secretQuestion.trim();
    if (wantsSecretQuestion && (typeof secretAnswer !== 'string' || !secretAnswer.trim())) {
      res.status(400).json({ error: 'Secret answer is required if you set a secret question.' });
      return;
    }

    await ensureSchema();

    const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'That username is already taken.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const recoveryCode = generateRecoveryCode();
    const recoveryCodeHash = await hashRecoveryCode(recoveryCode);
    const recoveryCodeEncrypted = encryptRecoveryCode(recoveryCode);
    const secretAnswerHash = wantsSecretQuestion ? await hashSecretAnswer(secretAnswer) : null;

    const inserted = await sql`
      INSERT INTO users (username, password_hash, recovery_code_hash, recovery_code_encrypted, secret_question, secret_answer_hash)
      VALUES (
        ${username}, ${passwordHash}, ${recoveryCodeHash}, ${recoveryCodeEncrypted},
        ${wantsSecretQuestion ? secretQuestion.trim() : null}, ${secretAnswerHash}
      )
      RETURNING id
    `;
    const userId = inserted.rows[0].id;

    res.setHeader('Set-Cookie', createSessionCookie(userId));
    res.status(200).json({ ok: true, username, recoveryCode });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Registration failed', detail: String(err) });
  }
}
