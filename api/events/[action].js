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
      case 'get':           return get(req, res, await actingAs(req, userId), userId);
      case 'create':        return create(req, res, userId);
      case 'update':        return update(req, res, userId);
      case 'delete':        return remove(req, res, userId);
      case 'register':      return register(req, res, await actingAs(req, userId));
      case 'set-status':    return setStatus(req, res, userId);
      case 'assign-list':   return assignList(req, res, await actingAs(req, userId), userId);
      case 'players':       return players(req, res, userId);
      case 'report-game':   return reportGame(req, res, await actingAs(req, userId));
      case 'confirm-game':  return confirmGame(req, res, await actingAs(req, userId));
      case 'games':         return games(req, res, userId);
      case 'standings':     return standings(req, res, userId);
      case 'reset-test':    return resetTest(req, res, userId);
      case 'seed-test':     return seedTest(req, res, userId);
      case 'export':        return exportEvent(req, res, userId);
      case 'publish':       return publish(req, res, userId);
      case 'settle-game':   return settleGame(req, res, userId);
      case 'player-lists':  return playerLists(req, res, userId);
      case 'game-report':   return gameReport(req, res, await actingAs(req, userId));
      default:
        res.status(404).json({ error: 'Unknown events action' });
    }
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────────────────────────

/**
 * A refusal. `msg` is the English text, and `key` — when the refusal is one a PLAYER can hit — is
 * a translation key the client looks up so the message arrives in the reader's own language. The
 * English text is always sent too, so an untranslated or unknown key degrades to readable English
 * rather than to nothing. `vars` fills the placeholders in the translated template.
 *
 * Admin-only plumbing errors deliberately carry no key: they are read by three people who all read
 * English, and a badly translated operational message is worse than an untranslated one.
 */
const bad = (res, msg, code = 400, key = null, vars = null) => {
  res.status(code).json({ error: msg, key, vars });
  return null;
};

/**
 * May this user CREATE an event? The three senior admins only, for now.
 *
 * Rigzar, 2026-09-14: *"por ahora solo las ligas las crean los 3 admin principales, los que tienen
 * el inquisidor"*. Everyone else joins, reports and confirms — opening the module to players was
 * never the same thing as letting anyone start a league. Enforced here rather than only by hiding
 * the button, because a hidden button is not a rule.
 */
async function canCreateEvent(userId) {
  const r = await sql`SELECT is_admin, is_interrogator FROM users WHERE id = ${userId}`;
  const u = r.rows[0];
  return u?.is_admin === true || u?.is_interrogator === true;
}

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

/**
 * Registration cannot still be open once the event has begun (Unwise: *"maybe force registration
 * end date to be before tournament starting date?"*). Returns a refusal or null.
 *
 * Only checked when BOTH dates are given: an event with no start date has nothing to be before,
 * and an event with no end date is the deliberate *"until all games are played"* case.
 */
function datesRefusal(startsOn, regClosesOn) {
  const a = asDate(startsOn), b = asDate(regClosesOn);
  if (a && b && b > a) {
    return { msg: 'Registration has to close before the event starts.', key: 'evErrRegAfterStart' };
  }
  return null;
}

/**
 * May this user read this event's CONTENTS — its players, games, standings and backup?
 *
 * The rule used to live inside `get` and nowhere else, which meant `players`, `games`, `standings`
 * and `export` answered for any event id a signed-in user cared to try: a PRIVATE league's
 * participant list, army names and factions, and the whole `.json` backup, were readable by
 * someone who was never in it. Test events leaked the same way, which is the one thing the module
 * is most careful about everywhere else.
 *
 * Being LISTED is a different question and deliberately stays looser — a public league is meant
 * to be found and read by anyone, open or closed. This gate is about a PRIVATE one, and about test
 * data.
 */
async function canReadEvent(ev, userId, canManage) {
  if (canManage) return true;
  if (ev.is_test) return false;
  if (ev.visibility === 'public') return true;
  const mine = await sql`SELECT 1 FROM event_players WHERE event_id = ${ev.id} AND user_id = ${userId}`;
  return mine.rows.length > 0;
}

