/**
 * Vercel serverless function — creates a GitHub Issue from the in-app bug report form
 * (replaces Formspree, which caps free submissions at 50/month). GITHUB_TOKEN must be a
 * fine-grained PAT scoped to "Issues: write" on this repo only, set as a Vercel env var
 * (server-side only — never exposed to the client).
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

  const { what, expected, faction } = req.body ?? {};
  if (!what || typeof what !== 'string' || !what.trim()) {
    res.status(400).json({ error: 'Missing "what" field' });
    return;
  }

  const title = `[Bug] ${what.trim().slice(0, 80)}`;
  const body = [
    '**What happened?**',
    what.trim(),
    '',
    '**What did you expect to happen?**',
    expected?.trim() || '(not provided)',
    '',
    '**Which faction or unit?**',
    faction?.trim() || '(not provided)',
    '',
    '_Reported via the in-app bug form._',
  ].join('\n');

  try {
    const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'custom40k-builder-bug-form',
      },
      body: JSON.stringify({ title, body, labels: ['bug-report'] }),
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      res.status(502).json({ error: 'GitHub API error', detail: errText });
      return;
    }

    const issue = await ghRes.json();
    res.status(200).json({ ok: true, url: issue.html_url });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}
