/**
 * Runs api/_lib/gitfinda.js against a REAL Postgres (PGlite, in memory), so the SQL is exercised
 * instead of read. Needs the dev-only package:   npm i --no-save @electric-sql/pglite
 *
 *   node scripts/_gitfinda_test.mjs
 *
 * Covers each rule of the requirements document that the database is responsible for: filters,
 * derived Expired/Matched, no double match, privacy of chats, the unread counts, limits.
 */
import { PGlite } from '@electric-sql/pglite';
import { gitfinda, gitfindaSchema, discordNotifier, discordRemover, ARMIES, LIMITS, Refusal } from '../api/_lib/gitfinda.js';
import fs from 'node:fs';

const db = new PGlite();
// @vercel/postgres' `sql` as a tagged template, on top of PGlite.
const sql = async (strings, ...vals) => {
  const text = strings.reduce((a, s, i) => a + (i ? '$' + i : '') + s, '');
  // Rows become objects the way node-postgres builds them: when two columns share a name the LAST one
  // wins (PGlite's own objects keep the first, which hid a real bug: match id vs post id).
  const r = await db.query(text, vals, { rowMode: 'array' });
  const names = r.fields.map(f => f.name);
  const rows = r.rows.map(a => { const o = {}; names.forEach((n, i) => { o[n] = a[i]; }); return o; });
  return { rows, rowCount: r.affectedRows ?? rows.length };
};

let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`); };
const refuses = async (fn, key, name) => {
  try { await fn(); ok(false, name, 'did not refuse'); }
  catch (e) { ok(e instanceof Refusal && (key == null || e.key === key), name, `got ${e.key ?? e.message}`); }
};

// minimal stand-ins for the tables Gitfinda points at
await db.exec(`
  CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL);
  CREATE TABLE events (id SERIAL PRIMARY KEY, name TEXT NOT NULL, visibility TEXT NOT NULL DEFAULT 'public',
                       is_league BOOLEAN NOT NULL DEFAULT false, ends_on DATE, organiser_user_id INTEGER);
  CREATE TABLE event_players (id SERIAL PRIMARY KEY, event_id INTEGER NOT NULL, user_id INTEGER NOT NULL,
                              status TEXT NOT NULL DEFAULT 'pending', UNIQUE(event_id, user_id));
  INSERT INTO users (username) VALUES ('alice'), ('bob'), ('carol'), ('dave');
  INSERT INTO events (name, visibility) VALUES ('Online League #2', 'public'), ('Secret', 'private');
  INSERT INTO events (name, visibility, ends_on) VALUES ('Finished', 'public', '2020-01-01');
