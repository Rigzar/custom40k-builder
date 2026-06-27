import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId, hashSecretAnswer } from '../_lib/auth.js';

/**
 * GET  /api/auth/secret-question?username=X  -> public, used by the "forgot password" flow to
 *      know whether to show the secret-question field at all, and what its text is.
 *      { hasSecretQuestion: true, question } | { hasSecretQuestion: false }
 * POST /api/auth/secret-question { question, answer } -> authenticated, sets/updates/clears
 *      (pass question: null to remove it) the logged-in user's own secret question.
 */
export default async function handler(req, res) {
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