/** A date string the DB will accept, or null — so an empty form field does not become 'Invalid Date'. */
const asDate = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/**
 * Why a player may no longer swap the army list they registered with, or null if they still may.
 *
 * THERE USED TO BE A SECOND REASON — "you have already played a game" — and Dominic removed it:
 * *"actually a player is allowed to change their army after a loss"*. It was mine, not his, and it
 * was argued from a premise that was also wrong (a swap does not rewrite past games: `event_games`
 * stores the roster ids it was reported with). Changing army between games is part of how the
 * league is meant to work.
 *
 * What is left is the deadline, which is what a registration window is for. The ORGANISER is not
 * subject to it — see `assignList`, where fixing a player's entry is the whole point.
 */
function listLockReason(ev) {
  if (!ev.published) return { msg: 'This league is closed.', key: 'evErrListLockedClosed' };
  if (!regOpen(ev)) return { msg: 'Registration has closed, so army lists are locked.', key: 'evErrListLockedReg' };
  return null;
}

/**
 * Is this roster legal for this event? Returns a refusal, or null.
 *
 * A CAP, NOT A TARGET. Rigzar: *"que sea 2500 no quiere decir que todo el mundo llegue a 2500 …
 * mientras no pase de eso el army es probada"*. So under is fine and only over is refused —
 * which is also the only comparison that stops a 4000 point army meeting a 2500 point one.
 *
 * A roster whose stored total is missing is ALLOWED THROUGH rather than refused: the number comes
 * from the save, and an old save may predate it. Blocking a player over a value we never wrote
 * would be our bug charged to them.
 */
async function rosterRejection(ev, rosterId) {
  const r = await sql`
    SELECT CAST(NULLIF(data->>'totalPts', '') AS INTEGER) AS pts,
           data->>'engagement'    AS engagement,
           data->>'alliedFaction' AS allied
      FROM rosters WHERE id = ${rosterId}`;
  const row = r.rows[0];
  if (!row) return { msg: 'That army list no longer exists.' };

  // A cap, not a target: under is fine, only over is refused. A missing total is let through
  // rather than refused — the number comes from the save, and an old save may predate it, so
  // blocking a player over a value we never wrote would be our bug charged to them.
  if (ev.point_limit != null && row.pts != null && row.pts > ev.point_limit) {
    return {
      msg: `That army is ${row.pts} points and this event is capped at ${ev.point_limit}.`,
      key: 'evErrOverLimit', vars: { pts: row.pts, cap: ev.point_limit },
    };
  }
  // Engagement decides the whole army's legality — slots, trait count, stat caps — so a Skirmish
  // league cannot accept a list built as Pitched Battle even if it happens to be under the cap.
  if (ev.engagement && row.engagement && row.engagement !== ev.engagement) {
    const theirs = ENGAGEMENT_LABELS[row.engagement] ?? row.engagement;
    const ours = ENGAGEMENT_LABELS[ev.engagement] ?? ev.engagement;
    return {
      msg: `That army is built for ${theirs} and this event is ${ours}.`,
      key: 'evErrWrongEngagement', vars: { theirs, ours },
    };
  }
  if (ev.allies_allowed === false && row.allied) {
    return {
      msg: 'That army has an allied detachment and this event does not allow allies.',
      key: 'evErrNoAllies',
    };
  }
  return null;
}

/** Only for messages — the stored value is the key, and a player thinks in the printed name. */
const ENGAGEMENT_LABELS = {
  skirmish: 'Skirmish', pitched: 'Pitched Battle', epic: 'Epic Battle',
};

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
async function get(req, res, userId, realUserId = userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return bad(res, 'Event id is required.');

  // `userId` is whoever the page is speaking FOR (a puppet, while an admin drives one); the
  // organiser powers still belong to the real account behind it.
  const { ev, canManage } = await loadEvent(id, realUserId);
  if (!ev) return bad(res, 'Event not found.', 404);

  const mine = await sql`SELECT status, roster_id FROM event_players WHERE event_id = ${id} AND user_id = ${userId}`;
  if (!await canReadEvent(ev, userId, canManage)) return bad(res, 'Event not found.', 404);
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
    // So the picker can disable itself and say why, rather than letting someone choose a list and
    // then be refused. Only meaningful for a registered player.
    // The key travels with it so the picker can explain itself in the reader's language.
    listLock: mine.rows[0] ? listLockReason(ev) : null,
    // What this player owes, so the UI can say why they are blocked before they try something.
    awaitingMe: mine.rows[0] ? await oldestAwaitingMe(ev.id, userId) : null,
  });
}

