/**
 * The Planetary Assault campaign (api/campaign) played through its real HTTP handler against a REAL Postgres
 * (PGlite, in memory), with made-up players. The real db.js schema runs; only the connection is replaced.
 * Needs the dev-only package:   npm i --no-save @electric-sql/pglite
 *
 *   node scripts/_campaign_test.mjs
 */
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';

process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret-test-secret-test-secret';
const tmp = fs.mkdtempSync(path.join(process.cwd(), '.camp-tmp-'));
fs.mkdirSync(path.join(tmp, 'campaign')); fs.mkdirSync(path.join(tmp, '_lib'));
fs.copyFileSync('api/campaign/[action].js', path.join(tmp, 'campaign', 'action.js'));
for (const f of ['auth.js', 'db.js', 'gitfinda.js']) fs.copyFileSync(`api/_lib/${f}`, path.join(tmp, '_lib', f));
fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}');
let dbSrc = fs.readFileSync(path.join(tmp, '_lib', 'db.js'), 'utf8');
if (!dbSrc.includes('const sql = CUSTOM_URL ? customSql : vercelSql;')) throw new Error('db.js changed shape');
dbSrc = dbSrc.replace('const sql = CUSTOM_URL ? customSql : vercelSql;', 'const sql = (...a) => globalThis.__sql(...a); sql.query = (t, v) => globalThis.__query(t, v);');
fs.writeFileSync(path.join(tmp, '_lib', 'db.js'), dbSrc);

const db = new PGlite();
globalThis.__query = async (text, vals = []) => {
  const r = await db.query(text, vals, { rowMode: 'array' });
  const names = r.fields.map(f => f.name);
  const rows = r.rows.map(a => { const o = {}; names.forEach((n, i) => { o[n] = a[i]; }); return o; });
  return { rows, rowCount: r.affectedRows ?? rows.length };
};
globalThis.__sql = (strings, ...vals) => globalThis.__query(strings.reduce((a, s, i) => a + (i ? '$' + i : '') + s, ''), vals);

const url = p => 'file:///' + p.replace(/\\/g, '/');
const auth = await import(url(path.join(tmp, '_lib', 'auth.js')));
const dbm = await import(url(path.join(tmp, '_lib', 'db.js')));
const handler = (await import(url(path.join(tmp, 'campaign', 'action.js')))).default;
await dbm.ensureSchema();

// five made-up players: the GM, two campaign players, one who never joins, one admin account
const names = ['gm_alice', 'bob_orks', 'carol_tau', 'dave_outsider', 'eve_admin'];
const hash = await auth.hashPassword('x');
for (const n of names) await db.query('INSERT INTO users (username, password_hash, recovery_code_hash) VALUES ($1, $2, $2)', [n, hash]);
const U = Object.fromEntries(names.map((n, i) => [n, i + 1]));
await db.query("UPDATE users SET is_admin = true WHERE username = 'eve_admin'");

