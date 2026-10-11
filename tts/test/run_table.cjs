/**
 * Headless test for tts/Custom40kTable.lua (the all-in-one Global script).
 *
 * Runs the mod inside fengari (a Lua VM in JavaScript) with table_harness.lua standing in for Tabletop Simulator,
 * a REAL JSON bridge, and a REAL export from src/utils/ttsExport.ts. table_tests.lua then drives the UI by clicking
 * the same element ids TTS would, and this file checks every XML string the mod emits is well formed.
 *
 *   npx jiti tts/test/makeExport.ts "Codex/Raiders 1500.json" /tmp/army.json
 *   node tts/test/run_table.cjs /tmp/army.json
 */
const fs = require('fs');
const path = require('path');
const { lua, lauxlib, lualib, to_luastring, to_jsstring } = require('fengari');

const exportPath = process.argv[2];
if (!exportPath) { console.error('usage: node tts/test/run_table.cjs <export.json>'); process.exit(2); }

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);

function push(v) {
  if (v === null || v === undefined) { lua.lua_pushnil(L); return; }
  if (typeof v === 'string') { lua.lua_pushstring(L, to_luastring(v)); return; }
  if (typeof v === 'number') { lua.lua_pushnumber(L, v); return; }
  if (typeof v === 'boolean') { lua.lua_pushboolean(L, v); return; }
  lua.lua_newtable(L);
  if (Array.isArray(v)) v.forEach((el, i) => { push(el); lua.lua_seti(L, -2, i + 1); });
  else for (const [k, val] of Object.entries(v)) { lua.lua_pushstring(L, to_luastring(k)); push(val); lua.lua_settable(L, -3); }
}
function read(idx) {
  idx = lua.lua_absindex(L, idx);
  const t = lua.lua_type(L, idx);
  if (t === lua.LUA_TSTRING) return to_jsstring(lua.lua_tostring(L, idx));
  if (t === lua.LUA_TNUMBER) return lua.lua_tonumber(L, idx);
  if (t === lua.LUA_TBOOLEAN) return !!lua.lua_toboolean(L, idx);
  if (t !== lua.LUA_TTABLE) return null;
  const n = lua.lua_rawlen(L, idx);
  if (n > 0) {
    const out = [];
    for (let i = 1; i <= n; i++) { lua.lua_geti(L, idx, i); out.push(read(-1)); lua.lua_pop(L, 1); }
    return out;
  }
  const out = {};
  lua.lua_pushnil(L);
  while (lua.lua_next(L, idx) !== 0) {
    const key = lua.lua_type(L, -2) === lua.LUA_TNUMBER ? String(lua.lua_tonumber(L, -2)) : to_jsstring(lua.lua_tostring(L, -2));
    out[key] = read(-1);
    lua.lua_pop(L, 1);
  }
  return out;
}
function def(name, fn) { lua.lua_pushjsfunction(L, fn); lua.lua_setglobal(L, to_luastring(name)); }

// Real JSON for the mod (TTS provides JSON.decode / JSON.encode).
def('JS_JSON_DECODE', () => { push(JSON.parse(to_jsstring(lua.lua_tostring(L, 1)))); return 1; });
def('JS_JSON_ENCODE', () => { lua.lua_pushstring(L, to_luastring(JSON.stringify(read(1)))); return 1; });
def('READ_EXPORT', () => { lua.lua_pushstring(L, to_luastring(fs.readFileSync(exportPath, 'utf-8'))); return 1; });

// A well-formedness check good enough to catch what breaks Tabletop Simulator's XML UI.
def('XML_CHECK', () => {
  const xml = to_jsstring(lua.lua_tostring(L, 1));
  const err = (m) => { lua.lua_pushstring(L, to_luastring(m)); return 1; };
  if (/&(?!(amp|lt|gt|quot|apos|#\d+);)/.test(xml)) return err('bare & in XML');
  const stack = [];
  const re = /<(\/?)([A-Za-z][A-Za-z0-9]*)((?:\s+[A-Za-z0-9_:]+="[^"<]*")*)\s*(\/?)>/g;
  let last = 0, m;
  while ((m = re.exec(xml))) {
    const between = xml.slice(last, m.index);
    if (/[<>]/.test(between)) return err('stray < or > near: ' + between.slice(0, 60));
    last = re.lastIndex;
    if (m[1]) { const top = stack.pop(); if (top !== m[2]) return err(`</${m[2]}> closes <${top}>`); }
    else if (!m[4]) stack.push(m[2]);
  }
  if (/[<>]/.test(xml.slice(last))) return err('stray < or > at the end');
  if (stack.length) return err('unclosed: ' + stack.join(','));
  const ids = [...xml.matchAll(/ id="([^"]*)"/g)].map(x => x[1]);
  const dup = ids.find((x, i) => ids.indexOf(x) !== i);
  if (dup) return err('duplicate id: ' + dup);
  lua.lua_pushnil(L); return 1;
});

function dofile(file) {
  if (lauxlib.luaL_dostring(L, to_luastring(fs.readFileSync(file, 'utf-8'))) !== lua.LUA_OK) {
    console.error(`${file}: ${to_jsstring(lua.lua_tostring(L, -1))}`); process.exit(1);
  }
}
dofile(path.join(__dirname, 'table_harness.lua'));
lauxlib.luaL_dostring(L, to_luastring('JSON = { decode = JS_JSON_DECODE, encode = JS_JSON_ENCODE }'));
dofile(path.join(__dirname, '..', 'Custom40kTable.lua'));
dofile(path.join(__dirname, 'table_tests.lua'));

lua.lua_getglobal(L, to_luastring('FAILS'));
const fails = read(-1) || [];
lua.lua_getglobal(L, to_luastring('PASSES'));
const passes = lua.lua_tonumber(L, -1);
if (Array.isArray(fails) ? fails.length : Object.keys(fails).length) {
  console.error('FAIL'); for (const f of (Array.isArray(fails) ? fails : Object.values(fails))) console.error('  - ' + f);
  process.exit(1);
}
console.log(`PASS - ${passes} checks`);
