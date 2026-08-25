import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId, hashPassword, generateRecoveryCode, hashRecoveryCode, encryptRecoveryCode } from '../_lib/auth.js';

async function requireAdmin(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return null; }
  await ensureSchema();
  const r = await sql`SELECT is_admin FROM users WHERE id = ${userId}`;
  if (!r.rows[0]?.is_admin) { res.status(403).json({ error: 'Forbidden' }); return null; }
  return userId;
}

/** "Interrogator" — a limited admin rank, translations-only. Used ONLY by the 3 actions that
 *  power the i18n editor (getSettings/setSetting/translate); every other action still calls
 *  requireAdmin and stays Inquisitor-only. Callers that allow both must still narrow what an
 *  Interrogator (not a full admin) is allowed to see/change — see getSettings/setSetting below. */
async function requireAdminOrInterrogator(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: 'Not logged in' }); return null; }
  await ensureSchema();
  const r = await sql`SELECT is_admin, is_interrogator FROM users WHERE id = ${userId}`;
  const row = r.rows[0];
  if (!row?.is_admin && !row?.is_interrogator) { res.status(403).json({ error: 'Forbidden' }); return null; }
  return { userId, isAdmin: row.is_admin === true };
}

/** Best-effort audit log — never throws into the caller's happy path. */
async function logAction(adminId, action, targetUserId, targetUsername, detail) {
  try {
    const a = await sql`SELECT username FROM users WHERE id = ${adminId}`;
    await sql`
      INSERT INTO admin_actions (admin_id, admin_username, action, target_user_id, target_username, detail)
      VALUES (${adminId}, ${a.rows[0]?.username ?? null}, ${action}, ${targetUserId ?? null}, ${targetUsername ?? null}, ${detail ?? null})
    `;
  } catch { /* logging must not break the action */ }
}

export default async function handler(req, res) {
  switch (req.query.action) {
    case 'stats':             return stats(req, res);
    case 'users':             return users(req, res);
    case 'pw':                return resetPw(req, res);
    case 'del':               return delUser(req, res);
    case 'promote':           return promote(req, res);
    case 'set-interrogator':  return setInterrogator(req, res);
    case 'recovery-requests': return recoveryRequests(req, res);
    case 'resolve-recovery':  return resolveRecovery(req, res);
    case 'actions':           return actions(req, res);
    case 'user-rosters':      return userRosters(req, res);
    case 'del-roster':        return delRoster(req, res);
    case 'export':            return exportData(req, res);
    case 'get-settings':      return getSettings(req, res);
    case 'set-setting':       return setSetting(req, res);
    case 'translate':         return translate(req, res);
    case 'source-sheets':     return sourceSheets(req, res);
    case 'codex-versions-check': return codexVersionsCheck(req, res);
    case 'codex-content-check': return codexContentCheck(req, res);
    default:                  res.status(404).json({ error: 'Unknown action' });
  }
}

