/**
 * Vercel serverless function — files a GitHub Issue for "I lost my recovery code" requests,
 * mirroring api/bug-report.js. NEVER include a password here — only the username and the
 * user's own context, so there is nothing secret to leak via a (semi-public) GitHub issue.
 * The repo owner resolves the issue manually via api/admin/regenerate-recovery.js and posts the
 * new code as a comment on the issue for the user to read.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "Rigzar/custom40k-builder"
  if (!token || !repo) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const { username, message } = req.body ?? {};
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.status(400).json({ error: 'Missing "username" field' });
      return;
    }

    const title = `[Account Recovery] ${username.trim().slice(0, 60)}`;
    const body = [
      '**Username:**',
      username.trim(),
      '',
      '**Additional context:**',
      message?.trim() || '(not provided)',
      '',
      '_Filed via the in-app "lost my recovery code" form. No password is included here — the',
      'repo owner will post a fresh recovery code as a reply on this issue once ownership of the',
      'account is reasonably confirmed._',
    ].join('\n');

    const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'custom40k-builder-account-recovery-form',
      },
      body: JSON.stringify({ title, body, labels: ['account-recovery'] }),
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      res.status(502).json({ error: 'GitHub API error', detail: errText });
      return;
    }

    const issue = await ghRes.json();
    res.status(200).json({ ok: true, url: issue.html_url });
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}
