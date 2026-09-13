import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId, hashPassword } from '../_lib/auth.js';
import { randomBytes } from 'node:crypto';

// Events & Leagues (ALPHA). One dynamic route for every /api/events/* action, same reasoning as
// api/campaign/[action].js — it keeps the Vercel Hobby plan's 12-function cap out of the way as
// the module grows.
//
// Built to Dominic's requirements doc (2026-09-13). Two decisions worth stating up front:
//
//   · An EVENT and a LEAGUE are the same row. Everything except the standings is identical, and a
//     separate table would duplicate registration, approval and list assignment for no gain.
//     `is_league` only decides whether standings are generated.
//
//   · A reported game does NOT count until the opponent confirms it. That is the whole reason
//     event_games has a `status`: a result is never one player's word alone, and a rejected report
//     stays visible to the organiser rather than disappearing.
export default async function handler(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  try {
    await ensureSchema();

    switch (req.query.action) {
      case 'list':          return list(req, res, userId);
      case 'get':           return get(req, res, userId);
      case 'create':        return create(req, res, userId);
      case 'update':        return update(req, res, userId);
      case 'delete':        return remove(req, res, userId);
      case 'register':      return register(req, res, await actingAs(req, userId));
      case 'set-status':    return setStatus(req, res, userId);
      case 'assign-list':   return assignList(req, res, await actingAs(req, userId));
      case 'players':       return players(req, res, userId);
      case 'report-game':   return reportGame(req, res, await actingAs(req, userId));
      case 'confirm-game':  return confirmGame(req, res, await actingAs(req, userId));
      case 'games':         return games(req, res, userId);
      case 'standings':     return standings(req, res, userId);
      case 'reset-test':    return resetTest(req, res, userId);
      case 'seed-test':     return seedTest(req, res, userId);
      case 'export':        return exportEvent(req, res, userId);
      case 'publish':       return publish(req, res, userId);
      default:
        res.status(404).json({ error: 'Unknown events action' });
    }
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────────────────────────

const bad = (res, msg, code = 400) => { res.status(code).json({ error: msg }); return null; };

async function isAdmin(userId) {
  const r = await sql`SELECT is_admin FROM users WHERE id = ${userId}`;
  return r.rows[0]?.is_admin === true;
}

/**
 * "Act as" a fake player — the whole point of the closed alpha.
 *
 * Testing a league alone otherwise means creating real accounts and logging in and out of each one
 * to report a game and then confirm it from the other side. Instead an admin may pass `asUserId`
 * and the action runs as that player.
 *
 * TWO LOCKS, because this is impersonation and nothing else in the app does it:
 *   · the caller must be an admin, and
 *   · the target must be a PUPPET (`users.is_test`), never a real account.
 * A request that fails either check is refused outright rather than quietly falling back to the
 * caller, so a bug here cannot silently post as the wrong person.
 */
async function actingAs(req, userId) {
  const raw = req.body?.asUserId ?? req.query?.asUserId;
  if (raw == null || raw === '') return userId;
  const target = Number(raw);
  if (!Number.isInteger(target)) throw Object.assign(new Error('Bad asUserId.'), { statusCode: 400 });
  if (target === userId) return userId;
  if (!await isAdmin(userId)) throw Object.assign(new Error('Admins only.'), { statusCode: 403 });
  const r = await sql`SELECT is_test FROM users WHERE id = ${target}`;
  if (!r.rows[0]) throw Object.assign(new Error('No such player.'), { statusCode: 404 });
  if (r.rows[0].is_test !== true) {
    throw Object.assign(new Error('You can only act as a test player.'), { statusCode: 403 });
  }
  return target;
}

/** The event row, plus whether this caller may administer it (organiser or site admin). */
async function loadEvent(eventId, userId) {
  const r = await sql`SELECT * FROM events WHERE id = ${eventId}`;
  const ev = r.rows[0];
  if (!ev) return { ev: null, canManage: false };
  return { ev, canManage: ev.organiser_user_id === userId || await isAdmin(userId) };
}

/** A date string the DB will accept, or null — so an empty form field does not become 'Invalid Date'. */
const asDate = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/** Is registration open right now? NULL dates mean "no limit on that side". */
function regOpen(ev) {
  const today = new Date().toISOString().slice(0, 10);
  if (ev.reg_opens_on && today < ev.reg_opens_on.toISOString().slice(0, 10)) return false;
  if (ev.reg_closes_on && today > ev.reg_closes_on.toISOString().slice(0, 10)) return false;
  return true;
}

// ── events ───────────────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/events/list -> every event this user can see: all PUBLIC ones, plus the private ones
 * they organise or have registered for. A private event is invisible to everyone else, which is
 * what makes it private — there is no "browse private events" state.
 *
 * CLOSED IS NOT HIDDEN. A public league appears here whether it is open or not, and so does one
 * that finished years ago: players are meant to browse past seasons and follow one already in
 * progress. `published` only decides whether it can be JOINED and reported into.
 *
 * Test events are the one real exception — they are puppets an admin drives, not something to
 * announce, so they never leave the admin's own view.
 */
async function list(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const result = await sql`
    SELECT e.*, u.username AS organiser,
           (SELECT COUNT(*) FROM event_players p WHERE p.event_id = e.id AND p.status = 'approved') AS player_count,
           (SELECT status FROM event_players p WHERE p.event_id = e.id AND p.user_id = ${userId}) AS my_status
    FROM events e
    JOIN users u ON u.id = e.organiser_user_id
    WHERE (
            -- a closed league is still listed, just not joinable; test data never is
            (e.visibility = 'public' AND NOT e.is_test)
            OR e.organiser_user_id = ${userId}
            OR (SELECT is_admin FROM users WHERE id = ${userId})
            OR EXISTS (SELECT 1 FROM event_players p WHERE p.event_id = e.id AND p.user_id = ${userId})
          )
    ORDER BY e.starts_on DESC NULLS LAST, e.created_at DESC
  `;
  res.status(200).json({ ok: true, events: result.rows });
}

/** GET /api/events/get?id= -> one event, with the caller's own registration state. */
async function get(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return bad(res, 'Event id is required.');

  const { ev, canManage } = await loadEvent(id, userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  const mine = await sql`SELECT status, roster_id FROM event_players WHERE event_id = ${id} AND user_id = ${userId}`;
  // Test events are puppets, not announcements, so they stay out of players' hands entirely.
  const hidden = (ev.visibility !== 'public' && mine.rows.length === 0) || ev.is_test;
  if (!canManage && hidden) return bad(res, 'Event not found.', 404);
  const organiser = await sql`SELECT username FROM users WHERE id = ${ev.organiser_user_id}`;
  res.status(200).json({
    ok: true,
    event: { ...ev, organiser: organiser.rows[0]?.username ?? null },
    canManage,
    // Two separate things, and the UI says which is which: the league has to be OPEN at all, and
    // the registration window has to be current.
    open: ev.published,
    registrationOpen: ev.published && regOpen(ev),
    me: mine.rows[0] ?? null,
  });
}

/** POST /api/events/create -> the caller becomes the organiser. */
async function create(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { name, description, visibility, isLeague, startsOn, endsOn, regOpensOn, regClosesOn, isTest } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) return bad(res, 'Event name is required.');
  if (visibility !== undefined && visibility !== 'public' && visibility !== 'private') {
    return bad(res, 'Visibility must be "public" or "private".');
  }
  const r = await sql`
    INSERT INTO events (name, description, organiser_user_id, visibility, is_league,
                        starts_on, ends_on, reg_opens_on, reg_closes_on, is_test)
    VALUES (${name.trim()}, ${typeof description === 'string' ? description.trim() : ''}, ${userId},
            ${visibility ?? 'public'}, ${isLeague === true},
            ${asDate(startsOn)}, ${asDate(endsOn)}, ${asDate(regOpensOn)}, ${asDate(regClosesOn)},
            ${isTest === true})
    RETURNING *
  `;
  res.status(200).json({ ok: true, event: r.rows[0] });
}

/** POST /api/events/update -> organiser (or admin) edits the event's own fields. */
async function update(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, name, description, visibility, isLeague, startsOn, endsOn, regOpensOn, regClosesOn } = req.body ?? {};
  const { ev, canManage } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can edit this event.', 403);

  const r = await sql`
    UPDATE events SET
      name          = COALESCE(${typeof name === 'string' && name.trim() ? name.trim() : null}, name),
      description   = COALESCE(${typeof description === 'string' ? description.trim() : null}, description),
      visibility    = COALESCE(${visibility === 'public' || visibility === 'private' ? visibility : null}, visibility),
      is_league     = COALESCE(${typeof isLeague === 'boolean' ? isLeague : null}, is_league),
      starts_on     = ${asDate(startsOn)},
      ends_on       = ${asDate(endsOn)},
      reg_opens_on  = ${asDate(regOpensOn)},
      reg_closes_on = ${asDate(regClosesOn)}
    WHERE id = ${ev.id}
    RETURNING *
  `;
  res.status(200).json({ ok: true, event: r.rows[0] });
}

/** POST /api/events/delete -> removes the event and, by cascade, its players and games. */
async function remove(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { ev, canManage } = await loadEvent(Number(req.body?.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can delete this event.', 403);
  await sql`DELETE FROM events WHERE id = ${ev.id}`;
  res.status(200).json({ ok: true });
}

// ── registration ─────────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/events/register -> join a public event (approved immediately) or ask to join a private
 * one (pending until the organiser decides). Re-registering after a rejection is allowed and puts
 * the request back to pending, so an organiser who mis-clicks has not locked anyone out for good.
 */
async function register(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { ev } = await loadEvent(Number(req.body?.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!ev.published) return bad(res, 'This league is closed — the organiser has not opened it yet.');
  if (!regOpen(ev)) return bad(res, 'Registration for this event is not open.');

  const status = ev.visibility === 'public' ? 'approved' : 'pending';
  const r = await sql`
    INSERT INTO event_players (event_id, user_id, status)
    VALUES (${ev.id}, ${userId}, ${status})
    ON CONFLICT (event_id, user_id) DO UPDATE
      SET status = CASE WHEN event_players.status = 'rejected' THEN EXCLUDED.status ELSE event_players.status END
    RETURNING status, roster_id
  `;
  res.status(200).json({ ok: true, me: r.rows[0] });
}

/** POST /api/events/set-status { id, userId, status } -> organiser approves or rejects a request. */
async function setStatus(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, playerUserId, status } = req.body ?? {};
  if (!['approved', 'rejected', 'pending'].includes(status)) return bad(res, 'Unknown status.');
  const { ev, canManage } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can approve registrations.', 403);

  const r = await sql`
    UPDATE event_players SET status = ${status}
    WHERE event_id = ${ev.id} AND user_id = ${Number(playerUserId)}
    RETURNING user_id, status
  `;
  if (!r.rows[0]) return bad(res, 'That player is not registered for this event.', 404);
  res.status(200).json({ ok: true, player: r.rows[0] });
}

/**
 * POST /api/events/assign-list { id, rosterId } -> attach one of MY army lists to this event.
 *
 * Two things are checked rather than assumed: the roster really belongs to the caller (otherwise
 * anyone could attach someone else's list), and for a private event the caller is APPROVED — the
 * requirements say only approved players may assign a list.
 */
async function assignList(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, rosterId } = req.body ?? {};
  const { ev } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  const me = await sql`SELECT status FROM event_players WHERE event_id = ${ev.id} AND user_id = ${userId}`;
  if (!me.rows[0]) return bad(res, 'Register for the event first.');
  if (me.rows[0].status !== 'approved') return bad(res, 'Your registration has not been approved yet.', 403);

  if (rosterId === null) {
    await sql`UPDATE event_players SET roster_id = NULL WHERE event_id = ${ev.id} AND user_id = ${userId}`;
    res.status(200).json({ ok: true, rosterId: null });
    return;
  }
  const own = await sql`SELECT id FROM rosters WHERE id = ${Number(rosterId)} AND user_id = ${userId}`;
  if (!own.rows[0]) return bad(res, 'That army list is not yours.', 403);

  await sql`UPDATE event_players SET roster_id = ${Number(rosterId)} WHERE event_id = ${ev.id} AND user_id = ${userId}`;
  res.status(200).json({ ok: true, rosterId: Number(rosterId) });
}

/** GET /api/events/players?id= -> the participant overview: name, list, faction. */
async function players(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  // Pending and rejected requests are the organiser's business, not the other players'.
  const rows = canManage
    ? await sql`
        SELECT p.user_id, u.username, u.is_test, p.status, p.roster_id, r.name AS roster_name,
               r.data->>'faction' AS faction, p.registered_at
        FROM event_players p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN rosters r ON r.id = p.roster_id
        WHERE p.event_id = ${ev.id}
        ORDER BY p.status, u.username`
    : await sql`
        SELECT p.user_id, u.username, u.is_test, p.status, p.roster_id, r.name AS roster_name,
               r.data->>'faction' AS faction, p.registered_at
        FROM event_players p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN rosters r ON r.id = p.roster_id
        WHERE p.event_id = ${ev.id} AND p.status = 'approved'
        ORDER BY u.username`;
  res.status(200).json({ ok: true, players: rows.rows, canManage });
}

// ── games ────────────────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/events/report-game -> report a game you played. The result is recorded from the
 * REPORTER's point of view and lands as `pending`; it counts for nothing until the opponent
 * confirms it.
 */
async function reportGame(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, opponentUserId, opponentRosterId, mission, result, playedOn } = req.body ?? {};
  if (!['win', 'draw', 'loss'].includes(result)) return bad(res, 'Result must be win, draw or loss.');
  const { ev } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!ev.published) return bad(res, 'This league is closed — no games can be reported yet.');
  if (Number(opponentUserId) === userId) return bad(res, 'You cannot report a game against yourself.');

  const both = await sql`
    SELECT user_id, roster_id FROM event_players
    WHERE event_id = ${ev.id} AND status = 'approved' AND user_id IN (${userId}, ${Number(opponentUserId)})
  `;
  const mine = both.rows.find(r => r.user_id === userId);
  const theirs = both.rows.find(r => r.user_id === Number(opponentUserId));
  if (!mine) return bad(res, 'You are not an approved player in this event.', 403);
  if (!theirs) return bad(res, 'Your opponent is not an approved player in this event.');

  const r = await sql`
    INSERT INTO event_games (event_id, reporter_user_id, reporter_roster_id,
                             opponent_user_id, opponent_roster_id, mission, result, played_on)
    VALUES (${ev.id}, ${userId}, ${mine.roster_id},
            ${Number(opponentUserId)}, ${opponentRosterId != null ? Number(opponentRosterId) : theirs.roster_id},
            ${typeof mission === 'string' ? mission.trim() : ''}, ${result}, ${asDate(playedOn)})
    RETURNING *
  `;
  res.status(200).json({ ok: true, game: r.rows[0] });
}