/** POST /api/events/create -> the caller becomes the organiser. */
async function create(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { name, description, visibility, isLeague, startsOn, endsOn, regOpensOn, regClosesOn, isTest,
          pointLimit, engagement, alliesAllowed } = req.body ?? {};
  if (!await canCreateEvent(userId)) {
    return bad(res, 'Only the organisers can create an event for now.', 403, 'evErrCreateNotAllowed');
  }
  if (typeof name !== 'string' || !name.trim()) return bad(res, 'Event name is required.');
  if (visibility !== undefined && visibility !== 'public' && visibility !== 'private') {
    return bad(res, 'Visibility must be "public" or "private".');
  }
  const dateProblem = datesRefusal(startsOn, regClosesOn);
  if (dateProblem) return bad(res, dateProblem.msg, 400, dateProblem.key);
  // A real league starts CLOSED so nothing reaches players by accident. A TEST event is the exact
  // opposite case: it exists to be driven immediately, it is admin-only whether it is open or not
  // (`is_test` is checked separately everywhere visibility is decided), and leaving it closed only
  // means the puppets you just seeded cannot report a game — a step with nothing behind it.
  const published = isTest === true;
  const r = await sql`
    INSERT INTO events (name, description, organiser_user_id, visibility, is_league,
                        starts_on, ends_on, reg_opens_on, reg_closes_on, is_test, published,
                        point_limit, engagement, allies_allowed)
    VALUES (${name.trim()}, ${typeof description === 'string' ? description.trim() : ''}, ${userId},
            ${visibility ?? 'public'}, ${isLeague === true},
            ${asDate(startsOn)}, ${asDate(endsOn)}, ${asDate(regOpensOn)}, ${asDate(regClosesOn)},
            ${isTest === true}, ${published},
            ${Number.isFinite(Number(pointLimit)) && Number(pointLimit) > 0 ? Number(pointLimit) : null},
            ${ENGAGEMENT_LABELS[engagement] ? engagement : null},
            ${alliesAllowed !== false})
    RETURNING *
  `;
  res.status(200).json({ ok: true, event: r.rows[0] });
}

