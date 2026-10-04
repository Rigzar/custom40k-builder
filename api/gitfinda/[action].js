import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';
import { gitfinda, Refusal } from '../_lib/gitfinda.js';

// Gitfinda — the "looking for a game" board. One dynamic route for every /api/gitfinda/* action, so
// the whole module costs ONE of the Vercel Hobby plan's 12 functions (this is the twelfth: there is
// no slot left after it, fold another route in before adding any more).
//
// All the logic lives in api/_lib/gitfinda.js, which takes `sql` as a parameter so it can be tested
// against a local Postgres (scripts/_gitfinda_test.mjs). This file only logs the caller in,
// picks the action and turns a Refusal into the JSON the client translates.
export default async function handler(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }
  try {
    await ensureSchema();
    const g = gitfinda(sql);
    const body = req.body ?? {};
    switch (req.query.action) {
      case 'events':     return res.status(200).json(await g.events());
      case 'list':       return res.status(200).json(await g.list(userId, req.query));
      case 'my-posts':   return res.status(200).json(await g.myPosts(userId));
      case 'my-matches': return res.status(200).json(await g.myMatches(userId));
      case 'messages':   return res.status(200).json(await g.messages(userId, req.query));
      case 'unread':     return res.status(200).json(await g.unread(userId));
      case 'create':     return post(req, res, () => g.create(userId, body));
      case 'cancel':     return post(req, res, () => g.cancel(userId, body));
      case 'match':      return post(req, res, () => g.match(userId, body));
      case 'unmatch':    return post(req, res, () => g.unmatch(userId, body));
      case 'send':       return post(req, res, () => g.send(userId, body));
      default:
        res.status(404).json({ error: 'Unknown gitfinda action' });
    }
  } catch (err) {
    if (err instanceof Refusal) {
      res.status(err.statusCode).json({ error: err.message, key: err.key, vars: err.vars });
      return;
    }
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}

/** Actions that change something are POST only. */
async function post(req, res, run) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  res.status(200).json(await run());
}
