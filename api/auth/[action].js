import { sql, ensureSchema } from '../_lib/db.js';
import {
  verifyPassword, createSessionCookie, clearSessionCookie, getSessionUserId,
  hashPassword, generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode, decryptRecoveryCode,
  hashSecretAnswer, verifySecretAnswer, verifyRecoveryCode, isValidUsername, isValidPassword,
} from '../_lib/auth.js';

// Single dynamic route for every /api/auth/* endpoint (login, logout, me, register,
// reset-password, secret-question, recovery-code). Vercel's Hobby plan caps a deployment at
// 12 Serverless Functions — these used to be 7 separate files; merging them here (the URL
// for each action is unchanged) frees up headroom without touching any other endpoint.
export default async function handler(req, res) {
  switch (req.query.action) {
    case 'login': return login(req, res);
    case 'logout': return logout(req, res);
    case 'me': return me(req, res);
    case 'register': return register(req, res);
    case 'reset-password': return resetPassword(req, res);
    case 'secret-question': return secretQuestion(req, res);
    case 'recovery-code': return recoveryCode(req, res);
    default:
      res.status(404).json({ error: 'Unknown auth action' });
  }
}

async function login(req, res) {
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

function logout(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.status(200).json({ ok: true });
}

async function me(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(200).json({ ok: true, loggedIn: false });
    return;
  }

  try {
    await ensureSchema();
    const result = await sql`SELECT username, is_admin FROM users WHERE id = ${userId}`;
    const user = result.rows[0];
    if (!user) {
      res.status(200).json({ ok: true, loggedIn: false });
      return;
    }
    sql`UPDATE users SET last_seen_at = now() WHERE id = ${userId}`.catch(() => {});
    res.status(200).json({ ok: true, loggedIn: true, username: user.username, isAdmin: user.is_admin === true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check session', detail: String(err) });
  }
}

async function register(req, res) {
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

/**
 * Self-service password reset using the recovery code shown once at registration (or the most
 * recent one issued by api/admin/regenerate-recovery.js). Rotates the recovery code on success
 * so a leaked/used code can't be replayed.
 */
async function resetPassword(req, res) {
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

/**
 * GET  /api/auth/secret-question?username=X  -> public, used by the "forgot password" flow to
 *      know whether to show the secret-question field at all, and what its text is.
 *      { hasSecretQuestion: true, question } | { hasSecretQuestion: false }
 * POST /api/auth/secret-question { question, answer } -> authenticated, sets/updates/clears
 *      (pass question: null to remove it) the logged-in user's own secret question.
 */
async function secretQuestion(req, res) {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const username = typeof req.query.username === 'string' ? req.query.username : '';
      if (!username.trim()) {
        res.status(400).json({ error: 'Missing "username" query param' });
        return;
      }
      const result = await sql`SELECT secret_question FROM users WHERE username = ${username.trim()}`;
      const user = result.rows[0];
      if (!user || !user.secret_question) {
        res.status(200).json({ ok: true, hasSecretQuestion: false });
        return;
      }
      res.status(200).json({ ok: true, hasSecretQuestion: true, question: user.secret_question });
      return;
    }

    if (req.method === 'POST') {
      const userId = getSessionUserId(req);
      if (!userId) {
        res.status(401).json({ error: 'Not logged in' });
        return;
      }
      const { question, answer } = req.body ?? {};
      if (question === null) {
        await sql`UPDATE users SET secret_question = NULL, secret_answer_hash = NULL WHERE id = ${userId}`;
        res.status(200).json({ ok: true, hasSecretQuestion: false });
        return;
      }
      if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || !answer.trim()) {
        res.status(400).json({ error: 'Both a question and an answer are required.' });
        return;
      }
      const answerHash = await hashSecretAnswer(answer);
      await sql`
        UPDATE users SET secret_question = ${question.trim()}, secret_answer_hash = ${answerHash}
        WHERE id = ${userId}
      `;
      res.status(200).json({ ok: true, hasSecretQuestion: true, question: question.trim() });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}

/**
 * GET /api/auth/recovery-code -> the logged-in user's current recovery code, decrypted, for the
 * account page's eye-icon reveal. { hasCode: true, code } | { hasCode: false } (accounts created
 * before recovery_code_encrypted existed have no recoverable original — they get a real one back
 * the next time they reset their password or hit "lost my code").
 */
async function recoveryCode(req, res) {
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