/** POST /api/events/update -> organiser (or admin) edits the event's own fields. */
async function update(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, name, description, visibility, isLeague, startsOn, endsOn, regOpensOn, regClosesOn,
          pointLimit, engagement, alliesAllowed } = req.body ?? {};
  const { ev, canManage } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can edit this event.', 403);
  const dateProblem = datesRefusal(startsOn, regClosesOn);
  if (dateProblem) return bad(res, dateProblem.msg, 400, dateProblem.key);

  const r = await sql`
    UPDATE events SET
      name          = COALESCE(${typeof name === 'string' && name.trim() ? name.trim() : null}, name),
      description   = COALESCE(${typeof description === 'string' ? description.trim() : null}, description),
      visibility    = COALESCE(${visibility === 'public' || visibility === 'private' ? visibility : null}, visibility),
      is_league     = COALESCE(${typeof isLeague === 'boolean' ? isLeague : null}, is_league),
      starts_on     = ${asDate(startsOn)},
      ends_on       = ${asDate(endsOn)},
      reg_opens_on  = ${asDate(regOpensOn)},
      reg_closes_on = ${asDate(regClosesOn)},
      -- The three event-wide rules. A caller that does not send one leaves it alone.
      -- 0 or null clears the cap; anything else positive sets it; omitting the field leaves it.
      point_limit    = CASE WHEN ${pointLimit === undefined} THEN point_limit
                            ELSE ${Number(pointLimit) > 0 ? Number(pointLimit) : null} END,
      engagement     = COALESCE(${ENGAGEMENT_LABELS[engagement] ? engagement : null}, engagement),
      allies_allowed = COALESCE(${typeof alliesAllowed === 'boolean' ? alliesAllowed : null}, allies_allowed)
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
  if (!ev.published) return bad(res, 'This league is closed — the organiser has not opened it yet.', 400, 'evErrClosed');
  if (!regOpen(ev)) return bad(res, 'Registration for this event is not open.', 400, 'evErrRegClosed');

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
async function assignList(req, res, userId, realUserId = userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { id, rosterId, playerUserId } = req.body ?? {};
  const { ev, canManage } = await loadEvent(Number(id), realUserId);
  if (!ev) return bad(res, 'Event not found.', 404);

  // THE ORGANISER MAY FIX SOMEONE ELSE'S ENTRY. Rigzar: *"deberia haber un metodo para que los
  // admin puedan corregir si alguien se equivoca en una army"* — a player who registers the wrong
  // list writes on Discord, and the fix has to be possible inside the app. Setting `playerUserId`
  // is that, and it needs canManage; without it you are only ever editing your own entry.
  const target = playerUserId != null && Number(playerUserId) !== userId ? Number(playerUserId) : userId;
  if (target !== userId && !canManage) return bad(res, 'Only the organiser can change another player\'s list.', 403);

  const me = await sql`SELECT status FROM event_players WHERE event_id = ${ev.id} AND user_id = ${target}`;
  if (!me.rows[0]) {
    return target === userId
      ? bad(res, 'Register for the event first.', 400, 'evErrRegisterFirst')
      : bad(res, 'That player is not registered.');
  }
  if (me.rows[0].status !== 'approved') {
    return bad(res, 'That registration has not been approved yet.', 403, 'evErrNotApproved');
  }

  // The deadline binds players, not the referee — an entry that needs correcting is usually
  // noticed AFTER registration has closed, which is exactly when a player can no longer self-serve.
  // But it binds an organiser or admin on their OWN entry too, for the same reason they cannot
  // settle their own game: the powers are there to fix other people's problems, not to give the
  // referee a private exemption. Someone else with the powers can still correct them.
  if (target === userId) {
    const locked = listLockReason(ev);
    if (locked) return bad(res, locked.msg, 400, locked.key);
  }

  if (rosterId === null) {
    await sql`UPDATE event_players SET roster_id = NULL WHERE event_id = ${ev.id} AND user_id = ${target}`;
    res.status(200).json({ ok: true, rosterId: null });
    return;
  }
  const own = await sql`SELECT id FROM rosters WHERE id = ${Number(rosterId)} AND user_id = ${target}`;
  if (!own.rows[0]) {
    return target === userId
      ? bad(res, 'That army list is not yours.', 403, 'evErrNotYourList')
      : bad(res, 'That army list does not belong to that player.', 403);
  }
  // The cap applies to the organiser's corrections too, or the fix could create the problem.
  const refused = await rosterRejection(ev, Number(rosterId));
  if (refused) return bad(res, refused.msg, 400, refused.key ?? null, refused.vars ?? null);

  await sql`UPDATE event_players SET roster_id = ${Number(rosterId)} WHERE event_id = ${ev.id} AND user_id = ${target}`;
  res.status(200).json({ ok: true, rosterId: Number(rosterId) });
}

/**
 * GET /api/events/player-lists?id=&userId= -> that participant's saved armies, for the organiser.
 *
 * The other half of letting an organiser correct a wrong entry: to put the right list on someone
 * you have to be able to see which lists they have. Deliberately narrow — organiser only, only
 * for an APPROVED participant of an event they manage, and only name, faction and points. It never
 * returns the army itself, so this is not a way to read someone's list contents.
 */
async function playerLists(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!canManage) return bad(res, 'Only the organiser can see a player\'s lists.', 403);

  const target = Number(req.query.userId);
  const p = await sql`SELECT status FROM event_players WHERE event_id = ${ev.id} AND user_id = ${target}`;
  if (p.rows[0]?.status !== 'approved') return bad(res, 'That player is not an approved participant.', 403);

  const r = await sql`
    SELECT id, name, data->>'faction' AS faction,
           CAST(NULLIF(data->>'totalPts', '') AS INTEGER) AS total_pts
      FROM rosters WHERE user_id = ${target} ORDER BY updated_at DESC`;
  res.status(200).json({ ok: true, rosters: r.rows });
}

/** GET /api/events/players?id= -> the participant overview: name, list, faction. */
async function players(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!await canReadEvent(ev, userId, canManage)) return bad(res, 'Event not found.', 404);

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
  // `opponentRosterId` is deliberately NOT read from the request. It used to be, and it was
  // inserted unchecked: a reporter could name ANY roster id as their opponent's army, including a
  // list belonging to a third party, which then showed on the game row, in the standings and on
  // the printed sheet. Which army someone brought is their own registration's business, so it is
  // read from `event_players` below and nowhere else.
  const { id, opponentUserId, mission, result, playedOn } = req.body ?? {};
  if (!['win', 'draw', 'loss'].includes(result)) return bad(res, 'Result must be win, draw or loss.');
  const { ev } = await loadEvent(Number(id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!ev.published) return bad(res, 'This league is closed — no games can be reported yet.', 400, 'evErrClosedReport');
  if (Number(opponentUserId) === userId) return bad(res, 'You cannot report a game against yourself.', 400, 'evErrSelfGame');
  const owed = await oldestAwaitingMe(ev.id, userId);
  if (owed) {
    return bad(res,
      `You have a game from ${owed.reporter} waiting on you. Confirm it, or dispute it if it is wrong, before reporting another.`,
      400, 'evErrOweConfirmReport', { name: owed.reporter });
  }

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
            ${Number(opponentUserId)}, ${theirs.roster_id},
            ${typeof mission === 'string' ? mission.trim() : ''}, ${result}, ${asDate(playedOn)})
    RETURNING *
  `;
  res.status(200).json({ ok: true, game: r.rows[0] });
}