/**
 * POST /api/events/confirm-game { gameId, confirm, note } -> the OPPONENT accepts or rejects it.
 * Only the opponent may do this: letting the organiser confirm on their behalf would defeat the
 * point of the confirmation. A rejection keeps the row as `disputed` so the organiser can see it.
 */
async function confirmGame(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { gameId, confirm, note } = req.body ?? {};
  const g = await sql`SELECT * FROM event_games WHERE id = ${Number(gameId)}`;
  const game = g.rows[0];
  if (!game) return bad(res, 'Game not found.', 404);
  if (game.opponent_user_id !== userId) return bad(res, 'Only your opponent can confirm this game.', 403);
  if (game.status !== 'pending') return bad(res, 'This game has already been resolved.');

  const r = confirm === true
    ? await sql`UPDATE event_games SET status = 'confirmed', confirmed_at = now() WHERE id = ${game.id} RETURNING *`
    : await sql`UPDATE event_games SET status = 'disputed', dispute_note = ${typeof note === 'string' ? note.trim() : null}
                WHERE id = ${game.id} RETURNING *`;
  res.status(200).json({ ok: true, game: r.rows[0] });
}

/** GET /api/events/games?id= -> every reported game, newest first. */
async function games(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  const rows = await sql`
    SELECT g.*, ru.username AS reporter, ou.username AS opponent,
           rr.name AS reporter_roster_name, orr.name AS opponent_roster_name,
           -- both factions travel with the row: two armies of the SAME faction is the case most
           -- likely to be misread, so the card can name the army rather than just the player
           rr.data->>'faction' AS reporter_faction, orr.data->>'faction' AS opponent_faction
    FROM event_games g
    JOIN users ru ON ru.id = g.reporter_user_id
    JOIN users ou ON ou.id = g.opponent_user_id
    LEFT JOIN rosters rr  ON rr.id  = g.reporter_roster_id
    LEFT JOIN rosters orr ON orr.id = g.opponent_roster_id
    WHERE g.event_id = ${ev.id}
    ORDER BY g.created_at DESC
  `;
  res.status(200).json({ ok: true, games: rows.rows });
}

