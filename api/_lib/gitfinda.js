/**
 * Gitfinda — the "looking for a game" board (Dominic's requirements document, 2026-10).
 *
 *   Create Post → Browse Posts → Match → Chat → Play
 *
 * Everything here takes `sql` as a PARAMETER instead of importing it. That is deliberate: the SQL
 * is the part that cannot be eyeballed, and a function that receives its database can be run
 * against a local Postgres (PGlite) in tests/gitfinda_test.mjs instead of being trusted blind.
 * The route (api/gitfinda/[action].js) is a thin shell that supplies the real one.
 *
 * Decisions taken from the author's answers (atypicalhero, 2026-10-03):
 *   · no email notifications yet — the app has no way to send mail;
 *   · engagement types are Skirmish / Pitched / Epic (the "Matched Play / Narrative" in the mockups
 *     came from ChatGPT);
 *   · a player may NOT match the same post twice;
 *   · no blocking and no ending of a conversation for now;
 *   · usernames only, nothing else about a person is ever sent to another player.
 *
 * Status model. Only `active` and `cancelled` are STORED. "Expired" (every time slot is in the
 * past) and "Matched" (at least one player matched) are DERIVED when read, so there is nothing to
 * keep in sync and no job that must run on time for a post to disappear from the listing.
 */

export const ENGAGEMENTS = ['skirmish', 'pitched', 'epic'];

/** Same keys as FACTION_LOADERS (src/data/loaders.ts). tests/gitfinda_test.mjs checks they agree. */
export const ARMIES = [
  'chaos_space_marines', 'chaos_daemons', 'space_marines', 'imperial_guard', 'adeptus_mechanicus',
  'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'tau_empire', 'necrons',
  'orks', 'eldar', 'dark_eldar', 'genestealer_cults', 'harlequins', 'leagues_of_votann', 'tyranids',
];

export const LIMITS = {
  activePostsPerUser: 5,
  slotsPerPost: 14,
  slotMaxHours: 24,
  slotMaxDaysAhead: 120,
  pointsMin: 100,
  pointsMax: 20000,
  messageMaxChars: 1000,
  messagesPerMinute: 20,
  listMax: 100,
};

/** A refusal the client can show in the reader's language: `key` is a translation key. */
export class Refusal extends Error {
  constructor(message, status = 400, key = null, vars = null) {
    super(message);
    this.statusCode = status;
    this.key = key;
    this.vars = vars;
  }
}

// ── schema ───────────────────────────────────────────────────────────────────────────────────────