/**
 * POST /api/events/confirm-game { gameId, confirm, note } -> the OPPONENT accepts or rejects it.
 * Only the opponent may do this: letting the organiser confirm on their behalf would defeat the
 * point of the confirmation. A rejection keeps the row as `disputed` so the organiser can see
 * it — and the organiser is the one who then SETTLES it, with `settle-game` below. A dispute
 * is a flag for the referee, not a verdict.
 */
async function confirmGame(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { gameId, confirm, note } = req.body ?? {};
  const g = await sql`SELECT * FROM event_games WHERE id = ${Number(gameId)}`;
  const game = g.rows[0];
  if (!game) return bad(res, 'Game not found.', 404);
  if (game.opponent_user_id !== userId) return bad(res, 'Only your opponent can confirm this game.', 403, 'evErrNotYourConfirm');
  if (game.status !== 'pending') return bad(res, 'This game has already been resolved.', 400, 'evErrAlreadyResolved');
  // You may always act on the one that is blocking you — that is the whole point of it.
  const owedFirst = await oldestAwaitingMe(game.event_id, userId);
  if (owedFirst && owedFirst.id !== game.id) {
    return bad(res,
      `Deal with the older game from ${owedFirst.reporter} first — confirm it, or dispute it if it is wrong.`,
      400, 'evErrOweConfirmOther', { name: owedFirst.reporter });
  }

  const r = confirm === true
    ? await sql`UPDATE event_games SET status = 'confirmed', confirmed_at = now() WHERE id = ${game.id} RETURNING *`
    : await sql`UPDATE event_games SET status = 'disputed', dispute_note = ${typeof note === 'string' ? note.trim() : null}
                WHERE id = ${game.id} RETURNING *`;
  res.status(200).json({ ok: true, game: r.rows[0] });
}