/**
 * GET /api/events/standings?id= -> the leaderboard, derived from CONFIRMED games only.
 *
 * Derived rather than stored on purpose: a stored table would drift the moment a game is disputed
 * or an organiser corrects one, and there is nothing here expensive enough to cache.
 */
async function standings(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  const rows = await sql`
    WITH results AS (
      -- each confirmed game contributes two rows: the reporter's result, and its mirror image
      SELECT reporter_user_id AS user_id, result FROM event_games
        WHERE event_id = ${ev.id} AND status = 'confirmed'
      UNION ALL
      SELECT opponent_user_id AS user_id,
             CASE result WHEN 'win' THEN 'loss' WHEN 'loss' THEN 'win' ELSE 'draw' END
        FROM event_games WHERE event_id = ${ev.id} AND status = 'confirmed'
    )
    SELECT p.user_id, u.username, r.data->>'faction' AS faction,
           COUNT(res.result) FILTER (WHERE res.result = 'win')  AS wins,
           COUNT(res.result) FILTER (WHERE res.result = 'draw') AS draws,
           COUNT(res.result) FILTER (WHERE res.result = 'loss') AS losses,
           COUNT(res.result)                                     AS played,
           COUNT(res.result) FILTER (WHERE res.result = 'win') * 3
             + COUNT(res.result) FILTER (WHERE res.result = 'draw')  AS points
    FROM event_players p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN rosters r ON r.id = p.roster_id
    LEFT JOIN results res ON res.user_id = p.user_id
    WHERE p.event_id = ${ev.id} AND p.status = 'approved'
    GROUP BY p.user_id, u.username, r.data->>'faction'
    ORDER BY points DESC, wins DESC, u.username
  `;
  res.status(200).json({ ok: true, isLeague: ev.is_league, standings: rows.rows });
}