export async function gitfindaSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS gitfinda_posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      army TEXT NOT NULL,
      engagement TEXT NOT NULL,
      points INTEGER NOT NULL,
      -- An IANA zone ("Europe/Berlin"), never a bare offset: "UTC+1" has no idea about summer time.
      timezone TEXT NOT NULL,
      event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
      -- 'active' | 'cancelled'. Expired and Matched are derived, see the header.
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_posts_user_idx ON gitfinda_posts(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_posts_status_idx ON gitfinda_posts(status, created_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS gitfinda_slots (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES gitfinda_posts(id) ON DELETE CASCADE,
      -- Stored in UTC; the poster's own zone lives on the post.
      starts_at TIMESTAMPTZ NOT NULL,
      ends_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_slots_post_idx ON gitfinda_slots(post_id)`;
  await sql`
    CREATE TABLE IF NOT EXISTS gitfinda_matches (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES gitfinda_posts(id) ON DELETE CASCADE,
      owner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      matcher_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'open',
      owner_read_at TIMESTAMPTZ,
      matcher_read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      -- "No, makes no sense to me" (author): the same player cannot match the same post twice.
      UNIQUE (post_id, matcher_user_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_matches_owner_idx ON gitfinda_matches(owner_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_matches_matcher_idx ON gitfinda_matches(matcher_user_id)`;
  await sql`
    CREATE TABLE IF NOT EXISTS gitfinda_messages (
      id SERIAL PRIMARY KEY,
      match_id INTEGER NOT NULL REFERENCES gitfinda_matches(id) ON DELETE CASCADE,
      sender_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS gitfinda_messages_match_idx ON gitfinda_messages(match_id, id)`;
}

// ── validation ───────────────────────────────────────────────────────────────────────────────────

function validZone(tz) {
  if (typeof tz !== 'string' || !tz || tz.length > 64) return false;
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; }
}

/** Turns what the client sent into clean rows, or throws a Refusal that says what is wrong. */
export function validatePost(body, now = new Date()) {
  const army = String(body?.army ?? '');
  if (!ARMIES.includes(army)) throw new Refusal('Choose an army.', 400, 'gfErrArmy');
  const engagement = String(body?.engagement ?? '');
  if (!ENGAGEMENTS.includes(engagement)) throw new Refusal('Choose an engagement type.', 400, 'gfErrEngagement');
  const points = Number(body?.points);
  if (!Number.isInteger(points) || points < LIMITS.pointsMin || points > LIMITS.pointsMax) {
    throw new Refusal(`Points must be a whole number from ${LIMITS.pointsMin} to ${LIMITS.pointsMax}.`, 400,
      'gfErrPoints', { min: LIMITS.pointsMin, max: LIMITS.pointsMax });
  }
  const timezone = String(body?.timezone ?? '');
  if (!validZone(timezone)) throw new Refusal('Choose a time zone.', 400, 'gfErrTimezone');
  const eventId = body?.eventId == null || body.eventId === '' ? null : Number(body.eventId);
  if (eventId !== null && !Number.isInteger(eventId)) throw new Refusal('Unknown event.', 400, 'gfErrEvent');

  const raw = Array.isArray(body?.slots) ? body.slots : [];
  if (raw.length === 0) throw new Refusal('Add at least one time slot.', 400, 'gfErrNoSlot');
  if (raw.length > LIMITS.slotsPerPost) {
    throw new Refusal(`At most ${LIMITS.slotsPerPost} time slots.`, 400, 'gfErrTooManySlots', { max: LIMITS.slotsPerPost });
  }
  const horizon = now.getTime() + LIMITS.slotMaxDaysAhead * 86400000;
  const slots = raw.map(s => {
    const start = new Date(s?.start), end = new Date(s?.end);
    if (isNaN(start) || isNaN(end)) throw new Refusal('A time slot is not a valid date.', 400, 'gfErrSlotInvalid');
    if (end <= start) throw new Refusal('A time slot ends before it starts.', 400, 'gfErrSlotOrder');
    if (end - start > LIMITS.slotMaxHours * 3600000) {
      throw new Refusal(`A time slot can be at most ${LIMITS.slotMaxHours} hours long.`, 400, 'gfErrSlotLong', { max: LIMITS.slotMaxHours });
    }
    if (end <= now) throw new Refusal('A time slot is already in the past.', 400, 'gfErrSlotPast');
    if (start.getTime() > horizon) {
      throw new Refusal(`A time slot is more than ${LIMITS.slotMaxDaysAhead} days away.`, 400, 'gfErrSlotFar', { max: LIMITS.slotMaxDaysAhead });
    }
    return { start: start.toISOString(), end: end.toISOString() };
  });
  return { army, engagement, points, timezone, eventId, slots };
}

// ── the actions ──────────────────────────────────────────────────────────────────────────────────

const rowsOf = r => r.rows ?? [];

/*
 * One post as the browser sees it is built by three queries (list, my-posts, my-matches) that all
 * select the same columns. The column list is written out in each of them: a tagged-template `sql`
 * cannot take another query as a fragment, so there is no way to share it. If one changes, change
 * all three — tests/gitfinda_test.mjs reads all three back.
 */

function derivedStatus(r) {
  if (r.stored_status === 'cancelled') return 'cancelled';
  if (!r.has_future_slot) return 'expired';
  return r.match_count > 0 ? 'matched' : 'active';
}

function shapePost(r, extra = {}) {
  return {
    id: r.id, username: r.username, army: r.army, engagement: r.engagement, points: r.points,
    timezone: r.timezone, eventId: r.event_id, eventName: r.event_name ?? null,
    createdAt: r.created_at, slots: r.slots, status: derivedStatus(r), ...extra,
  };
}

export function gitfinda(sql) {
  /** Events a post can be attached to: public ones that have not ended. */
  async function events() {
    const r = await sql`
      SELECT id, name, is_league FROM events
      WHERE visibility = 'public' AND (ends_on IS NULL OR ends_on >= CURRENT_DATE)
      ORDER BY name LIMIT 200`;
    return { events: rowsOf(r).map(e => ({ id: e.id, name: e.name, isLeague: e.is_league })) };
  }

  async function list(userId, q) {
    const army = ARMIES.includes(q.army) ? q.army : null;
    const engagement = ENGAGEMENTS.includes(q.engagement) ? q.engagement : null;
    const eventId = q.eventId != null && q.eventId !== '' && Number.isInteger(Number(q.eventId)) ? Number(q.eventId) : null;
    const text = typeof q.q === 'string' && q.q.trim() ? q.q.trim().slice(0, 60) : null;
    const sort = ['newest', 'oldest', 'soonest', 'points'].includes(q.sort) ? q.sort : 'newest';
    const r = await sql`
      SELECT p.id, p.army, p.engagement, p.points, p.timezone, p.event_id, p.created_at, p.status AS stored_status,
        u.username,
        e.name AS event_name,
        COALESCE((SELECT json_agg(json_build_object('start', s.starts_at, 'end', s.ends_at) ORDER BY s.starts_at)
                  FROM gitfinda_slots s WHERE s.post_id = p.id), '[]'::json) AS slots,
        EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS has_future_slot,
        (SELECT COUNT(*) FROM gitfinda_matches m WHERE m.post_id = p.id)::int AS match_count,
        EXISTS (SELECT 1 FROM gitfinda_matches m WHERE m.post_id = p.id AND m.matcher_user_id = ${userId}) AS matched_by_me,
        (SELECT MIN(s.starts_at) FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS next_start,
        (p.event_id IS NULL OR EXISTS (
          SELECT 1 FROM events ev WHERE ev.id = p.event_id
            AND (ev.organiser_user_id = ${userId}
                 OR EXISTS (SELECT 1 FROM event_players ep WHERE ep.event_id = ev.id AND ep.user_id = ${userId} AND ep.status = 'approved')))) AS can_match,
        (p.user_id = ${userId}) AS mine
      FROM gitfinda_posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN events e ON e.id = p.event_id
      WHERE p.status = 'active'
        AND EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now())
        AND (${army}::text IS NULL OR p.army = ${army})
        AND (${engagement}::text IS NULL OR p.engagement = ${engagement})
        AND (${eventId}::int IS NULL OR p.event_id = ${eventId})
        AND (${text}::text IS NULL
             OR u.username ILIKE '%' || ${text} || '%'
             OR REPLACE(p.army, '_', ' ') ILIKE '%' || ${text} || '%'
             OR COALESCE(e.name, '') ILIKE '%' || ${text} || '%')
      ORDER BY
        CASE WHEN ${sort} = 'oldest' THEN p.created_at END ASC,
        CASE WHEN ${sort} = 'points' THEN p.points END DESC,
        CASE WHEN ${sort} = 'soonest' THEN (SELECT MIN(s.starts_at) FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) END ASC,
        p.created_at DESC
      LIMIT ${LIMITS.listMax}`;
    // Your own posts are listed too (flagged `mine`, the browser shows no Match button on them):
    // hiding them made a freshly created post look as if it had not been published.
    return { posts: rowsOf(r).map(row => shapePost(row, { matchedByMe: row.matched_by_me, mine: row.mine, canMatch: row.can_match })) };
  }

  async function myPosts(userId) {
    const r = await sql`
      SELECT p.id, p.army, p.engagement, p.points, p.timezone, p.event_id, p.created_at, p.status AS stored_status,
        u.username,
        e.name AS event_name,
        COALESCE((SELECT json_agg(json_build_object('start', s.starts_at, 'end', s.ends_at) ORDER BY s.starts_at)
                  FROM gitfinda_slots s WHERE s.post_id = p.id), '[]'::json) AS slots,
        EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS has_future_slot,
        (SELECT COUNT(*) FROM gitfinda_matches m WHERE m.post_id = p.id)::int AS match_count
      FROM gitfinda_posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN events e ON e.id = p.event_id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
      LIMIT 100`;
    return { posts: rowsOf(r).map(row => shapePost(row, { matchCount: row.match_count })) };
  }

  async function create(userId, body) {
    const v = validatePost(body);
    const open = await sql`
      SELECT COUNT(*)::int AS n FROM gitfinda_posts p
      WHERE p.user_id = ${userId} AND p.status = 'active'
        AND EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now())`;
    if (open.rows[0].n >= LIMITS.activePostsPerUser) {
      throw new Refusal(`You can have ${LIMITS.activePostsPerUser} active posts at most. Cancel one first.`, 400,
        'gfErrTooManyPosts', { max: LIMITS.activePostsPerUser });
    }
    if (v.eventId !== null) {
      const ev = await sql`SELECT 1 FROM events WHERE id = ${v.eventId} AND visibility = 'public'`;
      if (!ev.rows[0]) throw new Refusal('Unknown event.', 400, 'gfErrEvent');
    }
    const ins = await sql`
      INSERT INTO gitfinda_posts (user_id, army, engagement, points, timezone, event_id)
      VALUES (${userId}, ${v.army}, ${v.engagement}, ${v.points}, ${v.timezone}, ${v.eventId})
      RETURNING id`;
    const id = ins.rows[0].id;
    for (const s of v.slots) {
      await sql`INSERT INTO gitfinda_slots (post_id, starts_at, ends_at) VALUES (${id}, ${s.start}, ${s.end})`;
    }
    return { ok: true, id };
  }

  async function cancel(userId, body) {
    const id = Number(body?.id);
    if (!Number.isInteger(id)) throw new Refusal('Unknown post.', 404, 'gfErrNoPost');
    const r = await sql`
      UPDATE gitfinda_posts SET status = 'cancelled'
      WHERE id = ${id} AND user_id = ${userId} AND status = 'active'
      RETURNING id`;
    if (!r.rows[0]) throw new Refusal('Unknown post.', 404, 'gfErrNoPost');
    return { ok: true };
  }

  async function match(userId, body) {
    const id = Number(body?.id);
    if (!Number.isInteger(id)) throw new Refusal('Unknown post.', 404, 'gfErrNoPost');
    const p = await sql`
      SELECT p.id, p.user_id, p.status, p.event_id,
        EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS live
      FROM gitfinda_posts p WHERE p.id = ${id}`;
    const post = p.rows[0];
    if (!post || post.status !== 'active' || !post.live) throw new Refusal('This post is no longer open.', 404, 'gfErrClosed');
    if (post.user_id === userId) throw new Refusal('You cannot match your own post.', 400, 'gfErrOwnPost');
    // A game tied to an event or league is for the players of that event: free games are open to
    // everyone, these only to someone approved in it (or running it). Without this a player who was
    // never in the league could match a league game (reported by the author).
    if (post.event_id !== null && post.event_id !== undefined) {
      const acc = await sql`
        SELECT 1 FROM events ev WHERE ev.id = ${post.event_id}
          AND (ev.organiser_user_id = ${userId}
               OR EXISTS (SELECT 1 FROM event_players ep WHERE ep.event_id = ev.id AND ep.user_id = ${userId} AND ep.status = 'approved'))`;
      if (!acc.rows[0]) throw new Refusal('This game belongs to an event you have not joined.', 403, 'gfErrNotInEvent');
    }
    const ins = await sql`
      INSERT INTO gitfinda_matches (post_id, owner_user_id, matcher_user_id)
      VALUES (${id}, ${post.user_id}, ${userId})
      ON CONFLICT (post_id, matcher_user_id) DO NOTHING
      RETURNING id`;
    if (!ins.rows[0]) throw new Refusal('You already matched this post.', 409, 'gfErrAlreadyMatched');
    return { ok: true, matchId: ins.rows[0].id };
  }

  /**
   * The player who matched takes the match back (they clicked the wrong game). Only the matcher can:
   * the post's owner already has Cancel for the whole post, and a match is not theirs to delete. The
   * match goes with its messages (ON DELETE CASCADE), and the same player may match the post again
   * later, since the unique pair no longer exists.
   */
  async function unmatch(userId, body) {
    const matchId = Number(body?.matchId);
    if (!Number.isInteger(matchId)) throw new Refusal('Unknown match.', 404, 'gfErrNoMatch');
    const m = await participant(userId, matchId);
    if (m.matcher_user_id !== userId) throw new Refusal('Only the player who matched can withdraw it.', 403, 'gfErrNotMatcher');
    await sql`DELETE FROM gitfinda_matches WHERE id = ${matchId} AND matcher_user_id = ${userId}`;
    return { ok: true };
  }

  /** The caller's matches, newest activity first, with how many messages they have not read. */
  async function myMatches(userId) {
    const r = await sql`
      -- m and p both have id, created_at and status; a result row keeps ONE value per name (the real
      -- driver keeps the LAST), so the match's own are renamed. This was a live bug: the chat asked
      -- for the POST's id as if it were the match's ("Unknown match.").
      SELECT m.id AS match_id, m.created_at AS match_created_at, m.status AS match_status, m.owner_user_id, m.matcher_user_id,
        CASE WHEN m.owner_user_id = ${userId} THEN m.owner_read_at ELSE m.matcher_read_at END AS my_read_at,
        ou.username AS owner_name, mu.username AS matcher_name,
        p.id, p.army, p.engagement, p.points, p.timezone, p.event_id, p.created_at, p.status AS stored_status,
        u.username,
        e.name AS event_name,
        COALESCE((SELECT json_agg(json_build_object('start', s.starts_at, 'end', s.ends_at) ORDER BY s.starts_at)
                  FROM gitfinda_slots s WHERE s.post_id = p.id), '[]'::json) AS slots,
        EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS has_future_slot,
        (SELECT COUNT(*) FROM gitfinda_matches m WHERE m.post_id = p.id)::int AS match_count,
        (SELECT COUNT(*) FROM gitfinda_messages g WHERE g.match_id = m.id AND g.sender_user_id <> ${userId}
           AND g.created_at > COALESCE(CASE WHEN m.owner_user_id = ${userId} THEN m.owner_read_at ELSE m.matcher_read_at END, 'epoch'::timestamptz))::int AS unread,
        (SELECT g.body FROM gitfinda_messages g WHERE g.match_id = m.id ORDER BY g.id DESC LIMIT 1) AS last_body,
        COALESCE((SELECT MAX(g.created_at) FROM gitfinda_messages g WHERE g.match_id = m.id), m.created_at) AS last_activity
      FROM gitfinda_matches m
      JOIN gitfinda_posts p ON p.id = m.post_id
      JOIN users u ON u.id = p.user_id
      JOIN users ou ON ou.id = m.owner_user_id
      JOIN users mu ON mu.id = m.matcher_user_id
      LEFT JOIN events e ON e.id = p.event_id
      WHERE m.owner_user_id = ${userId} OR m.matcher_user_id = ${userId}
      ORDER BY last_activity DESC
      LIMIT 100`;
    return {
      matches: rowsOf(r).map(row => ({
        id: row.match_id, createdAt: row.match_created_at, status: row.match_status, unread: row.unread,
        lastMessage: row.last_body, lastActivity: row.last_activity,
        // The OTHER player. The post is always the owner's, so both sides see the same game details.
        opponent: row.owner_user_id === userId ? row.matcher_name : row.owner_name,
        iAmOwner: row.owner_user_id === userId,
        post: shapePost(row),
      })),
    };
  }

  async function participant(userId, matchId) {
    const r = await sql`
      SELECT m.id, m.owner_user_id, m.matcher_user_id, p.status AS post_status,
        EXISTS (SELECT 1 FROM gitfinda_slots s WHERE s.post_id = p.id AND s.ends_at > now()) AS post_live
      FROM gitfinda_matches m JOIN gitfinda_posts p ON p.id = m.post_id WHERE m.id = ${matchId}`;
    const m = r.rows[0];
    // Same answer for "no such match" and "not yours": do not confirm that a match exists.
    if (!m || (m.owner_user_id !== userId && m.matcher_user_id !== userId)) {
      throw new Refusal('Unknown match.', 404, 'gfErrNoMatch');
    }
    return m;
  }

  async function markRead(userId, m) {
    if (m.owner_user_id === userId) await sql`UPDATE gitfinda_matches SET owner_read_at = now() WHERE id = ${m.id}`;
    else await sql`UPDATE gitfinda_matches SET matcher_read_at = now() WHERE id = ${m.id}`;
  }

  /** Messages of one match, optionally only those after `after` (a message id) so polling is cheap. */
  async function messages(userId, q) {
    const matchId = Number(q.matchId);
    if (!Number.isInteger(matchId)) throw new Refusal('Unknown match.', 404, 'gfErrNoMatch');
    const m = await participant(userId, matchId);
    const after = Number.isInteger(Number(q.after)) ? Number(q.after) : 0;
    const r = await sql`
      SELECT g.id, g.sender_user_id, g.body, g.created_at, u.username
      FROM gitfinda_messages g JOIN users u ON u.id = g.sender_user_id
      WHERE g.match_id = ${matchId} AND g.id > ${after}
      ORDER BY g.id ASC LIMIT 200`;
    await markRead(userId, m);
    return { messages: rowsOf(r).map(x => ({ id: x.id, username: x.username, mine: x.sender_user_id === userId, body: x.body, createdAt: x.created_at })) };
  }

  async function send(userId, body) {
    const matchId = Number(body?.matchId);
    if (!Number.isInteger(matchId)) throw new Refusal('Unknown match.', 404, 'gfErrNoMatch');
    const m = await participant(userId, matchId);
    // The game was cancelled, or every time slot has passed: the chat is read-only from then on, so a
    // finished game does not keep looking alive (reported by the author: the chat of a cancelled game
    // was still active).
    if (m.post_status === 'cancelled' || !m.post_live) throw new Refusal('This game is closed.', 409, 'gfErrMatchCancelled');
    const text = typeof body?.body === 'string' ? body.body.trim() : '';
    if (!text) throw new Refusal('Write a message first.', 400, 'gfErrEmpty');
    if (text.length > LIMITS.messageMaxChars) {
      throw new Refusal(`A message can be ${LIMITS.messageMaxChars} characters at most.`, 400, 'gfErrLong', { max: LIMITS.messageMaxChars });
    }
    const recent = await sql`
      SELECT COUNT(*)::int AS n FROM gitfinda_messages
      WHERE sender_user_id = ${userId} AND created_at > now() - interval '1 minute'`;
    if (recent.rows[0].n >= LIMITS.messagesPerMinute) {
      throw new Refusal('Slow down a little.', 429, 'gfErrRate');
    }
    const ins = await sql`
      INSERT INTO gitfinda_messages (match_id, sender_user_id, body) VALUES (${matchId}, ${userId}, ${text})
      RETURNING id, created_at`;
    await markRead(userId, m);   // what you write, you have read
    return { ok: true, id: ins.rows[0].id, createdAt: ins.rows[0].created_at };
  }

  /** Total unread messages across every match — the badge on the Gitfinda button. */
  async function unread(userId) {
    const r = await sql`
      SELECT COUNT(*)::int AS n
      FROM gitfinda_messages g
      JOIN gitfinda_matches m ON m.id = g.match_id
      WHERE (m.owner_user_id = ${userId} OR m.matcher_user_id = ${userId})
        AND g.sender_user_id <> ${userId}
        AND g.created_at > COALESCE(CASE WHEN m.owner_user_id = ${userId} THEN m.owner_read_at ELSE m.matcher_read_at END, 'epoch'::timestamptz)`;
    // A match nobody has written in yet is also news for the owner: somebody matched their post.
    const fresh = await sql`
      SELECT COUNT(*)::int AS n FROM gitfinda_matches m
      WHERE m.owner_user_id = ${userId} AND m.owner_read_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM gitfinda_messages g WHERE g.match_id = m.id)`;
    return { unread: r.rows[0].n + fresh.rows[0].n };
  }

  return { events, list, myPosts, create, cancel, match, unmatch, myMatches, messages, send, unread };
}