async function stats(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const [uCount, rCount, rPerUser] = await Promise.all([
      sql`SELECT COUNT(*)::int AS n FROM users`,
      sql`SELECT COUNT(*)::int AS n FROM rosters`,
      sql`SELECT u.id, u.username, u.created_at, u.last_seen_at, u.last_login_at, u.is_admin, u.is_interrogator,
               COUNT(r.id)::int AS roster_count
          FROM users u LEFT JOIN rosters r ON r.user_id = u.id
          GROUP BY u.id ORDER BY u.last_seen_at DESC NULLS LAST`,
    ]);
    res.status(200).json({
      ok: true,
      totalUsers: uCount.rows[0].n,
      totalRosters: rCount.rows[0].n,
      users: rPerUser.rows,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function users(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const r = await sql`SELECT id, username, created_at, last_seen_at, last_login_at, is_admin FROM users ORDER BY created_at DESC`;
    res.status(200).json({ ok: true, users: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function resetPw(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const newPw = generateRecoveryCode().toLowerCase().replace(/-/g, '');
    const hash = await hashPassword(newPw);
    const rc = generateRecoveryCode();
    const rcHash = await hashRecoveryCode(rc);
    const rcEnc = encryptRecoveryCode(rc);
    const tgt = await sql`SELECT username FROM users WHERE id=${userId}`;
    await sql`UPDATE users SET password_hash=${hash}, recovery_code_hash=${rcHash}, recovery_code_encrypted=${rcEnc} WHERE id=${userId} AND id != ${adminId}`;
    await logAction(adminId, 'reset_pw', userId, tgt.rows[0]?.username, null);
    res.status(200).json({ ok: true, tempPassword: newPw, recoveryCode: rc });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function delUser(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  if (Number(userId) === adminId) return res.status(400).json({ error: 'Cannot delete own account here' });
  try {
    const tgt = await sql`SELECT username FROM users WHERE id=${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;
    await logAction(adminId, 'delete_user', userId, tgt.rows[0]?.username, null);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function recoveryRequests(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const r = await sql`
      SELECT id, username, message, status, created_at, resolved_at
      FROM recovery_requests
      ORDER BY created_at DESC
      LIMIT 100
    `;
    res.status(200).json({ ok: true, requests: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function resolveRecovery(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { requestId } = req.body ?? {};
  if (!requestId) return res.status(400).json({ error: 'Missing requestId' });
  try {
    const req2 = await sql`SELECT id, username, status FROM recovery_requests WHERE id = ${requestId}`;
    if (!req2.rows[0]) return res.status(404).json({ error: 'Request not found' });
    if (req2.rows[0].status !== 'pending') return res.status(400).json({ error: 'Already resolved' });

    const user = await sql`SELECT id FROM users WHERE username = ${req2.rows[0].username}`;
    if (!user.rows[0]) return res.status(404).json({ error: 'User not found' });
    const userId = user.rows[0].id;

    // Generate new credentials
    const tempPw = generateRecoveryCode().toLowerCase().replaceAll('-', '');
    const pwHash  = await hashPassword(tempPw);
    const rc      = generateRecoveryCode();
    const rcHash  = await hashRecoveryCode(rc);
    const rcEnc   = encryptRecoveryCode(rc);
    const tempPwEnc = encryptRecoveryCode(tempPw);

    // Update user account
    await sql`UPDATE users SET password_hash=${pwHash}, recovery_code_hash=${rcHash}, recovery_code_encrypted=${rcEnc} WHERE id=${userId}`;

    // Mark request resolved, store encrypted credentials
    await sql`
      UPDATE recovery_requests
      SET status='resolved', resolved_at=now(), temp_password_enc=${tempPwEnc}, new_recovery_code_enc=${rcEnc}
      WHERE id=${requestId}
    `;
    await logAction(adminId, 'resolve_recovery', userId, req2.rows[0].username, `request #${requestId}`);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function promote(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId, makeAdmin } = req.body ?? {};
  if (userId == null) return res.status(400).json({ error: 'Missing userId' });
  if (Number(userId) === adminId) return res.status(400).json({ error: 'Cannot change own admin status' });
  try {
    const tgt = await sql`SELECT username FROM users WHERE id=${userId}`;
    await sql`UPDATE users SET is_admin = ${!!makeAdmin} WHERE id = ${userId}`;
    await logAction(adminId, makeAdmin ? 'grant_admin' : 'revoke_admin', userId, tgt.rows[0]?.username, null);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

async function setInterrogator(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { userId, makeInterrogator } = req.body ?? {};
  if (userId == null) return res.status(400).json({ error: 'Missing userId' });
  if (Number(userId) === adminId) return res.status(400).json({ error: 'Cannot change own rank' });
  try {
    const tgt = await sql`SELECT username FROM users WHERE id=${userId}`;
    await sql`UPDATE users SET is_interrogator = ${!!makeInterrogator} WHERE id = ${userId}`;
    await logAction(adminId, makeInterrogator ? 'grant_interrogator' : 'revoke_interrogator', userId, tgt.rows[0]?.username, null);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// GET — recent entries of the admin audit log.
async function actions(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  try {
    const r = await sql`
      SELECT id, admin_username, action, target_username, detail, created_at
      FROM admin_actions ORDER BY created_at DESC LIMIT 200
    `;
    res.status(200).json({ ok: true, actions: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// GET ?userId= — a user's saved armies (metadata only, no full roster payload).
async function userRosters(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const r = await sql`
      SELECT id, name, is_public, created_at, updated_at, data->>'faction' AS faction
      FROM rosters WHERE user_id = ${userId} ORDER BY updated_at DESC
    `;
    res.status(200).json({ ok: true, rosters: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// POST { rosterId } — delete a single saved army.
async function delRoster(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { rosterId } = req.body ?? {};
  if (!rosterId) return res.status(400).json({ error: 'Missing rosterId' });
  try {
    const r = await sql`
      DELETE FROM rosters WHERE id = ${rosterId}
      RETURNING name, user_id
    `;
    if (!r.rows[0]) return res.status(404).json({ error: 'Roster not found' });
    await logAction(adminId, 'delete_roster', r.rows[0].user_id, null, `roster "${r.rows[0].name}" (#${rosterId})`);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// Every table we back up. A restore has to be able to bring accounts back, so this is a FULL dump:
// `users` includes password_hash and the recovery-code columns. That makes the resulting file
// credential material — it must be stored like a password, never shared. The UI warns before the
// download and the action is written to the audit log.
const BACKUP_TABLES = [
  'users', 'rosters', 'friends', 'roster_votes', 'recovery_requests', 'messages',
  'app_settings', 'admin_actions',
  'campaigns', 'campaign_players', 'campaign_sectors', 'campaign_battles',
  'campaign_supply', 'campaign_roster', 'campaign_buildings', 'campaign_events',
];

// GET — full JSON backup: every table, every column (including password hashes).
async function exportData(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  try {
    const tables = {};
    const counts = {};
    for (const t of BACKUP_TABLES) {
      try {
        // table name comes from the fixed list above, never from user input.
        // No ORDER BY: not every table has an `id` (app_settings is keyed by `key`), and ordering
        // doesn't matter for a backup — assuming `id` here silently dropped tables from the dump.
        const r = await sql.query(`SELECT * FROM ${t}`);
        tables[t] = r.rows;
        counts[t] = r.rows.length;
      } catch {
        // a table that doesn't exist yet (older DB) shouldn't sink the whole backup
        tables[t] = null;
        counts[t] = null;
      }
    }
    await logAction(adminId, 'export_db', null, null,
      `FULL backup (incl. credentials): ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    res.status(200).json({
      ok: true,
      exported_at: new Date().toISOString(),
      full: true,
      warning: 'CONTAINS CREDENTIALS (password hashes and recovery codes). Store this file securely; never share it.',
      counts,
      tables,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// POST { id, sheets: [names] } — batch-fetch tabs of a public Google Sheet as CSV (server-side
// proxy so the browser isn't blocked by CORS). Best-effort: a tab that fails comes back null.
async function sourceSheets(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  const { id, sheets } = req.body ?? {};
  if (!id || !/^[A-Za-z0-9_-]+$/.test(String(id))) return res.status(400).json({ error: 'Bad spreadsheet id' });
  if (!Array.isArray(sheets) || sheets.length === 0) return res.status(400).json({ error: 'Missing sheets' });
  const names = sheets.slice(0, 120).map(String);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Google rate-limits bursts: firing every tab at once makes most come back empty, which would
  // silently look like "no differences". Fetch with small concurrency + a retry instead.
  async function fetchTab(name) {
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': 'custom40k-builder' } });
        if (r.ok) {
          const text = await r.text();
          // gviz returns an HTML error page for a missing tab; only keep real CSV
          if (!text.startsWith('<')) return text;
        }
      } catch { /* retry */ }
      await sleep(400);
    }
    return null;
  }

  try {
    // Google's gviz endpoint does NOT fail on an unknown tab name: it silently returns the FIRST
    // tab of the workbook (the Index). Taken at face value that looks like a successful fetch of a
    // datasheet with no headers, so a unit whose tab is misnamed — or that lives in another
    // workbook entirely, like the Escalation Lords of War — reads as "compared, no differences".
    // Fetch one deliberately impossible name up front and treat any tab that comes back identical
    // to it as missing.
    const fallback = await fetchTab('__c40k_no_such_tab__');

    const isMissing = (text) => text == null || (fallback != null && text === fallback);

    // The two sides don't always spell a tab the same way ("Chaos Biker" vs the app's "Chaos
    // Bikers", "Daemon Prince" vs "Daemon prince"). Rather than report the whole datasheet as
    // uncomparable over an 's' or a capital letter, try the obvious variants before giving up.
    const variants = (name) => [
      name.replace(/s$/, ''),
      `${name}s`,
      name.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1)),
      name.toLowerCase(),
    ].filter((v, i, all) => v !== name && all.indexOf(v) === i);

    const data = {};
    let cursor = 0;
    const worker = async () => {
      while (cursor < names.length) {
        const name = names[cursor++];
        let text = await fetchTab(name);
        if (isMissing(text)) {
          for (const v of variants(name)) {
            const alt = await fetchTab(v);
            if (!isMissing(alt)) { text = alt; break; }
            await sleep(80);
          }
        }
        data[name] = isMissing(text) ? null : text;
        await sleep(80);
      }
    };
    await Promise.all(Array.from({ length: Math.min(4, names.length) }, worker));
    const fetched = Object.values(data).filter(Boolean).length;
    res.status(200).json({ ok: true, data, fetched, total: names.length, fallbackDetected: fallback != null });
  } catch (err) {
    res.status(502).json({ error: 'Fetch failed', detail: String(err) });
  }
}

// POST { ids: { factionKey: sheetId } } — best-effort: fetch each Google Sheet's own title (the
// creator names each workbook "<Faction> <version>", e.g. "Chaos Space Marines 1.03") and pull
// the version number straight out of it, instead of an admin re-typing it by hand in the Factions
// tab every time a codex ships. A sheet that fails, or whose title has no version-shaped number,
// comes back null — never guessed.
async function codexVersionsCheck(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  const { ids } = req.body ?? {};
  if (!ids || typeof ids !== 'object') return res.status(400).json({ error: 'Missing ids' });
  const entries = Object.entries(ids).filter(([, id]) => typeof id === 'string' && /^[A-Za-z0-9_-]+$/.test(id)).slice(0, 40);

  async function fetchTitle(id) {
    try {
      const r = await fetch(`https://docs.google.com/spreadsheets/d/${id}/edit`, { headers: { 'User-Agent': 'Mozilla/5.0 custom40k-builder' } });
      if (!r.ok) return null;
      const html = await r.text();
      const m = html.match(/<title>([^<]*)<\/title>/);
      if (!m) return null;
      // Google appends " - Google Sheets" (localised) to the doc's own title — strip everything
      // from the last " - " on, rather than assuming the English suffix.
      const title = m[1].replace(/\s*-\s*[^-]+$/, '').trim();
      const version = title.match(/(\d+\.\d+)/)?.[1] ?? null;
      return { title, version };
    } catch { return null; }
  }

  const results = {};
  let cursor = 0;
  const worker = async () => {
    while (cursor < entries.length) {
      const [key, id] = entries[cursor++];
      results[key] = await fetchTitle(id);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));
  res.status(200).json({ ok: true, results });
}

/**
 * POST { ids: { factionKey: sheetId } } — content-level change detection, one level deeper than
 * codexVersionsCheck above (which only reads the sheet's TITLE). Downloads each live sheet as
 * .ods, hashes every tab's own CSV content (SHA-256 — a single differing cell changes the hash,
 * so nothing can silently slip through the way a human skim-reading a sheet might miss a row),
 * and compares those hashes against the last-known baseline stored under the `codex_content_hashes`
 * setting. Mirrors scripts/fetch_codex.cjs's own tab-by-tab CSV-row comparison, just runnable from
 * the browser instead of a local terminal.
 *
 * Deliberately READ-ONLY: this never writes the baseline or touches production data itself — it
 * only reports which tabs differ from what was last acknowledged. The actual interpretation of
 * what a changed cell MEANS rules-wise, and updating data/parsed/*.json, stays a manual, audited
 * pass (see CLAUDE.md's "REGLA DE ORO") — the frontend calls the existing generic set-setting
 * action to accept a new baseline only after that review, never automatically.
 */
async function codexContentCheck(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!await requireAdmin(req, res)) return;
  const { ids } = req.body ?? {};
  if (!ids || typeof ids !== 'object') return res.status(400).json({ error: 'Missing ids' });
  const entries = Object.fromEntries(
    Object.entries(ids).filter(([, id]) => typeof id === 'string' && /^[A-Za-z0-9_-]+$/.test(id)).slice(0, 40),
  );
  const { checkAllCodexContent } = await import('../_lib/codexContent.js');
  const results = await checkAllCodexContent(sql, entries);
  res.status(200).json({ ok: true, results });
}

// Only these keys can be read/written through the settings admin API.
// 'codex_versions' was missing here — the Factions tab's Save button for codex version/status
// was rejected with "Unknown setting key" every time (found 2026-08-23, fixed same edit).
const SETTING_KEYS = new Set(['announcement', 'faction_flags', 'translations', 'source_sheets', 'data_overrides', 'source_ignores', 'codex_versions', 'codex_content_hashes', 'codex_content_alerts']);

// GET — all editable app settings as a { key: value } map. An Interrogator (translations-only
// rank, not a full admin) only ever gets the 'translations' key back — the announcement draft,
// faction flags, codex version/content-audit state etc. are none of their business.
async function getSettings(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = await requireAdminOrInterrogator(req, res);
  if (!auth) return;
  try {
    const r = await sql`SELECT key, value FROM app_settings`;
    const settings = {};
    for (const row of r.rows) {
      if (!auth.isAdmin && row.key !== 'translations') continue;
      settings[row.key] = row.value;
    }
    res.status(200).json({ ok: true, settings });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

// POST { texts:[], from, to } — machine-translate short admin strings (best-effort, keyless).
// Used by the announcement editor's and the i18n editor's "auto-translate" buttons. Stateless
// proxy, no data read or written — safe for an Interrogator same as a full admin.
async function translate(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!await requireAdminOrInterrogator(req, res)) return;
  const { texts, from, to } = req.body ?? {};
  if (!Array.isArray(texts) || !to) return res.status(400).json({ error: 'Missing texts/to' });
  try {
    const out = await Promise.all(texts.map(async (txt) => {
      if (!txt || !String(txt).trim()) return '';
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from || 'auto')}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(String(txt))}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'custom40k-builder' } });
      if (!r.ok) throw new Error(`translate upstream ${r.status}`);
      const data = await r.json();
      return (data[0] || []).map((seg) => seg[0]).join('');
    }));
    res.status(200).json({ ok: true, translations: out });
  } catch (err) {
    res.status(502).json({ error: 'Translation failed', detail: String(err) });
  }
}

// POST { key, value } — upsert one whitelisted setting. An Interrogator may only ever write the
// 'translations' key — every other key (announcement, faction_flags, codex_* audit state, …)
// stays Inquisitor-only, enforced here rather than just left to the frontend hiding those tabs.
async function setSetting(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = await requireAdminOrInterrogator(req, res);
  if (!auth) return;
  const { key, value } = req.body ?? {};
  if (!SETTING_KEYS.has(key)) return res.status(400).json({ error: 'Unknown setting key' });
  if (!auth.isAdmin && key !== 'translations') return res.status(403).json({ error: 'Forbidden' });
  if (value === undefined) return res.status(400).json({ error: 'Missing value' });
  try {
    const json = JSON.stringify(value);
    await sql`
      INSERT INTO app_settings (key, value, updated_at) VALUES (${key}, ${json}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET value = ${json}::jsonb, updated_at = now()
    `;
    await logAction(auth.userId, 'set_setting', null, null, key);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