/**
 * POST /api/events/seed-test { id, players } -> fill an event with PUPPET players and fake armies.
 *
 * The point of the closed alpha is to exercise the league, not to run a sign-up process. So this
 * makes throwaway players with no usable password (their hash is random bytes nobody ever sees, so
 * there is no login to leak), a one-line fake army each, and an approved registration — all flagged
 * `is_test`, all removed by reset-test. The admin then drives them with `asUserId`.
 *
 * FACTIONS ARE DELIBERATELY DUPLICATED. The first thing worth testing is two armies of the SAME
 * faction meeting, which is exactly where a result can look ambiguous, so the seed pairs factions up
 * rather than giving everyone a different one.
 */
async function seedTest(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  if (!await isAdmin(userId)) return bad(res, 'Admins only.', 403);
  const { ev, canManage } = await loadEvent(Number(req.body?.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can seed this event.', 403);

  const want = Math.min(Math.max(Number(req.body?.players) || 4, 2), 12);
  // Pairs on purpose, so a same-faction matchup is available from the first game.
  const FACTIONS = ['Space Marines', 'Space Marines', 'Orks', 'Orks',
                    'Tyranids', 'Tyranids', 'Necrons', 'Necrons',
                    'Chaos Space Marines', 'Chaos Space Marines', 'Eldar', 'Eldar'];
  const NAMES = ['Testus', 'Probus', 'Falsus', 'Dummius', 'Mockus', 'Fakius',
                 'Stubbus', 'Seedus', 'Vacuus', 'Nullus', 'Pseudus', 'Simulus'];

  const stamp = Date.now().toString(36).slice(-4);
  const made = [];
  for (let i = 0; i < want; i++) {
    const username = `${NAMES[i]}-${stamp}`;
    const faction = FACTIONS[i];
    // No usable password: random bytes, hashed, never returned. These accounts exist to be acted
    // AS, not logged into.
    const secret = randomBytes(24).toString('hex');
    const u = await sql`
      INSERT INTO users (username, password_hash, recovery_code_hash, is_test)
      VALUES (${username}, ${await hashPassword(secret)}, ${await hashPassword(secret)}, true)
      RETURNING id, username
    `;
    const uid = u.rows[0].id;

    // A fake army: just enough shape for the participant list, the community badge and the
    // standings to have a faction and a points total to show.
    const points = 1000 + (i % 4) * 250;
    const r = await sql`
      INSERT INTO rosters (user_id, name, data, is_public)
      VALUES (${uid}, ${`${faction} test list ${i + 1}`},
              ${JSON.stringify({ faction, totalPts: points, army: [], test: true })}, true)
      RETURNING id
    `;
    await sql`
      INSERT INTO event_players (event_id, user_id, status, roster_id)
      VALUES (${ev.id}, ${uid}, 'approved', ${r.rows[0].id})
      ON CONFLICT (event_id, user_id) DO NOTHING
    `;
    made.push({ user_id: uid, username, faction, roster_id: r.rows[0].id, points });
  }
  res.status(200).json({ ok: true, players: made });
}

/**
 * POST /api/events/publish { id, published } -> open a league to players, or close it again.
 *
 * The switch the module hangs on. A league is CLOSED until someone deliberately opens it: players
 * can still see that it exists, which is the point of announcing it, but they cannot join it and no
 * games can be reported into it. Reversible, so a league can be closed again when it finishes.
 *
 * A test event stays out of players' hands whether it is open or not — `is_test` is checked
 * separately wherever visibility is decided, so trying the feature out cannot put a league full of
 * puppets in front of anyone.
 */
async function publish(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, published } = req.body ?? {};
  const { ev, canManage } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can open or close this league.', 403);

  const r = await sql`UPDATE events SET published = ${published === true} WHERE id = ${ev.id} RETURNING published`;
  res.status(200).json({ ok: true, published: r.rows[0].published });
}

/**
 * GET /api/events/export?id= -> the whole league as one JSON document.
 *
 * A league is months of other people's results that live in one database, so it needs a copy that
 * is not the database. This returns everything needed to reconstruct it — the event, its players
 * with their lists and factions, every reported game with its status, and the standings as they
 * stood — rather than a dump of table rows, so the file is still readable a year from now.
 *
 * Anyone who can see the event can export it: it contains nothing they cannot already read on the
 * page, and an organiser should not be the only person holding a copy.
 */
async function exportEvent(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  const organiser = await sql`SELECT username FROM users WHERE id = ${ev.organiser_user_id}`;
  const pl = await sql`
    SELECT u.username, p.status, r.name AS army, r.data->>'faction' AS faction,
           CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS points, p.registered_at
    FROM event_players p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN rosters r ON r.id = p.roster_id
    WHERE p.event_id = ${ev.id}
    ORDER BY u.username`;
  const gm = await sql`
    SELECT ru.username AS reporter, ou.username AS opponent,
           rr.name AS reporter_army, orr.name AS opponent_army,
           rr.data->>'faction' AS reporter_faction, orr.data->>'faction' AS opponent_faction,
           g.mission, g.result, g.status, g.dispute_note, g.played_on, g.created_at, g.confirmed_at
    FROM event_games g
    JOIN users ru ON ru.id = g.reporter_user_id
    JOIN users ou ON ou.id = g.opponent_user_id
    LEFT JOIN rosters rr  ON rr.id  = g.reporter_roster_id
    LEFT JOIN rosters orr ON orr.id = g.opponent_roster_id
    WHERE g.event_id = ${ev.id}
    ORDER BY g.created_at`;

  res.status(200).json({
    ok: true,
    exportedAt: new Date().toISOString(),
    format: 'custom40k-league-1',
    event: {
      name: ev.name, description: ev.description, organiser: organiser.rows[0]?.username ?? null,
      visibility: ev.visibility, isLeague: ev.is_league, isTest: ev.is_test,
      startsOn: ev.starts_on, endsOn: ev.ends_on,
      registrationOpensOn: ev.reg_opens_on, registrationClosesOn: ev.reg_closes_on,
    },
    players: pl.rows,
    games: gm.rows,
  });
}

/**
 * POST /api/events/reset-test -> delete every event AND every user flagged `is_test`.
 *
 * Exists because the plan is to run the whole feature closed first, with invented players and
 * lists, and only then open it. Wiping that by hand out of the database is exactly the kind of step
 * that gets half-done, so it is a real operation from the start. Admin only.
 *
 * It deletes the test ACCOUNTS as well, even though users are otherwise the admin module's
 * business, because a reset that leaves a dozen invented players behind has not reset anything —
 * and their rosters, registrations and reported games all cascade from the user row. Only accounts
 * created through the admin panel with "test account" ticked carry the flag, so a real player can
 * never be caught by this.
 */
async function resetTest(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  if (!await isAdmin(userId)) return bad(res, 'Admins only.', 403);
  const ev = await sql`DELETE FROM events WHERE is_test = true RETURNING id`;
  const us = await sql`DELETE FROM users WHERE is_test = true AND id <> ${userId} RETURNING id`;
  res.status(200).json({ ok: true, deleted: ev.rows.length, deletedUsers: us.rows.length });
}