/** GET /api/events/games?id= -> every reported game, newest first. */
async function games(req, res, userId) {
  if (req.method !== 'GET') return bad(res, 'Method not allowed', 405);
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!await canReadEvent(ev, userId, canManage)) return bad(res, 'Event not found.', 404);
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
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!await canReadEvent(ev, userId, canManage)) return bad(res, 'Event not found.', 404);

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

  // Seeding puppets IS the "I want to drive this now" action, so it opens the event as well —
  // otherwise the players you just created cannot report a game. This also rescues a test event
  // created before that became the default. It stays admin-only either way: `is_test` gates who
  // can see it, `published` only gates joining and reporting.
  if (ev.is_test && !ev.published) await sql`UPDATE events SET published = true WHERE id = ${ev.id}`;

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
 * The oldest game still waiting on THIS player to confirm, or null.
 *
 * Decided in Discord by Dominic, Unwise and Rigzar together, after two timer ideas were dropped.
 * The problem: a reported game counts for nothing until the opponent confirms, and an opponent who
 * simply never does freezes it for ever. A 10-minute auto-dispute was rejected because games get
 * played across different days; a one-week auto-win was rejected because it invents a result
 * nobody agreed to.
 *
 * What is left is Dominic's: *"maybe not allowing the player report a game or confirm another one,
 * before the oldest one is confirmed"*. You are not punished and no result is invented — you
 * simply cannot move on until you have dealt with what is waiting on you. DISPUTING COUNTS AS
 * DEALING WITH IT, which is what keeps this from ever trapping anyone: a game reported against you
 * by mistake is cleared by saying so, and that also puts it in front of the organiser.
 */
async function oldestAwaitingMe(eventId, userId) {
  const r = await sql`
    SELECT g.id, g.created_at, ru.username AS reporter
      FROM event_games g
      JOIN users ru ON ru.id = g.reporter_user_id
     WHERE g.event_id = ${eventId} AND g.opponent_user_id = ${userId} AND g.status = 'pending'
     ORDER BY g.created_at ASC
     LIMIT 1`;
  return r.rows[0] ?? null;
}

/**
 * POST /api/events/game-report { gameId, text, lang } -> write YOUR OWN battle report on a game.
 *
 * Each player writes their own, and can only ever write their own: the two accounts of a game are
 * the point, and a shared box would let one player overwrite the other's words. Editable while the
 * game is unconfirmed, frozen once it is — confirming approves the result AND the reports as they
 * stand, which is what Rigzar asked for (*"si esta escribe un battle report y lo guarde y apruebe"*).
 * If something has to change afterwards, the organiser's Send back reopens the game.
 *
 * `lang` is the language the author was writing IN, taken from their own interface. Stored, never
 * translated — see the migration note in db.js for why.
 */
async function gameReport(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { gameId, text, lang } = req.body ?? {};
  const g = await sql`SELECT * FROM event_games WHERE id = ${Number(gameId)}`;
  const game = g.rows[0];
  if (!game) return bad(res, 'Game not found.', 404);

  const side = game.reporter_user_id === userId ? 'reporter'
    : game.opponent_user_id === userId ? 'opponent' : null;
  if (!side) return bad(res, 'You did not play in this game.', 403, 'evErrNotYourGame');
  if (game.status === 'confirmed') {
    return bad(res, 'This game is confirmed, so its battle report is final.', 400, 'evErrReportFinal');
  }

  const body = typeof text === 'string' && text.trim() ? text.trim().slice(0, 8000) : null;
  const at = body && ['en', 'de', 'es'].includes(lang) ? lang : null;
  const r = side === 'reporter'
    ? await sql`UPDATE event_games SET reporter_report = ${body}, reporter_report_lang = ${at}
                 WHERE id = ${game.id} RETURNING *`
    : await sql`UPDATE event_games SET opponent_report = ${body}, opponent_report_lang = ${at}
                 WHERE id = ${game.id} RETURNING *`;
  res.status(200).json({ ok: true, game: r.rows[0] });
}

/**
 * POST /api/events/settle-game { gameId, action, result, note } -> the ORGANISER settles a game.
 *
 * Players confirm or dispute their own games; that is what makes a result trustworthy. But a
 * dispute used to be the end of the road — `confirm-game` only accepts a row that is still
 * `pending`, so a disputed game sat there for ever, counting for nothing and with nobody able to
 * touch it. The organiser is the referee, so the referee gets the whistle:
 *
 *   · 'confirm' — settle it as it stands, or with a corrected `result` if the two players
 *                 agreed on the wrong way round. Counts toward the standings from then on.
 *   · 'reopen'  — put it back to `pending` so the opponent can look at it again. For the case
 *                 where the dispute was a mistake or the players have since sorted it out.
 *   · 'delete'  — it never happened. Removes the row. Allowed on a PENDING game as well as a
 *                 disputed one (Dominic, asked explicitly): an organiser has to be able to clear
 *                 a game that should never have been reported, not only one the players argued
 *                 about. The REPORTER can withdraw their own unconfirmed game too, below.
 *
 * Deliberately NOT restricted to disputed games: an organiser also has to be able to undo a game
 * that both players confirmed and then realised was wrong. The one thing the organiser still
 * cannot do is confirm a PENDING game on the opponent's behalf — that would quietly hand the
 * referee the power to enter results for people, which is the whole thing confirmation prevents.
 * A pending game they think is wrong can be deleted or left alone, not silently approved.
 */
