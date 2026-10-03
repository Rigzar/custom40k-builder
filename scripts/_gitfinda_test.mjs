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
import { gitfinda, gitfindaSchema, ARMIES, LIMITS, Refusal } from '../api/_lib/gitfinda.js';
import fs from 'node:fs';

const db = new PGlite();
// @vercel/postgres' `sql` as a tagged template, on top of PGlite.
const sql = async (strings, ...vals) => {
  const text = strings.reduce((a, s, i) => a + (i ? '$' + i : '') + s, '');
  const r = await db.query(text, vals);
  return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
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
                       is_league BOOLEAN NOT NULL DEFAULT false, ends_on DATE);
  INSERT INTO users (username) VALUES ('alice'), ('bob'), ('carol'), ('dave');
  INSERT INTO events (name, visibility) VALUES ('Online League #2', 'public'), ('Secret', 'private');
  INSERT INTO events (name, visibility, ends_on) VALUES ('Finished', 'public', '2020-01-01');
`);
await gitfindaSchema(sql);
await gitfindaSchema(sql);   // idempotent, like ensureSchema
const [A, B, C, D] = [1, 2, 3, 4];
const g = gitfinda(sql);

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
ok(!(await g.list(D, {})).posts.some(p => p.id === p1), 'a cancelled post leaves the public listing');
ok((await g.myPosts(A)).posts.find(p => p.id === p1).status === 'cancelled', 'My Posts keeps it, as Cancelled');
await refuses(() => g.match(D, { id: p1 }), 'gfErrClosed', 'a cancelled post cannot be matched');
ok((await g.myMatches(C)).matches.some(m => m.id === m1), 'matches made before the cancellation stay');
await refuses(() => g.cancel(A, { id: p1 }), 'gfErrNoPost', 'cancelling twice is refused');

await db.exec(`UPDATE gitfinda_slots SET starts_at = now() - interval '5 hours', ends_at = now() - interval '2 hours' WHERE post_id = ${p2}`);
ok(!(await g.list(D, {})).posts.some(p => p.id === p2), 'a post whose slots are all in the past leaves the listing');
ok((await g.myPosts(A)).posts.find(p => p.id === p2).status === 'expired', 'and shows as Expired in My Posts');
await refuses(() => g.match(D, { id: p2 }), 'gfErrClosed', 'an expired post cannot be matched');

// ── cascade ──
await db.exec(`DELETE FROM users WHERE id = ${A}`);
const left = (await db.query(`SELECT (SELECT COUNT(*) FROM gitfinda_posts WHERE user_id=1)::int AS posts, (SELECT COUNT(*) FROM gitfinda_matches WHERE owner_user_id=1)::int AS m`)).rows[0];
ok(left.posts === 0 && left.m === 0, 'deleting an account removes its posts and matches', JSON.stringify(left));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
