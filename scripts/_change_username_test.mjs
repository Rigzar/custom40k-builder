/**
 * api/auth change-username against a REAL Postgres (PGlite, in memory). The real handler and the real auth helpers run; only
 * api/_lib/db.js is replaced by a PGlite-backed `sql`. Needs:  npm i --no-save @electric-sql/pglite
 *
 *   node scripts/_change_username_test.mjs
 */
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';

process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret-test-secret-test-secret';
// inside the project so node_modules (bcryptjs) resolves; removed at the end
const tmp = fs.mkdtempSync(path.join(process.cwd(), '.cu-tmp-'));
fs.mkdirSync(path.join(tmp, 'auth'), { recursive: true });
fs.mkdirSync(path.join(tmp, '_lib'), { recursive: true });
fs.copyFileSync('api/auth/[action].js', path.join(tmp, 'auth', 'action.js'));
fs.copyFileSync('api/_lib/auth.js', path.join(tmp, '_lib', 'auth.js'));
fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}');
fs.writeFileSync(path.join(tmp, '_lib', 'db.js'), `
  export const sql = (...a) => globalThis.__sql(...a);
  export async function ensureSchema() {}
  export function isDbUnavailable() { return false; }
`);
// the handler imports '../_lib/db.js' and '../_lib/auth.js': same relative layout as in api/

const db = new PGlite();
globalThis.__sql = async (strings, ...vals) => {
  const text = strings.reduce((a, s, i) => a + (i ? '$' + i : '') + s, '');
  const r = await db.query(text, vals, { rowMode: 'array' });
  const names = r.fields.map(f => f.name);
  const rows = r.rows.map(a => { const o = {}; names.forEach((n, i) => { o[n] = a[i]; }); return o; });
  return { rows, rowCount: r.affectedRows ?? rows.length };
};

const auth = await import(path.join(tmp, '_lib', 'auth.js').replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'));
const handler = (await import(path.join(tmp, 'auth', 'action.js').replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'))).default;

await db.exec(`
  CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL);
  CREATE TABLE rosters (id SERIAL PRIMARY KEY, source_username TEXT);
  CREATE TABLE recovery_requests (id SERIAL PRIMARY KEY, username TEXT NOT NULL);
`);
const hash = await auth.hashPassword('correct-horse');
await db.query(`INSERT INTO users (username, password_hash) VALUES ('Famouscron88x', $1), ('Alice', $1), ('bob_the_builder', $1)`, [hash]);
await db.query(`INSERT INTO rosters (source_username) VALUES ('Famouscron88x'), ('Alice')`);
await db.query(`INSERT INTO recovery_requests (username) VALUES ('Famouscron88x')`);

let pass = 0, fail = 0;
const ok = (c, n, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${c ? '' : '  ' + e}`); };

function call(userId, body, method = 'POST') {
  const cookie = userId ? auth.createSessionCookie(userId).split(';')[0] : '';
  const req = { method, query: { action: 'change-username' }, body, headers: { cookie } };
  let status = 0, json = null;
  const res = { status(s) { status = s; return this; }, json(j) { json = j; return this; }, setHeader() {}, end() {} };
  return handler(req, res).then(() => ({ status, json }));
}
const uname = async id => (await db.query('SELECT username FROM users WHERE id=$1', [id])).rows[0].username;

let r = await call(null, { newUsername: 'Famouscron88', currentPassword: 'correct-horse' });
ok(r.status === 401, 'not logged in is refused', JSON.stringify(r));
r = await call(1, { newUsername: 'Famouscron88', currentPassword: 'wrong' });
ok(r.status === 401 && (await uname(1)) === 'Famouscron88x', 'wrong password is refused and nothing changes', JSON.stringify(r));
r = await call(1, { newUsername: 'ab', currentPassword: 'correct-horse' });
ok(r.status === 400, 'a too short name is refused', JSON.stringify(r));
r = await call(1, { newUsername: 'has space', currentPassword: 'correct-horse' });
ok(r.status === 400, 'a name with a space is refused', JSON.stringify(r));
r = await call(1, { newUsername: 'alice', currentPassword: 'correct-horse' });
ok(r.status === 409 && r.json.key === 'usernameTaken', 'a name that exists with another capital letter is taken', JSON.stringify(r));
r = await call(1, { newUsername: 'Bob_The_Builder', currentPassword: 'correct-horse' });
ok(r.status === 409, 'ditto for another user', JSON.stringify(r));
r = await call(1, { newUsername: 'Famouscron88x', currentPassword: 'correct-horse' });
ok(r.status === 400 && r.json.key === 'usernameSame', 'the same name is refused', JSON.stringify(r));
r = await call(1, { newUsername: 'Famouscron88', currentPassword: 'correct-horse' });
ok(r.status === 200 && r.json.username === 'Famouscron88' && (await uname(1)) === 'Famouscron88', 'a free name is accepted', JSON.stringify(r));
const src2 = (await db.query(`SELECT source_username FROM rosters ORDER BY id`)).rows.map(x => x.source_username);
ok(JSON.stringify(src2) === JSON.stringify(['Famouscron88', 'Alice']), 'the copied-army label follows the rename', JSON.stringify(src2));
const rec = (await db.query(`SELECT username FROM recovery_requests`)).rows[0].username;
ok(rec === 'Famouscron88', 'an open recovery request follows the rename', rec);
r = await call(1, { newUsername: 'FAMOUSCRON88', currentPassword: 'correct-horse' });
ok(r.status === 200 && (await uname(1)) === 'FAMOUSCRON88', 'changing only the capitals of your own name is allowed', JSON.stringify(r));
r = await call(1, { newUsername: 'newname', currentPassword: 'correct-horse' }, 'GET');
ok(r.status === 405, 'GET is refused', JSON.stringify(r));

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
