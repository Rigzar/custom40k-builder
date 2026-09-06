/**
 * Headless test for tts/Custom40k.lua.
 *
 * There is no Lua in this repo and TTS cannot be scripted from CI, so the mod runs here inside
 * `fengari` (a Lua VM in JavaScript) with harness.lua standing in for TTS's globals. It is fed a
 * REAL export produced by src/utils/ttsExport.ts, then the rendered card text is asserted on.
 *
 * This is not decoration: its first run caught four bugs, including `ipairs` stopping at a nil hole
 * and silently deleting every prayer's range/target/duration line.
 *
 *   node tts/test/run.cjs <export.json> [--dump]
 *
 * Produce an export.json with:
 *   npx jiti tts/test/makeExport.ts "Codex/<some saved army>.json" /tmp/army.json
 */
const fs = require('fs');
const path = require('path');
const { lua, lauxlib, lualib, to_luastring, to_jsstring } = require('fengari');

const exportPath = process.argv[2];
const dump = process.argv.includes('--dump');
if (!exportPath) {
  console.error('usage: node tts/test/run.cjs <export.json> [--dump]');
  process.exit(2);
}

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);

function dofile(file) {
  if (lauxlib.luaL_dostring(L, to_luastring(fs.readFileSync(file, 'utf-8'))) !== lua.LUA_OK) {
    throw new Error(`${file}: ${to_jsstring(lua.lua_tostring(L, -1))}`);
  }
}
dofile(path.join(__dirname, 'harness.lua'));
dofile(path.join(__dirname, '..', 'Custom40k.lua'));

/** Push a JS value onto the Lua stack as the equivalent Lua value. */
function push(v) {
  if (v === null || v === undefined) { lua.lua_pushnil(L); return; }
  if (typeof v === 'string') { lua.lua_pushstring(L, to_luastring(v)); return; }
  if (typeof v === 'number') { lua.lua_pushnumber(L, v); return; }
  if (typeof v === 'boolean') { lua.lua_pushboolean(L, v); return; }
  lua.lua_newtable(L);
  if (Array.isArray(v)) {
    v.forEach((el, i) => { push(el); lua.lua_seti(L, -2, i + 1); });
  } else {
    for (const [k, val] of Object.entries(v)) {
      lua.lua_pushstring(L, to_luastring(k)); push(val); lua.lua_settable(L, -3);
    }
  }
}

/** Read a Lua value back into JS. Arrays are detected by a non-zero raw length. */
function read(idx) {
  const t = lua.lua_type(L, idx);
  if (t === lua.LUA_TSTRING) return to_jsstring(lua.lua_tostring(L, idx));
  if (t === lua.LUA_TNUMBER) return lua.lua_tonumber(L, idx);
  if (t === lua.LUA_TBOOLEAN) return lua.lua_toboolean(L, idx);
  if (t !== lua.LUA_TTABLE) return null;
  if (lua.lua_rawlen(L, idx) > 0) {
    const out = [];
    for (let i = 1; i <= lua.lua_rawlen(L, idx); i++) {
      lua.lua_geti(L, idx, i); out.push(read(lua.lua_gettop(L))); lua.lua_pop(L, 1);
    }
    return out;
  }
  const out = {};
  lua.lua_pushnil(L);
  while (lua.lua_next(L, idx < 0 ? idx - 1 : idx) !== 0) {
    out[to_jsstring(lua.lua_tostring(L, -2))] = read(lua.lua_gettop(L));
    lua.lua_pop(L, 1);
  }
  return out;
}

const payload = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
lua.lua_getglobal(L, to_luastring('HARNESS_RUN'));
push(payload);
if (lua.lua_pcall(L, 1, 2, 0) !== lua.LUA_OK) {
  console.error('LUA ERROR:', to_jsstring(lua.lua_tostring(L, -1)));
  process.exit(1);
}
const tabs = read(lua.lua_gettop(L));
const cards = read(lua.lua_gettop(L) - 1);

if (dump) {
  for (const c of cards) console.log('='.repeat(90) + `\nCARD: ${c.name}\n${c.desc}`);
  for (const t of tabs) console.log('='.repeat(90) + `\nTAB: ${t.title}\n${t.body.slice(0, 400)}`);
}

// ── assertions ──────────────────────────────────────────────────────────────────────────────────
const fails = [];
const check = (cond, msg) => { if (!cond) fails.push(msg); };

check(cards.length === payload.units.length + 1,
  `expected ${payload.units.length + 1} cards (army summary + units), got ${cards.length}`);

const unitCards = cards.filter(c => /^\d+\. /.test(c.name));
check(unitCards.length === payload.units.length, 'every unit should get a numbered card');

for (const c of cards) {
  check(c.tags.includes('c40k_spawn'), `card "${c.name}" is untagged — CLEAR ARMY would miss it`);
  check(!/\d\.0\b/.test(c.desc), `card "${c.name}" prints a float ("150.0") instead of an integer`);
}

// The regression that motivated this harness: a unit with no Mark used to lose its points, and a
// prayer used to lose its whole meta line, both to `ipairs` stopping at a nil hole.
for (const c of unitCards) {
  check(/\d+ pts/.test(c.desc), `card "${c.name}" lost its points line`);
}
const withPowers = payload.units.find(u => (u.prayers || []).length || (u.pacts || []).length
  || (u.powers || []).length);
if (withPowers) {
  const card = unitCards.find(c => c.name.includes(withPowers.displayName || withPowers.unitName));
  const sample = [...(withPowers.prayers || []), ...(withPowers.pacts || []),
    ...(withPowers.powers || [])].find(p => p.range || p.target || p.duration || p.type);
  if (card && sample) {
    const meta = [sample.type, sample.range, sample.target, sample.duration].filter(Boolean);
    for (const m of meta) {
      check(card.desc.includes(m), `"${sample.name}" lost its meta on "${card.name}": missing "${m}"`);
    }
  }
}

// Reference tabs: one per non-empty pool, written into the notebook rather than onto cards.
const ref = payload.reference || {};
const expectTabs = (ref.prayers?.length ? 1 : 0) + (ref.pacts?.length ? 1 : 0)
  + Object.values(ref.disciplines || {}).filter(d => d.length).length;
check(tabs.length === expectTabs + 1, // +1 for the source tab the harness seeds
  `expected ${expectTabs + 1} notebook tabs, got ${tabs.length}`);

if (fails.length) {
  console.error(`FAIL (${fails.length})`);
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log(`PASS — ${cards.length} cards, ${tabs.length - 1} rules tabs`);
