/**
 * Headless test for tts/Custom40kInstaller.lua (the object that installs the table mod on any table).
 *   node tts/test/run_installer.cjs
 * Also fails when public/tts/Custom40kTable.lua (what the installer downloads) is out of date: run
 * `node tts/build_installer.cjs` after changing the mod.
 */
const fs = require('fs');
const path = require('path');
const { lua, lauxlib, lualib, to_luastring, to_jsstring } = require('fengari');

const tts = path.join(__dirname, '..');
const modSrc = fs.readFileSync(path.join(tts, 'Custom40kTable.lua'), 'utf8').replace(/\r\n/g, '\n');
const pub = fs.readFileSync(path.join(tts, '..', 'public', 'tts', 'Custom40kTable.lua'), 'utf8').replace(/\r\n/g, '\n');
if (pub !== modSrc) { console.error('FAIL: public/tts/Custom40kTable.lua is out of date. Run: node tts/build_installer.cjs'); process.exit(1); }

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);
lua.lua_pushjsfunction(L, () => { lua.lua_pushstring(L, to_luastring(modSrc)); return 1; });
lua.lua_setglobal(L, to_luastring('GET_MOD'));

const harness = `
MOD_SOURCE = GET_MOD()
MSGS, SET, BUTTONS = {}, nil, 0
function broadcastToAll(m) MSGS[#MSGS + 1] = m end
self = { clearButtons = function() end, createButton = function(b) BUTTONS = BUTTONS + 1 end }
local current = ''
Global = {
  getLuaScript = function() return current end,
  setLuaScript = function(s) current = s; SET = s end,
  getTable = function(name) if name == 'C40K' and current:find('C40K-TABLE-MOD', 1, true) then return {} end end,
}
local serve = true
WebRequest = { get = function(_, cb) if serve then cb({ is_error = false, response_code = 200, text = MOD_SOURCE }) else cb({ is_error = true, error = 'offline' }) end end }
Wait = { time = function(f) f() end }
function SETUP(script, online) current = script; SET = nil; MSGS = {}; serve = online end
function LAST() return MSGS[#MSGS] or '' end
function ALL() return table.concat(MSGS, ' | ') end
`;
const run = (code, name) => {
  if (lauxlib.luaL_dostring(L, to_luastring(code)) !== lua.LUA_OK) { console.error(`${name}: ${to_jsstring(lua.lua_tostring(L, -1))}`); process.exit(1); }
};
run(harness, 'harness');
run(fs.readFileSync(path.join(tts, 'Custom40kInstaller.lua'), 'utf8'), 'installer');

const fails = [];
const tests = `
FAILS = {}
local function check(c, m) if not c then FAILS[#FAILS + 1] = m end end
onLoad(); check(BUTTONS == 1, 'the object gets one install button')
-- 1. blank table (TTS default comment): installs
SETUP('--[[ Lua code. See documentation: https://api.tabletopsimulator.com/ --]]', true); installMod(nil, 'White')
check(SET ~= nil and SET:find('C40K-TABLE-MOD', 1, true), 'a table with the default Global comment gets the mod: ' .. ALL())
check(LAST():find('C40K button'), 'it tells the player to press C40K: ' .. LAST())
-- 2. already ours: updates
SETUP('-- C40K-TABLE-MOD old version function onLoad() end', true); installMod(nil, 'White')
check(SET ~= nil, 'an older copy of the mod is replaced (update)')
-- 3. somebody else's Global script: untouched
SETUP('function onLoad() print("my table") end function onUpdate() end', true); installMod(nil, 'White')
check(SET == nil and ALL():find('already has its own Global script'), 'a foreign Global script is never overwritten: ' .. ALL())
-- 4. offline
SETUP('', false); installMod(nil, 'White')
check(SET == nil and ALL():find('Could not download'), 'a failed download changes nothing: ' .. ALL())
-- 5. a download that is not our script
SETUP('', true); MOD_SOURCE_BACKUP = MOD_SOURCE; MOD_SOURCE = '<html>404</html>'; installMod(nil, 'White'); MOD_SOURCE = MOD_SOURCE_BACKUP
check(SET == nil, 'a downloaded page that is not the mod is refused: ' .. ALL())
`;
run(tests, 'tests');
lua.lua_getglobal(L, to_luastring('FAILS'));
const n = lua.lua_rawlen(L, -1);
for (let i = 1; i <= n; i++) { lua.lua_geti(L, -1, i); fails.push(to_jsstring(lua.lua_tostring(L, -1))); lua.lua_pop(L, 1); }
if (fails.length) { console.error('FAIL'); fails.forEach(f => console.error('  - ' + f)); process.exit(1); }
console.log('PASS - installer: installs on a blank table, updates its own copy, never overwrites a foreign Global script');