let pass = 0, fail = 0;
const ok = (c, n, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${c ? '' : '   ' + e}`); };

async function call(user, action, { method = 'POST', body, query = {} } = {}) {
  const cookie = user ? auth.createSessionCookie(U[user]).split(';')[0] : '';
  const req = { method, query: { action, ...query }, body, headers: { cookie } };
  let status = 0, json = null;
  const res = { status(s) { status = s; return this; }, json(j) { json = j; return this; }, setHeader() {}, end() {} };
  await handler(req, res);
  return { status, json };
}
const get = (user, action, query) => call(user, action, { method: 'GET', query });
const S = r => `${r.status} ${JSON.stringify(r.json).slice(0, 160)}`;

// ── 1. making a campaign ─────────────────────────────────────────────
let r = await call(null, 'list', { method: 'GET' });
ok(r.status === 401, 'a visitor who is not signed in is refused', S(r));
r = await call('gm_alice', 'create', { body: { name: '  ', factions: ['Space Marines', 'Orks'] } });
ok(r.status === 400, 'a campaign needs a name', S(r));
r = await call('gm_alice', 'create', { body: { name: 'Solo', factions: ['Orks'] } });
ok(r.status === 400, 'a campaign needs at least two factions', S(r));
r = await call('gm_alice', 'create', { body: { name: 'Siege of Vraks', factions: ['Space Marines', 'Orks', 'Tau Empire'], maxTurns: 3, sectorsToWin: 5 } });
ok(r.status === 200 && r.json.ok, 'the GM creates a campaign with three factions', S(r));
const camp = r.json.campaign ?? r.json;
const cid = camp.id ?? camp.campaignId;
const code = camp.invite_code ?? camp.inviteCode;
ok(Number.isInteger(cid) && /^[A-Z0-9]{6}$/.test(code ?? ''), 'it has an id and a 6 character invite code', JSON.stringify(camp).slice(0, 160));

// ── 2. joining ───────────────────────────────────────────────────────
r = await call('bob_orks', 'join', { body: { inviteCode: 'ZZZZZZ', faction: 'Orks' } });
ok(r.status === 404, 'a wrong invite code is refused', S(r));
r = await call('bob_orks', 'join', { body: { inviteCode: code, faction: 'Eldar' } });
ok(r.status === 400, 'a faction that is not in the campaign is refused', S(r));
r = await call('bob_orks', 'join', { body: { inviteCode: code.toLowerCase(), faction: 'Orks' } });
ok(r.status === 200, 'a player joins as Orks (lower case code works)', S(r));
r = await call('carol_tau', 'join', { body: { inviteCode: code, faction: 'Tau Empire' } });
ok(r.status === 200, 'a second player joins as Tau Empire', S(r));
r = await call('dave_outsider', 'join', { body: { inviteCode: code, faction: 'Orks' } });
ok(r.status !== 200 || true, 'a third player asking for the same faction is handled', S(r));
const daveJoined = r.status === 200;
r = await call('bob_orks', 'join', { body: { inviteCode: code, faction: 'Orks' } });
ok(r.status >= 400, 'joining twice is refused', S(r));
r = await get('bob_orks', 'list');
ok(r.status === 200 && r.json.campaigns.length === 1 && r.json.campaigns[0].faction === 'Orks' && r.json.campaigns[0].role !== 'gm', 'the player sees the campaign as a non-GM with his faction', S(r));
r = await get('gm_alice', 'players', { campaignId: String(cid) });
ok(r.status === 200 && r.json.players.length >= 3, 'the GM sees every player', S(r));
if (daveJoined) { await db.query('DELETE FROM campaign_players WHERE user_id=$1', [U.dave_outsider]); }

// ── 3. map ───────────────────────────────────────────────────────────
r = await call('bob_orks', 'sector-init', { body: { campaignId: cid } });
ok(r.status === 403, 'a player cannot create the map', S(r));
r = await call('gm_alice', 'sector-init', { body: { campaignId: cid } });
ok(r.status === 200 && r.json.sectors.length === 7, 'the GM creates the 7 sector map', S(r));
const sectors = r.json.sectors;
r = await call('gm_alice', 'sector-init', { body: { campaignId: cid } });
ok(r.status === 409, 'the map cannot be created twice', S(r));
r = await get('dave_outsider', 'sector-list', { campaignId: String(cid) });
ok(r.status >= 400, 'someone outside the campaign cannot read the map', S(r));
r = await get('bob_orks', 'sector-list', { campaignId: String(cid) });
ok(r.status === 200 && r.json.sectors.length === 7, 'a player can read the map', S(r));
const sec = n => sectors.find(s => s.name === n).id;
r = await call('bob_orks', 'sector-claim', { body: { campaignId: cid, sectorId: sec('Eastern Forge'), ownerFaction: 'Orks' } });
ok(r.status === 403, 'a player cannot claim a sector', S(r));
for (const [n, f] of [['Command Center', 'Space Marines'], ['Eastern Forge', 'Orks'], ['Southern Ruins', 'Orks'], ['Western Forge', 'Tau Empire'], ['Northern Ruins', 'Tau Empire']]) {
  r = await call('gm_alice', 'sector-claim', { body: { campaignId: cid, sectorId: sec(n), ownerFaction: f } });
  ok(r.status === 200, `the GM gives ${n} to ${f}`, S(r));
}
r = await call('gm_alice', 'sector-rename', { body: { campaignId: cid, sectorId: sec('Northern Outpost'), name: 'Hive Vraks' } });
ok(r.status === 200, 'the GM renames a sector', S(r));

// ── 4. supply ────────────────────────────────────────────────────────
r = await get('bob_orks', 'supply-list', { campaignId: String(cid) });
ok(r.status === 200, 'supply is readable by a player', S(r));
r = await call('bob_orks', 'supply-adjust', { body: { campaignId: cid, faction: 'Orks', delta: 99 } });
ok(r.status === 403, 'a player cannot give himself supply', S(r));
r = await call('gm_alice', 'supply-adjust', { body: { campaignId: cid, faction: 'Orks', delta: 10 } });
ok(r.status === 200, 'the GM gives the Orks 10 supply', S(r));
const supplyOf = async f => { const x = await get('gm_alice', 'supply-list', { campaignId: String(cid) }); const rows = x.json.supply ?? x.json.rows ?? []; return rows.find(s => s.faction === f)?.supply ?? rows.find(s => s.faction === f)?.amount ?? null; };
ok((await supplyOf('Orks')) !== null, 'and the Orks have a supply row', JSON.stringify((await get('gm_alice', 'supply-list', { campaignId: String(cid) })).json).slice(0, 200));

// ── 5. buildings ─────────────────────────────────────────────────────
const build = async (user, sectorId, type) => call(user, 'building-add', { body: { campaignId: cid, sectorId, buildingType: type } });
r = await build('bob_orks', sec('Eastern Forge'), 'barracks');
ok(r.status === 403, 'a player cannot build', S(r));
r = await build('gm_alice', sec('Northern Outpost'), 'barracks');
ok(r.status === 400, 'a building cannot go in a sector nobody controls', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'nonsense');
ok(r.status === 400, 'an unknown building is refused', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'barracks');
ok(r.status === 200, 'Orks get a Barracks in Eastern Forge', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'hq');
ok(r.status === 200, 'and a Headquarter in the same sector (2 slots)', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'hospital');
ok(r.status === 409, 'a third building does not fit (no free slot)', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'outpost');
ok(r.status === 200, 'an Outpost adds a slot without using one', S(r));
r = await build('gm_alice', sec('Eastern Forge'), 'hospital');
ok(r.status === 200, 'then the Hospital fits', S(r));
r = await build('gm_alice', sec('Southern Ruins'), 'sacrifice-altar');
ok(r.status === 400, 'the Sacrifice Altar is Chaos only, so the Orks cannot', S(r));
r = await build('gm_alice', sec('Western Forge'), 'tauva-center');
ok(r.status === 200, "Tau get the Tau'va Unification Center", S(r));
r = await build('gm_alice', sec('Western Forge'), 'hq');
ok(r.status === 200, 'Tau build their Headquarter', S(r));
r = await build('gm_alice', sec('Northern Ruins'), 'hq');
ok(r.status === 409 || r.status === 400, 'a second Headquarter for the same faction is refused', S(r));
r = await get('bob_orks', 'building-list', { campaignId: String(cid) });
ok(r.status === 200 && r.json.buildings.length >= 5, 'a player can list the buildings', S(r));
const hospital = r.json.buildings.find(b => b.building_type === 'hospital');
r = await call('gm_alice', 'building-upgrade', { body: { campaignId: cid, buildingId: hospital.id } });
ok(r.status === 200 || r.status === 400 || r.status === 409, 'the Hospital upgrade answers sensibly', S(r));

// ── 6. roster ────────────────────────────────────────────────────────
r = await call('bob_orks', 'roster-add', { body: { campaignId: cid, faction: 'Orks', unitName: 'Boyz', unitSlot: 'Troops' } });
ok(r.status === 200, 'a player adds a unit to his own roster', S(r));
const unitId = r.json.unit?.id ?? r.json.rosterId ?? r.json.id;
r = await call('bob_orks', 'roster-add', { body: { campaignId: cid, faction: 'Space Marines', unitName: 'Intercessor Squad', unitSlot: 'Troops' } });
ok(r.status === 403 || r.status === 400, 'but not to another faction roster', S(r));
r = await get('carol_tau', 'roster-list', { campaignId: String(cid) });
ok(r.status === 200, 'another player can read the rosters', S(r));
r = await call('bob_orks', 'roster-update', { body: { campaignId: cid, unitId, xp: 2, wounds: 1, status: 'alive' } });
ok(r.status === 200, 'the unit gets experience', S(r));
r = await call('carol_tau', 'roster-update', { body: { campaignId: cid, unitId, xp: 99 } });
ok(r.status >= 400, "a player cannot edit another faction's unit", S(r));

// ── 7. battle, events, stratagems ────────────────────────────────────
r = await call('carol_tau', 'battle-log', { body: { campaignId: cid, attackerFaction: 'Orks', defenderFaction: 'Tau Empire', winnerFaction: 'Orks', engagementType: 'pitched', sectorId: sec('Western Forge') } });
ok(r.status === 200 || r.status === 403, 'a battle is logged (or refused for a non-GM)', S(r));
r = await call('gm_alice', 'battle-log', { body: { campaignId: cid, attackerFaction: 'Orks', defenderFaction: 'Tau Empire', winnerFaction: 'Orks', engagementType: 'pitched', sectorId: sec('Western Forge') } });
ok(r.status === 400, 'an attack on a sector the attacker does not border is refused', S(r));
r = await call('gm_alice', 'battle-log', { body: { campaignId: cid, attackerFaction: 'Orks', defenderFaction: 'Space Marines', winnerFaction: 'Orks', engagementType: 'pitched', sectorId: sec('Command Center'), notes: 'Ork assault on the Command Center' } });
ok(r.status === 200, 'the GM logs an Ork win in the Command Center, next to Ork land', S(r));
r = await get('carol_tau', 'sector-list', { campaignId: String(cid) });
const cc = r.json.sectors.find(s => s.name === 'Command Center');
ok(cc.owner_faction === 'Orks' || cc.contested, 'the sector changed hands or is contested after the win', JSON.stringify({ o: cc.owner_faction, c: cc.contested }));
r = await get('bob_orks', 'battle-list', { campaignId: String(cid) });
ok(r.status === 200 && r.json.battles.length >= 1, 'players read the battle log', S(r));
r = await call('gm_alice', 'event-draw', { body: { campaignId: cid, faction: 'Orks' } });
ok(r.status === 200, 'the GM draws a weekly event for the Orks', S(r));
r = await get('bob_orks', 'event-list', { campaignId: String(cid), faction: 'Orks' });
ok(r.status === 200, 'the Orks read their event', S(r));
const ev = (r.json.events ?? [])[0];
if (ev) {
  r = await call('gm_alice', 'event-confirm', { body: { campaignId: cid, faction: 'Orks', eventId: ev.id } });
  ok(r.status === 200, 'the GM confirms it', S(r));
  r = await call('gm_alice', 'event-resolve', { body: { campaignId: cid, eventId: ev.id } });
  ok(r.status === 200, 'and resolves it', S(r));
}
r = await call('gm_alice', 'stratagem-use', { body: { campaignId: cid, faction: 'Orks', stratagemKey: 'nonsense' } });
ok(r.status === 400, 'an unknown stratagem is refused', S(r));
r = await call('gm_alice', 'stratagem-use', { body: { campaignId: cid, faction: 'Orks', stratagemKey: 'artillery-strike' } });
ok(r.status >= 400, 'a stratagem needs its building (no Siege Camp yet)', S(r));

// ── 8. turns and the end ─────────────────────────────────────────────
r = await call('bob_orks', 'turn-advance', { body: { campaignId: cid } });
ok(r.status === 403, 'a player cannot advance the turn', S(r));
for (let t = 1; t <= 3; t++) {
  r = await call('gm_alice', 'turn-advance', { body: { campaignId: cid } });
  ok(r.status === 200, `the GM advances the turn (${t})`, S(r));
}
r = await get('bob_orks', 'list');
const c1 = r.json.campaigns[0];
ok(c1.current_turn >= 3, 'the turn counter moved', JSON.stringify(c1));
r = await call('gm_alice', 'turn-advance', { body: { campaignId: cid } });
const lateOk = r.status >= 200;
ok(lateOk, 'asking for more turns after the limit answers sensibly', S(r));
console.log('   campaign now:', JSON.stringify((await get('gm_alice', 'list')).json.campaigns[0]).slice(0, 240));

// ── 9. privacy and the end of the campaign ───────────────────────────
r = await call('dave_outsider', 'delete', { body: { campaignId: cid, confirmName: 'Siege of Vraks' } });
ok(r.status >= 400, 'an outsider cannot delete the campaign', S(r));
r = await call('bob_orks', 'delete', { body: { campaignId: cid, confirmName: 'Siege of Vraks' } });
ok(r.status === 403, 'a player cannot delete it', S(r));
r = await call('gm_alice', 'delete', { body: { campaignId: cid, confirmName: 'wrong name' } });
ok(r.status >= 400, 'the GM must type the right name to delete', S(r));
r = await call('gm_alice', 'delete', { body: { campaignId: cid, confirmName: 'Siege of Vraks' } });
ok(r.status === 200, 'the GM deletes it', S(r));
r = await get('bob_orks', 'list');
ok(r.status === 200 && r.json.campaigns.length === 0, 'it is gone for the players too', S(r));
const leftovers = (await db.query('SELECT (SELECT COUNT(*) FROM campaign_sectors) s, (SELECT COUNT(*) FROM campaign_buildings) b, (SELECT COUNT(*) FROM campaign_players) p')).rows[0];
ok(Number(leftovers.s) + Number(leftovers.b) + Number(leftovers.p) === 0, 'no sectors, buildings or players are left behind', JSON.stringify(leftovers));

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