async function settleGame(req, res, userId) {
  if (req.method !== 'POST') return bad(res, 'Method not allowed', 405);
  const { gameId, action: what, result, note } = req.body ?? {};
  if (!['confirm', 'reopen', 'delete'].includes(what)) {
    return bad(res, 'Action must be confirm, reopen or delete.');
  }
  const g = await sql`SELECT * FROM event_games WHERE id = ${Number(gameId)}`;
  const game = g.rows[0];
  if (!game) return bad(res, 'Game not found.', 404);

  const { ev, canManage } = await loadEvent(game.event_id, userId);
  if (!ev) return bad(res, 'Event not found.', 404);

  // THE REPORTER MAY WITHDRAW THEIR OWN GAME while nobody has confirmed it. Agreed with Rigzar as
  // the companion to the confirmation block: if I report a game against you by mistake, you are
  // the one blocked and I am not, so I have to be able to take it back myself rather than making
  // you dispute my typo. It can never be abused — it is only ever a game no one has agreed to,
  // and it is gone rather than decided.
  const ownWithdrawal = what === 'delete'
    && game.reporter_user_id === userId
    && game.status !== 'confirmed';
  if (!canManage && !ownWithdrawal) {
    return bad(res, 'Only an organiser or admin can settle a game.', 403, 'evErrSettleNotYours');
  }
  // NOBODY SETTLES THEIR OWN GAME. Rigzar: *"si un inquisidor que esté en la liga como jugador no
  // puede auto arreglarse los juegos disputados"*. The referee powers belong to the organiser AND
  // to the admins generally, which is exactly why this line has to exist — an admin who is also
  // playing would otherwise be able to rule on the game they are arguing about. It applies to the
  // organiser too: the principle is the conflict of interest, not the job title. Any OTHER
  // organiser or admin can still settle it, so nothing is ever stuck.
  if (!ownWithdrawal && (game.reporter_user_id === userId || game.opponent_user_id === userId)) {
    return bad(res, 'You played in this game, so you cannot settle it. Another organiser or admin has to.', 403, 'evErrPlayedInIt');
  }
  if (what === 'confirm' && game.status === 'pending') {
    return bad(res, 'This game is still waiting on its opponent. Only they can confirm it.', 400, 'evErrStillPending');
  }

  if (what === 'delete') {
    await sql`DELETE FROM event_games WHERE id = ${game.id}`;
    return res.status(200).json({ ok: true, deleted: game.id });
  }

  // A corrected result is only accepted alongside a settlement, never on its own.
  const settled = what === 'confirm';
  const finalResult = settled && ['win', 'draw', 'loss'].includes(result) ? result : game.result;
  const r = settled
    ? await sql`UPDATE event_games
                   SET status = 'confirmed', result = ${finalResult}, confirmed_at = now(),
                       dispute_note = ${typeof note === 'string' && note.trim() ? note.trim() : game.dispute_note}
                 WHERE id = ${game.id} RETURNING *`
    : await sql`UPDATE event_games
                   SET status = 'pending', confirmed_at = NULL, dispute_note = NULL
                 WHERE id = ${game.id} RETURNING *`;
  res.status(200).json({ ok: true, game: r.rows[0] });
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
  const { ev, canManage } = await loadEvent(Number(req.query.id), userId);
  if (!ev) return bad(res, 'Event not found.', 404);
  if (!await canReadEvent(ev, userId, canManage)) return bad(res, 'Event not found.', 404);

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
           g.mission, g.result, g.status, g.dispute_note, g.played_on, g.created_at, g.confirmed_at,
           -- the backup is the file meant to hold everything, so the reports travel in it too
           g.reporter_report, g.reporter_report_lang, g.opponent_report, g.opponent_report_lang
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