`);
await gitfindaSchema(sql);
await gitfindaSchema(sql);   // idempotent, like ensureSchema
const [A, B, C, D] = [1, 2, 3, 4];
const g = gitfinda(sql, { notify: async () => {}, sweepEveryMs: 0 });
// Posts and matches count from different numbers, so using one where the other belongs shows up.
await db.exec("SELECT setval('gitfinda_matches_id_seq', 500); SELECT setval('gitfinda_messages_id_seq', 9000)");

const inH = h => new Date(Date.now() + h * 3600000);
const slot = (fromH, hours = 3) => ({ start: inH(fromH).toISOString(), end: inH(fromH + hours).toISOString() });
const post = (over = {}) => ({ army: 'orks', engagement: 'pitched', points: 2000, timezone: 'Europe/Berlin', slots: [slot(24)], ...over });

// ── schema agrees with the app ──
const loaders = fs.readFileSync(new URL('../src/data/loaders.ts', import.meta.url), 'utf8');
const missing = ARMIES.filter(a => !new RegExp(`['"]?${a}['"]?\\s*:`).test(loaders));
ok(missing.length === 0, 'every army slug exists in the app loaders', missing.join(','));

// the browser's list of armies is a copy of the server's: they must not drift apart
const modal = fs.readFileSync(new URL('../src/components/GitfindaModal.tsx', import.meta.url), 'utf8');
const clientArmies = [...modal.match(/GITFINDA_ARMIES = \[([\s\S]*?)\];/)[1].matchAll(/'([a-z_]+)'/g)].map(m => m[1]);
ok(JSON.stringify(clientArmies) === JSON.stringify(ARMIES), 'client and server army lists are identical', clientArmies.join());
const imgs = [...modal.matchAll(/icon\('([a-z_]+)'/g)].map(m => m[1]);
const GLYPHS = [...modal.match(/const GLYPH[^{]*\{([\s\S]*?)\};/)[1].matchAll(/^\s+([a-z_]+):/gm)].map(m => m[1]);
const missingIcons = [...new Set(imgs)].filter(n => !GLYPHS.includes(n) && !fs.existsSync(new URL(`../public/gitfinda/${n}.png`, import.meta.url)));
ok(missingIcons.length === 0, 'every icon the modal uses exists (drawn or as a file)', missingIcons.join());

// ── validation ──
await refuses(() => g.create(A, post({ army: 'nope' })), 'gfErrArmy', 'unknown army refused');
await refuses(() => g.create(A, post({ engagement: 'matched' })), 'gfErrEngagement', '"Matched Play" is not an engagement type');
await refuses(() => g.create(A, post({ points: 5 })), 'gfErrPoints', 'points too low refused');
await refuses(() => g.create(A, post({ points: 'abc' })), 'gfErrPoints', 'points not a number refused');
await refuses(() => g.create(A, post({ timezone: 'UTC+2' })), 'gfErrTimezone', 'a bare UTC offset is refused');
await refuses(() => g.create(A, post({ slots: [] })), 'gfErrNoSlot', 'no time slot refused');
await refuses(() => g.create(A, post({ slots: [{ start: inH(30).toISOString(), end: inH(28).toISOString() }] })), 'gfErrSlotOrder', 'end before start refused');
await refuses(() => g.create(A, post({ slots: [slot(-10, 2)] })), 'gfErrSlotPast', 'only past slots refused');
await refuses(() => g.create(A, post({ slots: [slot(24, 30)] })), 'gfErrSlotLong', 'a 30 hour slot refused');
await refuses(() => g.create(A, post({ slots: [slot(24 * 200)] })), 'gfErrSlotFar', 'a slot 200 days away refused');
await refuses(() => g.create(A, post({ slots: [{ start: 'x', end: 'y' }] })), 'gfErrSlotInvalid', 'garbage date refused');
await refuses(() => g.create(A, post({ eventId: 2 })), 'gfErrEvent', 'a private event cannot be attached');
await refuses(() => g.create(A, post({ eventId: 999 })), 'gfErrEvent', 'an unknown event refused');

// ── create + browse ──
const p1 = (await g.create(A, post({ eventId: 1, slots: [slot(24), slot(48)] }))).id;
const p2 = (await g.create(A, post({ army: 'tyranids', engagement: 'epic', points: 3000, slots: [slot(5)] }))).id;
const p3 = (await g.create(B, post({ army: 'space_marines', engagement: 'skirmish', points: 1000, slots: [slot(72)] }))).id;
ok(p1 > 0 && p2 > p1, 'posts get unique ids');
let l = (await g.list(C, {})).posts;
ok(l.length === 3, 'browse lists every active post of other players', l.length);
ok(l[0].id === p3 && l[2].id === p1, 'newest first by default', l.map(p => p.id).join());
ok(l.every(p => p.status === 'active'), 'fresh posts are active');
ok(!JSON.stringify(l).match(/password|email|user_id|userId/i), 'nothing private in the listing');
ok(l.find(p => p.id === p1).slots.length === 2 && l.find(p => p.id === p1).eventName === 'Online League #2', 'slots and event name come with the post');
const ownList = (await g.list(A, {})).posts;
ok(ownList.length === 3 && ownList.filter(p => p.mine).length === 2 && ownList.find(p => p.id === p3).mine === false, 'a player sees their own posts in Browse, flagged mine, next to everybody else\'s');
ok(!(await g.list(C, {})).posts.some(p => p.mine), 'nobody else\'s post is flagged mine');
ok((await g.list(C, { army: 'orks' })).posts.length === 1, 'army filter');
ok((await g.list(C, { engagement: 'epic' })).posts.map(p => p.id).join() === String(p2), 'engagement filter');
ok((await g.list(C, { eventId: 1 })).posts.map(p => p.id).join() === String(p1), 'event filter');
// points range: either end may be open
const idsAt = async q => (await g.list(C, q)).posts.map(p => p.id);
ok((await idsAt({ minPoints: 2000 })).includes(p1), 'min points keeps a post at exactly that size');
ok(!(await idsAt({ minPoints: 2001 })).includes(p1), 'min points drops a smaller post');
ok(!(await idsAt({ maxPoints: 1999 })).includes(p1), 'max points drops a bigger post');
ok((await idsAt({ minPoints: 1500, maxPoints: 2500 })).includes(p1), 'a range keeps a post inside it');
ok((await idsAt({ minPoints: 'abc', maxPoints: '' })).includes(p1), 'a value that is not a number is ignored');
ok((await g.list(C, { q: 'bob' })).posts.map(p => p.id).join() === String(p3), 'search by username');
ok((await g.list(C, { q: 'space marines' })).posts.length === 1, 'search by army name');
ok((await g.list(C, { q: 'league' })).posts.length === 1, 'search by event name');
ok((await g.list(C, { sort: 'oldest' })).posts[0].id === p1, 'sort oldest first');
ok((await g.list(C, { sort: 'points' })).posts[0].points === 3000, 'sort by points');
ok((await g.list(C, { sort: 'soonest' })).posts[0].id === p2, 'sort by soonest availability');
ok((await g.list(C, { q: "'; DROP TABLE users; --" })).posts.length === 0, 'search text is a parameter, not SQL');
const ev = (await g.events()).events;
ok(ev.length === 1 && ev[0].name === 'Online League #2', 'only public events that have not ended are offered', JSON.stringify(ev));

// ── limit on active posts ──
for (let i = 0; i < LIMITS.activePostsPerUser - 2; i++) await g.create(D, post());
await g.create(D, post());
await g.create(D, post());
await refuses(() => g.create(D, post()), 'gfErrTooManyPosts', `a ${LIMITS.activePostsPerUser + 1}th active post refused`);

// ── match ──
await refuses(() => g.match(A, { id: p1 }), 'gfErrOwnPost', 'cannot match your own post');
// ── a game tied to an event is for that event's players ──
// B and C are approved in event 1, D is not in it at all, and a pending registration does not count.
await db.exec("INSERT INTO event_players (event_id, user_id, status) VALUES (1, 2, 'approved'), (1, 3, 'approved')");
await refuses(() => g.match(D, { id: p1 }), 'gfErrNotInEvent', 'a player who is not in the league cannot match a league game');
await db.exec("INSERT INTO event_players (event_id, user_id, status) VALUES (1, 4, 'pending')");
await refuses(() => g.match(D, { id: p1 }), 'gfErrNotInEvent', 'a pending registration does not give access');
ok((await g.list(D, {})).posts.find(p => p.id === p1).canMatch === false, 'the listing says a non-member cannot match it');
ok((await g.list(D, {})).posts.find(p => p.id === p2).canMatch === true, 'a free game can be matched by anyone');
ok((await g.list(C, {})).posts.find(p => p.id === p1).canMatch === true, 'an approved player can match the league game');
await refuses(() => g.match(C, { id: 99999 }), 'gfErrClosed', 'cannot match a post that does not exist');
const m1 = (await g.match(C, { id: p1 })).matchId;
await refuses(() => g.match(C, { id: p1 }), 'gfErrAlreadyMatched', 'the same player cannot match the same post twice');
const m2 = (await g.match(B, { id: p1 })).matchId;
ok(m2 !== m1, 'a second player CAN match the same post (the post stays open)');
ok((await g.list(C, {})).posts.find(p => p.id === p1).matchedByMe === true, 'the matcher sees they matched');
ok((await g.myPosts(A)).posts.find(p => p.id === p1).status === 'matched', 'My Posts shows Matched');
ok((await g.myPosts(A)).posts.find(p => p.id === p1).matchCount === 2, 'My Posts counts the matches');
ok((await g.list(D, {})).posts.some(p => p.id === p1), 'a matched post stays in the public listing');

// ── My Matches + chat privacy ──
let mm = (await g.myMatches(A)).matches;
ok(mm.length === 2 && mm.every(m => m.iAmOwner), 'the owner sees both matches');
ok(new Set(mm.map(m => m.opponent)).size === 2 && mm.some(m => m.opponent === 'carol'), 'the owner sees who matched');
mm = (await g.myMatches(C)).matches;
ok(mm.length === 1 && mm[0].opponent === 'alice' && !mm[0].iAmOwner, 'the matcher sees the owner as the opponent');
ok(mm[0].id === m1 && mm[0].post.id === p1 && mm[0].id !== mm[0].post.id, "a match carries ITS OWN id, not its post's", JSON.stringify([mm[0].id, mm[0].post.id, m1, p1]));
ok(mm[0].createdAt && new Date(mm[0].createdAt) >= new Date(mm[0].post.createdAt), "a match carries its own creation time, not its post's");
ok(mm[0].post.army === 'orks' && mm[0].post.points === 2000, 'both sides see the same game details');
ok((await g.myMatches(D)).matches.length === 0, 'a third player sees nothing');
ok((await g.unread(A)).unread === 2, 'the owner is told about two fresh matches', JSON.stringify(await g.unread(A)));
ok((await g.unread(C)).unread === 0, 'the matcher has nothing unread yet');

await refuses(() => g.send(D, { matchId: m1, body: 'hi' }), 'gfErrNoMatch', 'an outsider cannot write in a chat');
await refuses(() => g.messages(D, { matchId: m1 }), 'gfErrNoMatch', 'an outsider cannot read a chat');
await refuses(() => g.messages(B, { matchId: m1 }), 'gfErrNoMatch', 'another match\'s player cannot read this chat');
await refuses(() => g.send(C, { matchId: m1, body: '   ' }), 'gfErrEmpty', 'an empty message refused');
await refuses(() => g.send(C, { matchId: m1, body: 'x'.repeat(LIMITS.messageMaxChars + 1) }), 'gfErrLong', 'an over-long message refused');

await g.send(C, { matchId: m1, body: '  Hello <b>there</b>  ' });
await g.send(C, { matchId: m1, body: 'Friday works?' });
ok((await g.unread(A)).unread === 3, 'owner unread: two messages + the other fresh match', JSON.stringify(await g.unread(A)));
let msgs = (await g.messages(A, { matchId: m1 })).messages;
ok(msgs.length === 2 && msgs[0].body === 'Hello <b>there</b>' && msgs[0].username === 'carol' && msgs[0].mine === false, 'messages come back trimmed, with sender and mine=false');
ok((await g.unread(A)).unread === 1, 'reading a chat clears its unread', JSON.stringify(await g.unread(A)));
await g.send(A, { matchId: m1, body: 'Yes, 19:00.' });
msgs = (await g.messages(C, { matchId: m1 })).messages;
ok(msgs.length === 3 && msgs[2].mine === false && msgs[0].mine === true, 'the other side sees them with mine flipped');
const after = msgs[1].id;
ok((await g.messages(C, { matchId: m1, after })).messages.length === 1, 'polling with after= returns only the new ones');
mm = (await g.myMatches(A)).matches.find(m => m.id === m1);
ok(mm.lastMessage === 'Yes, 19:00.' && mm.unread === 0, 'My Matches shows the last message');
ok((await g.myMatches(A)).matches[0].id === m1, 'the match with the latest activity comes first');
for (let i = 0; i < LIMITS.messagesPerMinute; i++) { try { await g.send(C, { matchId: m1, body: 'spam ' + i }); } catch { break; } }
await refuses(() => g.send(C, { matchId: m1, body: 'one more' }), 'gfErrRate', 'a flood of messages is rate limited');

// ── cancel, expire ──
await refuses(() => g.cancel(B, { id: p1 }), 'gfErrNoPost', 'nobody cancels another player\'s post');
await g.cancel(A, { id: p1 });
await refuses(() => g.send(C, { matchId: m1, body: 'still there?' }), 'gfErrMatchCancelled', 'the chat of a cancelled game is closed');
ok((await g.myMatches(C)).matches.find(m => m.id === m1).post.status === 'cancelled', 'and the match carries the cancelled status');
ok(!(await g.list(D, {})).posts.some(p => p.id === p1), 'a cancelled post leaves the public listing');
ok((await g.myPosts(A)).posts.find(p => p.id === p1).status === 'cancelled', 'My Posts keeps it, as Cancelled');
await refuses(() => g.match(D, { id: p1 }), 'gfErrClosed', 'a cancelled post cannot be matched');
ok((await g.myMatches(C)).matches.some(m => m.id === m1), 'matches made before the cancellation stay');
await refuses(() => g.cancel(A, { id: p1 }), 'gfErrNoPost', 'cancelling twice is refused');

await db.exec(`UPDATE gitfinda_slots SET starts_at = now() - interval '5 hours', ends_at = now() - interval '2 hours' WHERE post_id = ${p2}`);
ok(!(await g.list(D, {})).posts.some(p => p.id === p2), 'a post whose slots are all in the past leaves the listing');
ok((await g.myPosts(A)).posts.find(p => p.id === p2).status === 'expired', 'and shows as Expired in My Posts');
await refuses(() => g.match(D, { id: p2 }), 'gfErrClosed', 'an expired post cannot be matched');
await refuses(() => g.send(B, { matchId: m2, body: 'late' }), 'gfErrMatchCancelled', 'the chat of a game whose time has passed is closed too');

// ── withdrawing a match ──
const pU = (await g.create(B, post({ slots: [slot(30)] }))).id;
const mU = (await g.match(C, { id: pU })).matchId;
await g.send(B, { matchId: mU, body: 'hello' });
await refuses(() => g.unmatch(B, { matchId: mU }), 'gfErrNotMatcher', "the post owner cannot withdraw someone else's match");
await refuses(() => g.unmatch(D, { matchId: mU }), 'gfErrNoMatch', 'a stranger cannot touch the match');
await g.unmatch(C, { matchId: mU });
ok(!(await g.myMatches(C)).matches.some(m => m.id === mU) && !(await g.myMatches(B)).matches.some(m => m.id === mU), 'withdrawing removes the match for both players');
ok((await db.query('SELECT COUNT(*)::int AS n FROM gitfinda_messages WHERE match_id = ' + mU)).rows[0].n === 0, 'and its messages');
ok((await g.list(D, {})).posts.some(p => p.id === pU), 'the post stays open');
const mU2 = (await g.match(C, { id: pU })).matchId;
ok(mU2 > 0, 'the same player can match it again after withdrawing');

// ── Discord announcement ──
{
  const sent = [];
  const gn = gitfinda(sql, { notify: async p => { sent.push(p); } });
  const idN = (await gn.create(B, post({ points: 1750, slots: [slot(30)] }))).id;
  ok(idN > 0 && sent.length === 1 && sent[0].points === 1750 && sent[0].army === 'orks' && sent[0].slots.length === 1 && typeof sent[0].username === 'string',
    'creating a post hands one announcement to the notifier', JSON.stringify(sent));
  const gb = gitfinda(sql, { notify: async () => { throw new Error('Discord is down'); } });
  const idB = (await gb.create(B, post({ slots: [slot(31)] }))).id;
  ok(idB > 0, 'a failing notifier never stops a post from being created');
  const none = await discordNotifier(undefined)({ username: 'x', army: 'orks', engagement: 'pitched', points: 1, slots: [slot(1)] });
  ok(none === null, 'without a webhook URL nothing is sent');
  const bad = await discordNotifier('https://evil.example/api/webhooks/1/abc', async () => { throw new Error('must not be called'); })({ username: 'x', army: 'orks', engagement: 'pitched', points: 1, slots: [slot(1)] });
  ok(bad === null, 'a URL that is not a Discord webhook is ignored');
  let captured;
  const fake = async (u, o) => { captured = { u, body: JSON.parse(o.body) }; return { ok: true, json: async () => ({ id: '555' }) }; };
  const sentOk = await discordNotifier('https://discord.com/api/webhooks/123/abc-DEF_1', fake)({ id: 42, username: '@everyone **Bob**', army: 'space_marines', engagement: 'epic', points: 3000, eventName: 'Autumn Cup', slots: [slot(5), slot(29)] });
  ok(sentOk === '555' && captured.u.endsWith('/abc-DEF_1?wait=true'), 'a real webhook gets one POST and its message id comes back', captured.u);
  ok(captured.body.allowed_mentions.parse.length === 0, 'the message can never ping anyone (allowed_mentions.parse is empty)');
  ok(captured.body.embeds[0].url.endsWith('/?gitfinda=42'), 'the link opens the app on that very game', captured.body.embeds[0].url);
  const desc = captured.body.embeds[0].description;
  ok(!desc.includes('@everyone') && !desc.includes('**Bob**') && desc.includes('space marines') && desc.includes('Autumn Cup') && (desc.match(/<t:\d+:f>/g) ?? []).length === 2,
    'player text is stripped of mentions and markdown; the times are Discord timestamps', desc);
}

// ── Discord announcements are deleted when the game stops being open ──
{
  const removed = [];
  let serial = 100;
  const gd = gitfinda(sql, {
    sweepEveryMs: 0,
    notify: async () => String(++serial),
    remove: async id => { removed.push(id); return true; },
  });
  const E = (await db.query("INSERT INTO users (username) VALUES ('erin') RETURNING id")).rows[0].id;   // a fresh player: B is at the 5-post cap by now
  const midOf = async id => (await db.query('SELECT discord_message_id AS m FROM gitfinda_posts WHERE id = ' + id)).rows[0].m;
  const pc = (await gd.create(E, post({ slots: [slot(40)] }))).id;
  ok((await midOf(pc)) !== null, 'the message id is stored with the game');
  await gd.cancel(E, { id: pc });
  ok(removed.includes('101') && (await midOf(pc)) === null, 'cancelling a game deletes its announcement');
  const pm = (await gd.create(E, post({ slots: [slot(41)] }))).id;
  await gd.match(C, { id: pm });
  ok(removed.includes('102') && (await midOf(pm)) === null, 'a match deletes the announcement');
  const pe = (await gd.create(E, post({ slots: [slot(42)] }))).id;
  await db.exec('UPDATE gitfinda_slots SET starts_at = now() - interval \'5 hours\', ends_at = now() - interval \'2 hours\' WHERE post_id = ' + pe);
  ok((await midOf(pe)) !== null, 'an over game still has its id until somebody opens the board');
  await gd.unread(D);
  ok(removed.includes('103') && (await midOf(pe)) === null, 'the unread poll the app runs every 30 s sweeps the announcement of a game that is over');
  const po = (await gd.create(E, post({ slots: [slot(43)] }))).id;
  const before = removed.length;
  await gd.list(D, {});
  ok(removed.length === before && (await midOf(po)) !== null, 'an open game keeps its announcement');
  const flaky = gitfinda(sql, { sweepEveryMs: 0, notify: async () => '900', remove: async () => { throw new Error('Discord is down'); } });
  const pf = (await flaky.create(E, post({ slots: [slot(44)] }))).id;
  await flaky.cancel(E, { id: pf });
  ok((await midOf(pf)) === '900', 'when Discord cannot delete, the id is kept for the next sweep');
  await gd.list(D, {});
  ok(removed.includes('900') && (await midOf(pf)) === null, 'and the next sweep retries it');
  // the sweep is throttled per server instance, and posting / My posts also run it
  const pe2 = (await gd.create(E, post({ slots: [slot(45)] }))).id;
  await db.exec('UPDATE gitfinda_slots SET starts_at = now() - interval \'5 hours\', ends_at = now() - interval \'2 hours\' WHERE post_id = ' + pe2);
  await gd.myPosts(E);
  ok((await midOf(pe2)) === null, 'opening My posts sweeps too');
  const slow = gitfinda(sql, { sweepEveryMs: 3600000, notify: async () => '901', remove: async id => { removed.push(id); return true; } });
  const pe3 = (await slow.create(E, post({ slots: [slot(46)] }))).id;
  await db.exec('UPDATE gitfinda_slots SET starts_at = now() - interval \'5 hours\', ends_at = now() - interval \'2 hours\' WHERE post_id = ' + pe3);
  await slow.unread(D);   // the first call after a long-ago sweep runs it; the second within the hour must not
  const afterFirst = removed.length;
  const pe4 = (await slow.create(E, post({ slots: [slot(47)] }))).id;
  await db.exec('UPDATE gitfinda_slots SET starts_at = now() - interval \'5 hours\', ends_at = now() - interval \'2 hours\' WHERE post_id = ' + pe4);
  await slow.unread(D);
  ok(removed.length === afterFirst && (await midOf(pe4)) !== null, 'a second sweep inside the interval does nothing');
  // the remover itself
  let call;
  const fakeDel = async (u, o) => { call = { u, method: o.method }; return { ok: false, status: 404 }; };
  const rm = discordRemover('https://discord.com/api/webhooks/123/abc-DEF_1', fakeDel);
  ok((await rm('777')) === true && call.method === 'DELETE' && call.u.endsWith('/abc-DEF_1/messages/777'), 'the remover sends a DELETE for that message; a 404 counts as gone', JSON.stringify(call));
  ok((await rm('../../x')) === false, 'a message id that is not digits never reaches the URL');
  ok((await discordRemover(undefined)('777')) === false, 'without a webhook URL nothing is deleted');
}

// ── cascade ──
await db.exec(`DELETE FROM users WHERE id = ${A}`);
const left = (await db.query(`SELECT (SELECT COUNT(*) FROM gitfinda_posts WHERE user_id=1)::int AS posts, (SELECT COUNT(*) FROM gitfinda_matches WHERE owner_user_id=1)::int AS m`)).rows[0];
ok(left.posts === 0 && left.m === 0, 'deleting an account removes its posts and matches', JSON.stringify(left));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
