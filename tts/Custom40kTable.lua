--[[
  Custom40k Table  —  Tabletop Simulator companion (Global script)
  ------------------------------------------------------------------------------------------------
  One mod for the whole game. Paste this into the GLOBAL script of a table (or publish the table to the
  Workshop with it). It carries NO codex: the builder app exports each army already resolved (final
  stats, final weapon profiles, rule texts, and the turn structure / orders / mission scoring), and
  this script only displays and tracks it. See src/utils/ttsExport.ts and src/data/ttsGame.ts.

  WHAT IT DOES
    ARMY      load one army per side from a notebook tab, spawn datasheet cards, copy rules to the notebook
    RULES     every rule of a unit (abilities, weapon abilities) with its text, one page at a time
    BINDER    select miniatures on the table and bind them to a unit / model group: they get its name and
              datasheet, and the binding is remembered (it is what range rings and the wound counter use)
    BATTLE    battle round + phase tracker with the rules of the current phase, initiative, rally and
              reinforcement rolls, orders, Battleshock tokens, activations, models left per unit
    ATTACK    pick a weapon and a target: the rolls needed to hit / wound / save, the expected result,
              and a button that rolls it
    RINGS     movement and weapon-range rings around the miniatures of a unit
    MISSIONS  the engagement's missions, a victory-point pad, attrition from the models you removed,
              secondary objectives and the winner

  HOW TO GET AN ARMY IN
    1. In the builder: Print View -> TTS. A .json downloads.
    2. In TTS: Notes -> add a tab called  Custom40k  (side 1) or  Custom40k 2  (side 2) and paste the file
       into its body. (A plain https:// URL to the JSON also works.)
    3. Open the table menu with the C40K button (top right), tab ARMY, press LOAD for that side.

  Every rule number used by the calculators comes from the Custom40k Core Rules (to-hit, wound table,
  saving throws, armor penetration, Battleshock, reinforcement). Nothing here is a house rule.
--]]

local SCHEMA        = 2
local SPAWN_TAG     = 'c40k_spawn'
local SIDE_TABS     = { 'Custom40k', 'Custom40k 2' }
local SIDE_COLOR    = { '#E0A030', '#40A0E0' }          -- side 1 amber, side 2 blue (UI + rings)
local SIDE_RGB      = { { 0.88, 0.63, 0.19 }, { 0.25, 0.63, 0.88 } }

-- Table units per inch (Tabletop Simulator's ruler measures in inches by default) and the radius of a
-- typical 32 mm base in inches, so a ring is measured from the base edge like the rulebook does.
local UNIT_PER_INCH     = 1.0
local BASE_RADIUS_INCH  = 0.63

local GRID_COLS, GRID_DX, GRID_DZ = 6, 2.6, 3.6
local GRID_ORIGIN = { x = -6.5, y = 1.2, z = 3.0 }

local TEXT_CHARS_PER_LINE = 70     -- how many characters fit a line of the reading pane (estimate)
local TEXT_LINES_PER_PAGE = 17

local unpack = table.unpack or unpack


-- ── state ───────────────────────────────────────────────────────────────────────────────────────

local S    -- persisted: armies, battle state, bindings, victory points
local UI_STATE = { open = true, tab = 'army', side = 1, unit = 1, page = 1, binderCursor = 1,
                   atk = { side = 1, unit = 1, weapon = 1, defSide = 2, defUnit = 1, defModel = 1,
                           cover = 0, takeCover = false, halfRange = false, copies = 0, order = '',
                           mHit = 0, mWound = 0, mAp = 0, facing = 'front', lastResult = '' },
                   missionPick = 1 }

local function freshState()
  return {
    armies = {}, bs = {}, round = 1, phase = 1, initiative = 0, lastInitiative = 0,
    vp = { 0, 0 }, secondary = { {}, {} }, mission = 1, log = {},
    bindings = {},               -- guid -> { side, unit, model }
    rings = {},                  -- guid -> true while its rings are drawn
    spawned = {},
  }
end


-- ── small helpers ───────────────────────────────────────────────────────────────────────────────

local function trim(s) return (tostring(s or ''):gsub('^%s+', ''):gsub('%s+$', '')) end
local function isBlank(s) s = trim(s); return s == '' or s == '-' end

local function num(v)
  if type(v) ~= 'number' then return tostring(v or '') end
  if v == math.floor(v) then return string.format('%d', v) end
  return tostring(v)
end

--- Join the non-empty arguments. Variadic on purpose: `ipairs` over a table stops at the first nil hole
--- (see tts/README.md), which once deleted a whole meta line.
local function joinParts(sep, ...)
  local kept = {}
  for i = 1, select('#', ...) do
    local p = select(i, ...)
    if not isBlank(p) then kept[#kept + 1] = trim(p) end
  end
  return table.concat(kept, sep)
end

local function pad(s, n)
  s = tostring(s or '')
  if #s >= n then return s .. ' ' end
  return s .. string.rep(' ', n - #s)
end

local function say(msg, color) printToAll('[Custom40k] ' .. msg, color or { 1, 0.85, 0.6 }) end
local function warn(msg) say(msg, { 1, 0.45, 0.45 }) end

local function xmlEscape(s)
  s = tostring(s or '')
  s = s:gsub('&', '&amp;'):gsub('<', '&lt;'):gsub('>', '&gt;'):gsub('"', '&quot;')
  return s
end

local function roll() return math.random(1, 6) end

local function signed(v) return (v > 0 and '+' or '') .. tostring(v) end

local function clamp(v, lo, hi) if v < lo then return lo elseif v > hi then return hi end return v end

--- "3+" -> 3, "-" -> nil, 4 -> 4.
local function plusValue(v)
  if type(v) == 'number' then return v end
  local n = tostring(v or ''):match('^(%d+)%+?$')
  return n and tonumber(n) or nil
end

local function sideName(side) return side == 1 and 'Side 1' or 'Side 2' end

local function army(side) return S.armies[side] end
local function unitOf(side, i) local a = S.armies[side]; return a and a.units[i] or nil end
local function stateOf(side, i) return S.bs[side] and S.bs[side][i] or nil end


-- ── JSON text -> payload ────────────────────────────────────────────────────────────────────────

local function validPayload(payload)
  if type(payload) ~= 'table' or type(payload.units) ~= 'table' or type(payload.army) ~= 'table' then
    return false, 'That JSON is not a Custom40k export.'
  end
  if payload.schema ~= SCHEMA then
    return false, 'Export schema ' .. tostring(payload.schema) .. ', this mod expects ' .. SCHEMA
      .. '. Update the mod (or re-export).'
  end
  return true
end

--- The models of a unit as battle-state rows: how many of each are still alive.
local function freshUnitState(u)
  local alive, total = {}, 0
  for j, m in ipairs(u.models or {}) do
    alive[j] = math.floor(tonumber(m.count) or 1)
    total = total + alive[j]
  end
  return { tokens = 0, order = '', done = false, reserve = false, alive = alive, start = total, guids = {} }
end

local function installArmy(side, payload)
  S.armies[side] = payload
  S.bs[side] = {}
  for i, u in ipairs(payload.units) do S.bs[side][i] = freshUnitState(u) end
  -- bindings of the previous army on this side are meaningless now
  for guid, b in pairs(S.bindings) do if b.side == side then S.bindings[guid] = nil end end
  S.rings = {}
  UI_STATE.unit = 1
  UI_STATE.binderCursor = 1
end

local function loadSide(side, text)
  local ok, payload = pcall(function() return JSON.decode(text) end)
  if not ok or type(payload) ~= 'table' then
    warn('Could not parse that as JSON: check the notebook tab holds the whole file.'); return false
  end
  local valid, why = validPayload(payload)
  if not valid then warn(why); return false end
  installArmy(side, payload)
  say(sideName(side) .. ': ' .. tostring(payload.army.name or 'army') .. ', ' .. #payload.units .. ' units, '
      .. num(payload.army.totalPoints or 0) .. ' pts.')
  if not payload.rules then
    say('This export has no rule texts (re-export from the builder to get them in the RULES tab).', { 1, 0.8, 0.5 })
  end
  return true
end

local function readTab(title)
  for _, tab in ipairs(Notes.getNotebookTabs()) do
    if tab.title == title then return trim(tab.body) end
  end
  return nil
end

local PLACEHOLDER = '[PASTE YOUR ARMY JSON HERE'

--- The two army tabs exist from the first load, with the instructions in them, so nobody has to know the names.
local function ensureTabs()
  local have = {}
  for _, tab in ipairs(Notes.getNotebookTabs()) do have[tab.title] = true end
  for side, title in ipairs(SIDE_TABS) do
    if not have[title] then
      Notes.addNotebookTab({ title = title, color = 'Grey',
        body = PLACEHOLDER .. ' - replace this whole text]' .. string.char(10, 10) .. 'In the Custom40k builder open your army, go to Print View and press TTS: a .json file downloads. '
          .. 'Open it, copy everything and paste it here (Ctrl+V), replacing this text. Then press C40K (top right) > ARMY > LOAD for ' .. sideName(side) .. '.' })
    end
  end
end

local function loadFromTab(side)
  local title = SIDE_TABS[side]
  local src = readTab(title)
  if not src or src == '' then
    warn('No notebook tab called "' .. title .. '". Create it and paste the exported JSON in.'); return
  end
  if src:sub(1, #PLACEHOLDER) == PLACEHOLDER then
    warn('The "' .. title .. '" notebook tab still holds the instructions. Paste your exported army JSON over them first (builder: Print View > TTS).'); return
  end
  if src:sub(1, 4) == 'http' then
    say('Fetching ' .. src .. ' ...')
    WebRequest.get(src, function(req)
      if req.is_error or req.response_code ~= 200 then
        warn('Fetch failed: ' .. tostring(req.error or req.response_code)); return
      end
      if loadSide(side, req.text) then _G.uiRefresh() end
    end)
  else
    loadSide(side, src)
  end
end


-- ── text builders (datasheet, rules) ────────────────────────────────────────────────────────────

local NAME_COL = 26

local function modelBlock(models)
  if not models or #models == 0 then return '' end
  local out, keys = {}, models[1].statKeys or {}
  local header = pad('', NAME_COL)
  for _, k in ipairs(keys) do header = header .. pad(k, 5) end
  out[#out + 1] = header
  local order, byName = {}, {}
  for _, m in ipairs(models) do
    local row = byName[m.name]
    if not row then row = { m = m, count = 0 }; byName[m.name] = row; order[#order + 1] = row end
    row.count = row.count + (m.count or 0)
  end
  for _, row in ipairs(order) do
    local line = pad(row.m.name .. (row.count > 0 and (' x' .. num(row.count)) or ''), NAME_COL)
    for _, k in ipairs(keys) do line = line .. pad((row.m.stats or {})[k] or '-', 5) end
    out[#out + 1] = line
  end
  return table.concat(out, '\n')
end

local function weaponNames(u)
  local names = {}
  for _, w in ipairs(u.weapons or {}) do names[w.id] = w.name end
  return names
end

local function loadoutBlock(u)
  local models = u.models
  if not models or #models < 2 then return '' end
  local names, lines = weaponNames(u), {}
  for _, m in ipairs(models) do
    local parts = {}
    for _, mw in ipairs(m.modelWeapons or {}) do
      local n = names[mw.weaponId] or mw.weaponId
      parts[#parts + 1] = (mw.count and mw.count > 1) and (num(mw.count) .. 'x ' .. n) or n
    end
    if #parts > 0 then
      local who = m.name
      if m.loadoutName and m.loadoutName ~= m.name then who = who .. ' (' .. m.loadoutName .. ')' end
      lines[#lines + 1] = num(m.count) .. 'x ' .. who .. ': ' .. table.concat(parts, ', ')
    end
  end
  return table.concat(lines, '\n')
end

local function weaponBlock(weapons)
  if not weapons or #weapons == 0 then return '' end
  local out = { pad('WEAPON', NAME_COL) .. pad('RNG', 8) .. pad('TYPE', 14)
                  .. pad('S', 4) .. pad('AP', 4) .. pad('D', 4) .. 'ABILITIES' }
  for _, w in ipairs(weapons) do
    out[#out + 1] = pad(w.name, NAME_COL) .. pad(w.range, 8) .. pad(w.type, 14)
      .. pad(w.s, 4) .. pad(w.ap, 4) .. pad(w.d, 4) .. (isBlank(w.abilities) and '' or w.abilities)
  end
  return table.concat(out, '\n')
end

local function powerMeta(p)
  return joinParts(' | ', p.type, p.range, p.cast_value and ('Cast ' .. p.cast_value) or '', p.target, p.duration)
end
local function powerText(p) return joinParts('\n', p.name, powerMeta(p), p.effect) end

--- The rules this unit uses, each with its text.
local function ruleLines(side, u)
  local payload = S.armies[side]
  local rules = payload and payload.rules or {}
  local out = {}
  for _, name in ipairs(u.ruleNames or {}) do
    local text = rules[name]
    out[#out + 1] = text and (name .. ': ' .. text) or (name .. ': (no rule text in this export)')
  end
  return out
end

local function unitCardText(u)
  local sections = {}
  sections[#sections + 1] = joinParts('\n',
    string.upper(u.displayName or u.unitName or '?'),
    joinParts(' | ', u.slot, u.unitType, u.mark and ('Mark: ' .. u.mark) or '',
              u.size and (num(u.size) .. (u.size == 1 and ' model' or ' models')) or '',
              num(u.points) .. ' pts', u.wardSave and ('Ward ' .. u.wardSave) or ''))
  local mb = modelBlock(u.models); if mb ~= '' then sections[#sections + 1] = mb end
  local lb = loadoutBlock(u); if lb ~= '' then sections[#sections + 1] = 'LOADOUTS\n' .. lb end
  if not isBlank(u.equippedWith) then sections[#sections + 1] = 'EQUIPPED WITH\n' .. u.equippedWith end
  local wb = weaponBlock(u.weapons); if wb ~= '' then sections[#sections + 1] = 'WEAPONS\n' .. wb end
  if u.wargear and #u.wargear > 0 then
    local lines = {}
    for _, g in ipairs(u.wargear) do
      lines[#lines + 1] = isBlank(g.desc) and ('- ' .. g.name) or ('- ' .. g.name .. ': ' .. g.desc)
    end
    sections[#sections + 1] = 'WARGEAR\n' .. table.concat(lines, '\n')
  end
  if u.abilities and #u.abilities > 0 then
    sections[#sections + 1] = 'ABILITIES\n- ' .. table.concat(u.abilities, '\n- ')
  end
  for _, entry in ipairs({ { 'PRAYERS', u.prayers }, { 'PACTS', u.pacts }, { 'PSYCHIC POWERS', u.powers } }) do
    local label, list = entry[1], entry[2]
    if list and #list > 0 then
      local lines = {}
      for _, p in ipairs(list) do lines[#lines + 1] = powerText(p) end
      sections[#sections + 1] = label .. '\n' .. table.concat(lines, '\n\n')
    end
  end
  return table.concat(sections, '\n\n')
end

--- What a bound miniature shows: its model group's own stats and loadout, then the unit's rules.
local function modelText(side, ui, mj)
  local payload = S.armies[side]
  local u = payload.units[ui]
  local m = u.models[mj]
  if not m then return unitCardText(u) end
  local out = {}
  out[#out + 1] = joinParts(' | ', (u.displayName or u.unitName), m.name .. (m.loadoutName and m.loadoutName ~= m.name and (' (' .. m.loadoutName .. ')') or ''),
                            u.slot, num(u.points) .. ' pts', 'models: ' .. num(m.count))
  local keys, vals = m.statKeys or {}, {}
  local head = {}
  for _, k in ipairs(keys) do head[#head + 1] = pad(k, 5); vals[#vals + 1] = pad((m.stats or {})[k] or '-', 5) end
  out[#out + 1] = table.concat(head) .. '\n' .. table.concat(vals)
  if m.wardSave then out[#out + 1] = 'Ward save ' .. m.wardSave end
  local names, lines = weaponNames(u), {}
  for _, mw in ipairs(m.modelWeapons or {}) do
    for _, w in ipairs(u.weapons or {}) do
      if w.id == mw.weaponId then
        lines[#lines + 1] = (mw.count and mw.count > 1 and (num(mw.count) .. 'x ') or '')
          .. joinParts(' ', w.name, w.range, w.type, 'S' .. tostring(w.s), 'AP' .. tostring(w.ap), 'D' .. tostring(w.d),
                       isBlank(w.abilities) and '' or ('(' .. w.abilities .. ')'))
      end
    end
  end
  if #lines > 0 then out[#out + 1] = table.concat(lines, '\n') end
  local rl = ruleLines(side, u)
  if #rl > 0 then out[#out + 1] = table.concat(rl, '\n') end
  return table.concat(out, '\n\n')
end


-- ── stat / weapon parsing ───────────────────────────────────────────────────────────────────────

--- First integer in a stat cell: 6" -> 6, 3+ -> 3, -1 -> -1, "-" -> nil.
local function statNum(v)
  if type(v) == 'number' then return v end
  local s = tostring(v or '')
  local n = s:match('^%s*(%-?%d+)')
  return n and tonumber(n) or nil
end

local function modelStat(m, key)
  if not m then return nil end
  local stats = m.stats or {}
  return stats[key] or stats[string.upper(key)] or stats[string.lower(key)]
end

--- "Rapid Fire 2" -> "Rapid Fire", 2.  "Melee" -> "Melee", nil.
local function splitType(t)
  t = trim(t)
  local name, n = t:match('^(.-)%s+(%d+)$')
  if name then return name, tonumber(n) end
  return t, nil
end

--- "AT(1), Deadly(6+), Slow(-1)" -> { at = '1', deadly = '6+', slow = '-1' } (names lowercased).
--- A top-level comma split only: "Armor piercing(5+)" keeps its parentheses.
local function parseAbilities(text)
  local out, order = {}, {}
  text = trim(text)
  if text == '' or text == '-' then return out, order end
  local depth, cur = 0, ''
  local function flush()
    local part = trim(cur); cur = ''
    if part == '' then return end
    local name, arg = part:match('^(.-)%s*%((.*)%)%s*$')
    if not name then name, arg = part, '' end
    name = string.lower(trim(name))
    out[name] = arg; order[#order + 1] = name
  end
  for i = 1, #text do
    local ch = text:sub(i, i)
    if ch == '(' then depth = depth + 1 elseif ch == ')' then depth = depth - 1 end
    if ch == ',' and depth == 0 then flush() else cur = cur .. ch end
  end
  flush()
  return out, order
end

local function argNum(arg) return statNum((arg or ''):gsub('%+$', '')) end

--- How many models of the defending unit are still on the table (all groups).
local function aliveTotal(side, i)
  local st = stateOf(side, i)
  if not st then return 0 end
  local n = 0
  for _, a in ipairs(st.alive) do n = n + a end
  return n
end

local function isVehicleUnit(u)
  local m = u.models and u.models[1]
  if not m then return false end
  local s = m.stats or {}
  return s.FRONT ~= nil or s.HP ~= nil
end


-- ── effects (powers, prayers, pacts, leader grants) ─────────────────────────────────────────────

--- Everything the calculators can read out of an effect text. This is best-effort text reading, so the UI always
--- prints what it understood ("Automated: ...") and lets the player add a manual modifier on top.
local function parseEffect(text)
  local lower = string.lower(text or '')
  local mods = { hit = 0, wound = 0, strMelee = 0, strRanged = 0, apMelee = 0, apRanged = 0, save = 0,
                 ward = nil, warded = 0, abil = { melee = {}, ranged = {} }, tokens = 0, text = {} }
  local function addAbil(kind, name)
    if kind ~= 'ranged' then mods.abil.melee[#mods.abil.melee + 1] = name end
    if kind ~= 'melee' then mods.abil.ranged[#mods.abil.ranged + 1] = name end
  end
  local function kindOf(s)
    s = string.lower(s)
    if s:find('melee') then return 'melee' elseif s:find('ranged') then return 'ranged' end
    return 'all'
  end
  for subject, name in text:gmatch('([%a%s%-]-weapons?)%s+gains?%s+the%s+"([^"]+)"') do
    addAbil(kindOf(subject), name); mods.text[#mods.text + 1] = name .. ' on ' .. kindOf(subject) .. ' weapons'
  end
  for name in text:gmatch('[Gg]ains? the "([^"]+)" ability') do
    if not lower:find('weapons gain') then
      if name:lower() == 'warded' then mods.warded = mods.warded + 1; mods.text[#mods.text + 1] = 'Warded'
      end
    end
  end
  for subject, n in text:gmatch('([%a%s%-]-weapons?)%s+gains?%s+additional%s+%-(%d+)%s*AP') do
    n = tonumber(n)
    local k = kindOf(subject)
    if k ~= 'ranged' then mods.apMelee = mods.apMelee + n end
    if k ~= 'melee' then mods.apRanged = mods.apRanged + n end
    mods.text[#mods.text + 1] = '-' .. n .. ' AP on ' .. k .. ' weapons'
  end
  for n in lower:gmatch('%+(%d) to hit') do mods.hit = mods.hit + tonumber(n); mods.text[#mods.text + 1] = '+' .. n .. ' to hit' end
  for n in lower:gmatch('%-(%d) to hit') do mods.hit = mods.hit - tonumber(n); mods.text[#mods.text + 1] = '-' .. n .. ' to hit' end
  for n in lower:gmatch('%+(%d) to wound') do mods.wound = mods.wound + tonumber(n); mods.text[#mods.text + 1] = '+' .. n .. ' to wound' end
  for n in lower:gmatch('%-(%d) to wound') do mods.wound = mods.wound - tonumber(n); mods.text[#mods.text + 1] = '-' .. n .. ' to wound' end
  for n in lower:gmatch('%+(%d)%s+to%s+[%a%s]-saving throws?') do mods.save = mods.save + tonumber(n); mods.text[#mods.text + 1] = '+' .. n .. ' to saves' end
  local w = lower:match('(%d)%+%s+ward save')
  if w then mods.ward = tonumber(w); mods.text[#mods.text + 1] = w .. '+ ward' end
  local tk = lower:match('gains? (%d+) battleshock token') or (lower:find('gains? a battleshock token') and '1') or (lower:find('gains? one battleshock token') and '1')
  if tk then mods.tokens = tonumber(tk); mods.text[#mods.text + 1] = tk .. ' Battleshock token(s)' end
  return mods
end

--- "The target suffers three automatic hits with Strength: 5 AP: -1 D: 1" -> { n=3, s=5, ap=-1, d=1 }.
local WORDNUM = { one = 1, two = 2, three = 3, four = 4, five = 5, six = 6, a = 1, an = 1 }
local function parseAutoHits(text)
  local lower = string.lower(text or '')
  local nStr = lower:match('(%w+)%s+automatic hits?')
  if not nStr then return nil end
  local n = tonumber(nStr) or WORDNUM[nStr]
  local s = lower:match('s[trength]*:?%s*(%d+)')
  local ap = lower:match('ap:?%s*(%-?%d+)')
  local d = lower:match('d[amage]*:?%s*(%d+)')
  if not (n and s) then return nil end
  return { n = n, s = tonumber(s), ap = tonumber(ap or 0), d = tonumber(d or 1), seeking = lower:find('seeking') ~= nil }
end

--- How long a status lasts, as one of 'instant' | 'activation' | 'round' | 'game'.
local function durationKind(d)
  d = string.lower(d or '')
  if d == '' or d:find('instant') then return 'instant' end
  if d:find('rest of the game') or d:find('permanent') then return 'game' end
  if d:find('round') then return 'round' end
  return 'activation'
end

local function effectsOf(side, i)
  local st = stateOf(side, i)
  if not st then return {} end
  st.effects = st.effects or {}
  return st.effects
end

local function addEffect(side, i, eff)
  local list = effectsOf(side, i)
  for k, e in ipairs(list) do if e.name == eff.name and e.source == eff.source then list[k] = eff; return end end
  list[#list + 1] = eff
end

--- Sum of every active effect on a unit, plus the grants of the characters attached to it.
local function modsFor(side, i)
  local total = { hit = 0, wound = 0, strMelee = 0, strRanged = 0, apMelee = 0, apRanged = 0, save = 0,
                  ward = nil, warded = 0, abil = { melee = {}, ranged = {} }, text = {} }
  local function merge(m, label)
    total.hit = total.hit + m.hit; total.wound = total.wound + m.wound
    total.strMelee = total.strMelee + m.strMelee; total.strRanged = total.strRanged + m.strRanged
    total.apMelee = total.apMelee + m.apMelee; total.apRanged = total.apRanged + m.apRanged
    total.save = total.save + m.save; total.warded = total.warded + m.warded
    if m.ward and (not total.ward or m.ward < total.ward) then total.ward = m.ward end
    for _, a in ipairs(m.abil.melee) do total.abil.melee[#total.abil.melee + 1] = a end
    for _, a in ipairs(m.abil.ranged) do total.abil.ranged[#total.abil.ranged + 1] = a end
    for _, t in ipairs(m.text) do total.text[#total.text + 1] = (label and (label .. ': ') or '') .. t end
  end
  for _, e in ipairs(effectsOf(side, i)) do merge(parseEffect(e.text), e.name) end
  -- characters joined to this unit: what their wargear hands to the unit they lead
  local a = S.armies[side]
  if a then
    for j, u in ipairs(a.units) do
      if u.joinedTo and u.joinedTo == (a.units[i] and a.units[i].id) and aliveTotal(side, j) > 0 then
        for _, g in ipairs(u.grantsToUnit or {}) do merge(parseEffect(g.text), g.source) end
      end
    end
  end
  -- manual adjustments from the table
  local st = stateOf(side, i)
  if st and st.manual then
    total.hit = total.hit + (st.manual.hit or 0); total.wound = total.wound + (st.manual.wound or 0)
    total.save = total.save + (st.manual.save or 0)
  end
  return total
end

--- The ward save a unit really has right now: its own + leaders' grants ("Warded" improves by 1, to 4+) + effects.
local function effectiveWard(side, i)
  local u = unitOf(side, i)
  if not u then return nil end
  local base = plusValue(u.wardSave)
  local m = modsFor(side, i)
  local best = base
  if m.ward and (not best or m.ward < best) then best = m.ward end
  if m.warded > 0 then
    if best then best = math.max(4, best - m.warded) else best = math.max(4, 7 - m.warded) end
    if best > 6 then best = 6 end
  end
  return best
end


-- ── the attack calculator ───────────────────────────────────────────────────────────────────────

local function pHitNeed(need) need = clamp(need, 2, 6); return (7 - need) / 6 end
local function pSaveNeed(need) if need > 6 then return 0 end; need = math.max(need, 2); return (7 - need) / 6 end

local function woundNeed(s, t)
  if s >= 2 * t then return 2 end
  if s > t then return 3 end
  if s == t then return 4 end
  if s * 2 <= t then return 6 end
  return 5
end

local HANDLED = { ['at'] = 1, ['deadly'] = 1, ['slow'] = 1, ['blast'] = 1, ['auto hit'] = 1, ['melta'] = 1, ['lance'] = 1,
  ['armorbane'] = 1, ['armor piercing'] = 1, ['decimate'] = 1, ['poison'] = 1, ['rending'] = 1, ['shred'] = 1, ['grav'] = 1,
  ['shield breaker'] = 1, ['sunder'] = 1, ['seeking'] = 1, ['master-crafted'] = 1, ['soul burn'] = 1, ['anti-air'] = 1,
  ['haywire'] = 1, ['overheat'] = 1, ['overheating'] = 1, ['limit'] = 1, ['extra attack'] = 1, ['combi'] = 1 }

--- Which of a model's weapons are of which class.
local function weaponKind(w)
  local base = splitType(w.type)
  return (string.lower(base) == 'melee') and 'melee' or 'ranged'
end

--- How many attacks `w` makes in this activation: its own count x the models that carry it (or the manual override).
local function weaponAttacks(side, ui, w, copies)
  local u = unitOf(side, ui)
  local st = stateOf(side, ui)
  local base, n = splitType(w.type)
  local carriers, carrierModel = 0, nil
  for j, m in ipairs(u.models) do
    for _, mw in ipairs(m.modelWeapons or {}) do
      if mw.weaponId == w.id then
        carriers = carriers + (st.alive[j] or 0) * (mw.count or 1)
        carrierModel = carrierModel or m
      end
    end
  end
  if copies and copies > 0 then carriers = copies end
  if carriers == 0 then carriers = 1 end
  carrierModel = carrierModel or u.models[1]
  local per = n
  if string.lower(base) == 'melee' then per = statNum(modelStat(carrierModel, 'A')) or 1 end
  return carriers * (per or 1), carrierModel, carriers
end

local function strengthOf(w, carrierModel)
  local s = trim(w.s)
  if s == 'D' or s == 'd' then return 10, true end
  if s == 'U' or s == 'u' then return statNum(modelStat(carrierModel, 'S')) or 4, false end
  local plus = s:match('^%+(%d+)$')
  if plus then return (statNum(modelStat(carrierModel, 'S')) or 4) + tonumber(plus), false end
  local mul = s:match('^[xX](%d+)$')
  if mul then return (statNum(modelStat(carrierModel, 'S')) or 4) * tonumber(mul), false end
  return statNum(s) or 4, false
end

--- Build every number the attack needs, with a line of text for each one explaining where it came from.
--- opts: cover 0/1/2, takeCover, halfRange, facing 'front'|'side'|'rear', copies, manualHit/Wound/Ap, order
local function buildAttack(sa, ia, wIdx, sd, id, jd, opts)
  local ua, ud = unitOf(sa, ia), unitOf(sd, id)
  if not ua or not ud then return nil, 'Pick an attacker and a target.' end
  local w = opts.weapon or (ua.weapons and ua.weapons[wIdx])
  if not w then return nil, 'Pick a weapon.' end
  local stA, stD = stateOf(sa, ia), stateOf(sd, id)
  local kind = weaponKind(w)
  local ab = parseAbilities(w.abilities)
  local attacks, carrier, carriers
  if opts.weapon then attacks, carrier, carriers = opts.fixedAttacks or 1, ua.models[1], 1
  else attacks, carrier, carriers = weaponAttacks(sa, ia, w, opts.copies) end
  local mA, mD = modsFor(sa, ia), modsFor(sd, id)
  local defModel = ud.models[jd] or ud.models[1]
  local vehicle = isVehicleUnit(ud)
  local c = { w = w, kind = kind, ab = ab, attacks = attacks, carriers = carriers, vehicle = vehicle, notes = {}, why = {},
              unitA = ua, unitD = ud, sa = sa, ia = ia, sd = sd, id = id, jd = jd, defModel = defModel }
  local notes, why = c.notes, c.why

  -- ability sources from effects (e.g. "Melee weapons gain Decimate")
  local gained = (kind == 'melee') and mA.abil.melee or mA.abil.ranged
  for _, name in ipairs(gained) do
    local n, a = name:match('^(.-)%((.*)%)$')
    ab[string.lower(n or name)] = a or ''
  end

  -- order legality (Core Rules, Weapon types)
  local base = splitType(w.type)
  local g = S.armies[sa] and S.armies[sa].game
  if opts.order and g and g.weaponOrders and g.weaponOrders[opts.order] then
    local allowed = g.weaponOrders[opts.order][base]
    if allowed == false then notes[#notes + 1] = 'A ' .. base .. ' weapon cannot be used with the ' .. opts.order .. ' order.' end
  end
  if string.lower(base) == 'rapid fire' and opts.halfRange then
    c.attacks = c.attacks * 2; notes[#notes + 1] = 'Rapid Fire inside half range: attacks doubled.'
  end
  if ab['limit'] then
    local lim = argNum(ab['limit'])
    if lim and c.attacks > lim then c.attacks = lim; notes[#notes + 1] = 'Limit(' .. lim .. ') caps the attacks.' end
  end

  -- hit
  local skillKey = (kind == 'melee') and 'WS' or 'BS'
  local skill = plusValue(modelStat(carrier, skillKey))
  c.autoHit = ab['auto hit'] ~= nil
  if not skill and not c.autoHit then return nil, 'The model has no ' .. skillKey .. ' to hit with.' end
  local hitMod = mA.hit + (opts.manualHit or 0)
  if stA and stA.tokens >= 1 then hitMod = hitMod - 1; why[#why + 1] = 'Pinned: -1 to hit' end
  if kind == 'ranged' and (opts.cover or 0) > 0 and not ab['seeking'] then hitMod = hitMod - 1; why[#why + 1] = 'Target in cover: -1 to hit' end
  if ab['sniper'] then skill = (skill or 7) - 1 end
  if hitMod ~= 0 then why[#why + 1] = 'Hit modifiers total ' .. (hitMod > 0 and '+' or '') .. hitMod end
  c.hitNeed = skill and (skill - hitMod) or nil
  c.pHit = c.autoHit and 1 or pHitNeed(c.hitNeed)

  -- blast: a successful hit scores one hit per model in the target, up to x
  c.blast = nil
  if ab['blast'] then
    local x = argNum(ab['blast']) or 1
    c.blast = math.max(1, math.min(aliveTotal(sd, id), x))
    why[#why + 1] = 'Blast(' .. x .. '): ' .. c.blast .. ' hit(s) per successful hit roll (target has ' .. aliveTotal(sd, id) .. ' model(s))'
  end

  -- strength / AP / damage
  local s, isD = strengthOf(w, carrier)
  s = s + (kind == 'melee' and mA.strMelee or mA.strRanged)
  local ap = statNum(w.ap) or 0
  ap = ap - (kind == 'melee' and mA.apMelee or mA.apRanged) + (opts.manualAp or 0)
  local dmg = statNum(w.d) or 1
  local melta = ab['melta'] and opts.halfRange
  if melta then dmg = dmg + 1; notes[#notes + 1] = 'Melta inside half range: +1 Damage, +2 AT, +3 armor penetration.' end
  c.s, c.ap, c.d, c.strengthD = s, ap, dmg, isD
  c.deadly = ab['deadly'] and argNum(ab['deadly']) or nil
  c.rending = ab['rending'] and argNum(ab['rending']) or nil
  c.apiercing = ab['armor piercing'] and argNum(ab['armor piercing']) or nil
  c.poison = ab['poison'] and argNum(ab['poison']) or nil
  c.soulBurn = ab['soul burn'] and argNum(ab['soul burn']) or nil
  c.shred = ab['shred'] ~= nil
  c.decimate = ab['decimate'] ~= nil
  c.grav = ab['grav'] ~= nil
  c.at = ab['at'] and (argNum(ab['at']) or 1) or 0
  if melta then c.at = c.at + 2 end

  -- the target
  local mDefMods = mD
  if vehicle then
    local key = (opts.facing == 'side') and 'SIDE' or (opts.facing == 'rear') and 'REAR' or 'FRONT'
    c.av = statNum(modelStat(defModel, key))
    c.avKey = key
    if not c.av then return nil, 'The target vehicle has no ' .. key .. ' armour value.' end
    c.penBonus = 0
    if ab['armorbane'] then c.penBonus = c.penBonus + 3 end
    if ab['lance'] then c.penBonus = c.penBonus + (argNum(ab['lance']) or 0) end
    if melta then c.penBonus = c.penBonus + 3 end
    if c.penBonus ~= 0 then why[#why + 1] = 'Armor penetration bonus +' .. c.penBonus end
    if c.at == 0 then notes[#notes + 1] = 'No AT(x): every penetrating hit is downgraded to a glancing hit.' end
  else
    c.t = statNum(modelStat(defModel, 'T')) or 4
    local need = woundNeed(c.s, c.t)
    local woundMod = mA.wound + (opts.manualWound or 0) + (c.decimate and 1 or 0)
    if c.grav then
      local svVal = plusValue(modelStat(defModel, 'SV'))
      if svVal and svVal < need then need = svVal end
      why[#why + 1] = 'Grav: wounds on the target\'s armour save'
    end
    c.woundNeed = clamp(need - woundMod, 2, 6)
    why[#why + 1] = 'Strength ' .. c.s .. ' vs Toughness ' .. c.t .. ' = ' .. need .. '+' .. (woundMod ~= 0 and (' (modifiers ' .. (woundMod > 0 and '+' or '') .. woundMod .. ' -> ' .. c.woundNeed .. '+)') or '')
  end

  -- saves
  local sv = plusValue(modelStat(defModel, 'SV'))
  local cover = opts.cover or 0
  local coverBonus = 0
  if kind == 'ranged' and not ab['seeking'] then
    coverBonus = cover
    if ab['sunder'] then coverBonus = math.max(0, coverBonus - (argNum(ab['sunder']) or 0)) end
    if opts.takeCover then coverBonus = coverBonus + 1; why[#why + 1] = 'Take Cover: +1 to saves, AT -1' end
    if cover > 0 or opts.takeCover then
      if c.at > 0 and (cover > 0 or opts.takeCover) then c.at = math.max(0, c.at - 1) end
    end
  end
  c.save = nil
  if sv and not vehicle then
    local needSave = sv - ap - coverBonus - mD.save
    if c.grav and needSave < 5 then needSave = 5 end
    c.save = needSave
    c.saveNeed = needSave
    why[#why + 1] = 'Save ' .. sv .. '+ with AP ' .. ap .. (coverBonus ~= 0 and (' and cover +' .. coverBonus) or '') .. ' = ' .. (needSave > 6 and 'impossible' or (math.max(needSave, 2) .. '+'))
  end
  local ward = effectiveWard(sd, id)
  if ward and ab['shield breaker'] then ward = ward + (math.abs(argNum(ab['shield breaker']) or 0)) end
  c.ward = ward
  if ward then why[#why + 1] = 'Ward ' .. ward .. '+ (ignores AP)' end

  -- unrecognised abilities are printed, not silently dropped
  local unknown = {}
  for name in pairs(ab) do if not HANDLED[name] then unknown[#unknown + 1] = name end end
  table.sort(unknown)
  if #unknown > 0 then notes[#notes + 1] = 'Not modelled (apply by hand): ' .. table.concat(unknown, ', ') end
  c.defW = statNum(modelStat(defModel, vehicle and 'HP' or 'W')) or 1
  return c
end

--- Probability distribution of a wound/penetration die, as outcomes: { prob, success, ap, dmg, mortal, pen, glance }.
local function faceOutcomes(c)
  local function face(f)
    local o = { success = false, ap = c.ap, dmg = c.d, mortal = 0, pen = false, glance = false }
    if c.vehicle then
      local S2 = c.strengthD and 10 or c.s
      local bonus = c.penBonus or 0
      local at = c.at
      if c.apiercing and f >= c.apiercing then bonus = bonus + 2; at = at + 1 end
      local total = f + S2 + bonus
      if c.strengthD then
        if c.av <= 10 or f >= 2 then o.pen = true end
      elseif total > c.av then o.pen = true
      elseif total == c.av then o.glance = true end
      if o.pen and at == 0 then o.pen = false; o.glance = true end
      o.at = at
      o.success = o.pen or o.glance
      return o
    end
    local ok
    if f == 1 then ok = false
    elseif f == 6 then ok = true
    else ok = f >= c.woundNeed end
    if c.poison and f >= c.poison then ok = true end
    if c.apiercing and f >= c.apiercing then ok = true; o.ap = o.ap - 2 end
    if c.rending and f >= c.rending then o.ap = o.ap - 1 end
    if c.deadly and f >= c.deadly then o.dmg = o.dmg + 1 end
    if c.soulBurn and f >= c.soulBurn then o.mortal = 1 end
    o.success = ok
    return o
  end
  local out = {}
  for f = 1, 6 do out[f] = face(f) end
  return out
end

--- Expected value of the whole attack, as lines of text.
local function expectAttack(c)
  local lines = {}
  local hitsPerAttack
  if c.blast then
    local p1 = c.pHit
    hitsPerAttack = p1 * c.blast + (1 - p1) * p1 * math.floor(c.blast / 2)
  else
    hitsPerAttack = c.pHit
    if c.ab['master-crafted'] and not c.autoHit then hitsPerAttack = c.pHit + (1 - c.pHit) * c.pHit end
  end
  local hits = c.attacks * hitsPerAttack
  local outs = faceOutcomes(c)
  -- re-roll of failed wound/pen dice (Shred, never against vehicles)
  local failMass = 0
  for f = 1, 6 do if not outs[f].success then failMass = failMass + 1 / 6 end end
  local reroll = c.shred and not c.vehicle
  local woundP, pen, glance, unsaved, mortal, dmgTotal = 0, 0, 0, 0, 0, 0
  for f = 1, 6 do
    local o = outs[f]
    local prob = 1 / 6
    if reroll then prob = (o.success and 1 / 6 or 0) + failMass / 6 end
    if o.success then
      woundP = woundP + prob
      local pFail
      if c.vehicle then
        pFail = c.ward and (1 - pSaveNeed(c.ward)) or 1
        if o.pen then pen = pen + prob elseif o.glance then glance = glance + prob end
      else
        local saveNeed = c.save and (c.save - (o.ap - c.ap)) or nil
        local pSave = saveNeed and pSaveNeed(saveNeed) or 0
        local pWard = c.ward and pSaveNeed(c.ward) or 0
        pFail = (1 - pSave) * (1 - pWard)
      end
      unsaved = unsaved + prob * pFail
      dmgTotal = dmgTotal + prob * pFail * o.dmg
      mortal = mortal + prob * o.mortal
    end
  end
  local woundsHit = hits * woundP
  local fails = hits * unsaved
  local totalDmg = hits * dmgTotal + hits * mortal
  lines[#lines + 1] = string.format('%s x%d attacks', c.w.name, c.attacks)
  if c.autoHit then
    lines[#lines + 1] = string.format('Hits automatically: %.1f hits', hits)
  else
    lines[#lines + 1] = string.format('To hit %d+ (%.0f%%): %.1f hits', clamp(c.hitNeed, 2, 6), c.pHit * 100, hits)
  end
  if c.vehicle then
    lines[#lines + 1] = string.format('Armor penetration vs %s %d: %.1f penetrating, %.1f glancing',
      c.avKey, c.av, hits * pen, hits * glance)
    lines[#lines + 1] = string.format('After ward: %.1f hits stick -> about %.1f Hull Point(s) worth of damage results', fails, fails)
  else
    lines[#lines + 1] = string.format('To wound %d+: %.1f wounds', c.woundNeed, woundsHit)
    lines[#lines + 1] = string.format('Unsaved: %.1f wounds, about %.1f damage%s', fails, totalDmg, mortal > 0 and (string.format(' (incl. %.1f mortal)', hits * mortal)) or '')
    if c.defW > 0 then
      local kills = 0
      if c.d >= c.defW then kills = fails else kills = totalDmg / c.defW end
      lines[#lines + 1] = string.format('About %.1f model(s) removed (W%d)', kills, c.defW)
    end
  end
  return lines
end

--- Roll it for real. Returns the lines and the number of models the result removes / hull points lost.
local function rollAttack(c)
  local lines = {}
  local function dice(n) local t = {}; for k = 1, n do t[k] = roll() end return t end
  local function listOf(t) local s = {}; for k, v in ipairs(t) do s[k] = tostring(v) end return table.concat(s, ' ') end
  lines[#lines + 1] = string.format('%s x%d attacks', c.w.name, c.attacks)
  local hits = 0
  if c.autoHit then
    hits = c.attacks; lines[#lines + 1] = 'Auto Hit: ' .. hits .. ' hits'
  else
    local r = dice(c.attacks)
    local need = clamp(c.hitNeed, 2, 6)
    local miss = {}
    local function scored(v) return v == 6 or (v ~= 1 and v >= need) end
    local overheat = 0
    for _, v in ipairs(r) do
      if scored(v) then hits = hits + (c.blast or 1) else miss[#miss + 1] = v end
      if v == 1 and (c.ab['overheat'] or c.ab['overheating']) then overheat = overheat + 1 end
    end
    if c.blast then
      for _ = 1, #miss do
        local v = roll()
        if scored(v) then hits = hits + math.floor(c.blast / 2) end
      end
    end
    if c.ab['master-crafted'] and not c.blast and #miss > 0 then
      local v = roll(); if scored(v) then hits = hits + 1; lines[#lines + 1] = 'Master-crafted re-roll: ' .. v .. ' (hit)' else lines[#lines + 1] = 'Master-crafted re-roll: ' .. v .. ' (miss)' end
    end
    lines[#lines + 1] = string.format('To hit %d+: [%s] -> %d hit(s)', need, listOf(r), hits)
    if overheat > 0 then lines[#lines + 1] = 'Overheating: ' .. overheat .. ' roll(s) of 1 -> the bearer suffers ' .. overheat .. ' Mortal Wound(s) (glancing hit(s) on a vehicle).' end
  end
  local outs = faceOutcomes(c)
  local removed, kills, lost = 0, 0, 0
  local pen, glance, unsaved = 0, 0, 0
  local woundRolls = {}
  local curDamage = 0
  local chart = {}
  local saved, failedSave = 0, 0
  for _ = 1, hits do
    local f = roll()
    local o = outs[f]
    if c.shred and not c.vehicle and not o.success then f = roll(); o = outs[f] end
    woundRolls[#woundRolls + 1] = f
    if o.success then
      local blocked = false
      if c.vehicle then
        if o.pen then pen = pen + 1 elseif o.glance then glance = glance + 1 end
        if c.ward then local wv = roll(); if wv ~= 1 and wv >= c.ward then blocked = true end end
        if not blocked then
          unsaved = unsaved + 1
          local dn = math.max(1, o.at or c.at)
          local best, all = 0, {}
          if o.pen then
            for _ = 1, math.max(1, dn) do local v = roll(); all[#all + 1] = v; chart[#chart + 1] = v end
          else
            for _ = 1, math.max(1, dn) do local v = roll(); if v > best then best = v end end
            chart[#chart + 1] = best
          end
        end
      else
        local needSave = c.save and (c.save - (o.ap - c.ap)) or 99
        if needSave <= 6 then
          local v = roll()
          if v ~= 1 and v >= needSave then blocked = true end
        end
        if not blocked and c.ward then local wv = roll(); if wv ~= 1 and wv >= c.ward then blocked = true end end
        if blocked then saved = saved + 1 else
          failedSave = failedSave + 1
          unsaved = unsaved + 1
          curDamage = curDamage + o.dmg
          if curDamage >= c.defW then removed = removed + 1; curDamage = 0 end
        end
        if o.mortal > 0 then
          curDamage = curDamage + o.mortal
          if curDamage >= c.defW then removed = removed + 1; curDamage = 0 end
        end
      end
    end
  end
  if c.vehicle then
    lines[#lines + 1] = string.format('Armor penetration [%s] vs %s %d: %d penetrating, %d glancing', listOf(woundRolls), c.avKey, c.av, pen, glance)
    local CHART = { 'nothing happens', 'Crew Shaken', 'Engine Damage', 'Weapon Damage', 'Structural Damage (-1 Hull Point)', 'Critical Damage (attacker chooses Engine / Weapon / Structural)' }
    if #chart > 0 then
      local names = {}
      for k, v in ipairs(chart) do names[k] = v .. ' = ' .. CHART[v] end
      lines[#lines + 1] = 'Vehicle Damage Chart: ' .. table.concat(names, '; ')
      for _, v in ipairs(chart) do if v == 5 then lost = lost + 1 end end
    end
  else
    lines[#lines + 1] = string.format('To wound %d+: [%s]', c.woundNeed, listOf(woundRolls))
    lines[#lines + 1] = string.format('Saved %d, failed %d -> %d model(s) removed (W%d, D%d)', saved, failedSave, removed, c.defW, c.d)
  end
  return lines, removed, lost, hits
end


-- ── battle: round, phases, initiative, rally, reinforcements, tokens ───────────────────────────

local function gameOf()
  for side = 1, 2 do
    local a = S.armies[side]
    if a and a.game then return a.game end
  end
  return nil
end

local function phasesOf()
  local g = gameOf()
  return g and g.phases or {}
end

local function currentPhase()
  local ph = phasesOf()
  return ph[S.phase]
end

local function logLine(msg)
  S.log[#S.log + 1] = 'R' .. S.round .. ' ' .. msg
  while #S.log > 40 do table.remove(S.log, 1) end
  say(msg)
end

local function expireEffects(kind, casterSide, casterUnit)
  for side = 1, 2 do
    local a = S.armies[side]
    if a then
      for i = 1, #a.units do
        local list = effectsOf(side, i)
        for k = #list, 1, -1 do
          local e = list[k]
          local expire = false
          if kind == 'round' and (e.kind == 'round' or e.kind == 'activation') then expire = true end
          if kind == 'activation' and e.kind == 'activation' and e.casterSide == casterSide and e.casterUnit == casterUnit then expire = true end
          if expire then table.remove(list, k) end
        end
      end
    end
  end
end

local function newRound()
  S.round = S.round + 1
  S.phase = 1
  for side = 1, 2 do
    for _, st in ipairs(S.bs[side] or {}) do st.done = false; st.order = '' end
  end
  expireEffects('round')
  local g = gameOf()
  local total = g and g.rounds or 5
  if S.round > total then
    S.round = total
    logLine('The last battle round is over: count victory points (MISSION tab).')
  else
    logLine('Battle round ' .. S.round .. ' begins.')
  end
end

local function nextPhase()
  local ph = phasesOf()
  if #ph == 0 then warn('Load an army first: the turn structure comes with it.'); return end
  if S.phase >= #ph then newRound() else S.phase = S.phase + 1; logLine('Phase: ' .. ph[S.phase].name) end
end

local function prevPhase()
  if S.phase > 1 then S.phase = S.phase - 1 end
end

local function twoD6() return roll() + roll() end

local function rollInitiative()
  local a, b = twoD6(), twoD6()
  local winner
  if a > b then winner = 1 elseif b > a then winner = 2
  else
    if S.lastInitiative ~= 0 then winner = (S.lastInitiative == 1) and 2 or 1
    else winner = 0 end
  end
  if winner == 0 then
    logLine(string.format('Initiative: %d vs %d, tie. First round: the player who finished deploying first wins it.', a, b))
  else
    S.initiative = winner; S.lastInitiative = winner
    logLine(string.format('Initiative: %d vs %d -> %s activates first.', a, b, sideName(winner)))
  end
end

local function unitLeadership(u)
  for _, m in ipairs(u.models or {}) do
    local v = statNum(modelStat(m, 'LD'))
    if v then return v end
  end
  return 10
end

local function belowHalf(side, i)
  local st = stateOf(side, i)
  return st and st.start > 0 and aliveTotal(side, i) * 2 < st.start
end

local function rallyAll(side)
  local a = S.armies[side]
  if not a then return end
  local out = {}
  for i, u in ipairs(a.units) do
    local st = stateOf(side, i)
    if st and st.tokens > 0 and aliveTotal(side, i) > 0 then
      local ld = unitLeadership(u) - (belowHalf(side, i) and 1 or 0)
      local r = twoD6()
      if r <= ld then
        st.tokens = 0
        out[#out + 1] = (u.displayName or u.unitName) .. ' ' .. r .. ' vs Ld ' .. ld .. ': rallies (tokens removed)'
      else
        out[#out + 1] = (u.displayName or u.unitName) .. ' ' .. r .. ' vs Ld ' .. ld .. ': keeps ' .. st.tokens .. ' token(s)' .. (st.tokens >= 2 and ' and flees' or '')
      end
    end
  end
  if #out == 0 then logLine(sideName(side) .. ': no unit carries a Battleshock token.')
  else logLine(sideName(side) .. ' Rally: ' .. table.concat(out, '; ')) end
end

local function reserveCount(side)
  local n = 0
  for _, st in ipairs(S.bs[side] or {}) do if st.reserve then n = n + 1 end end
  return n
end

local function reinforce(side)
  local g = gameOf()
  local row = g and g.reinforcement and g.reinforcement[math.min(S.round, #g.reinforcement)] or { dice = S.round, auto = 0 }
  local dice, entering = {}, 0
  for k = 1, row.dice do dice[k] = roll(); if dice[k] >= 4 then entering = entering + 1 end end
  local ds = {}
  for k, v in ipairs(dice) do ds[k] = tostring(v) end
  local inReserve = reserveCount(side)
  local total = math.min(inReserve, entering + row.auto)
  logLine(string.format('%s Reinforcement: [%s] -> %d on 4+ plus %d automatic = %d unit(s) may arrive (%d in reserve).',
    sideName(side), table.concat(ds, ' '), entering, row.auto, entering + row.auto, inReserve))
  return total
end

local function skipTokens()
  local c1, c2 = 0, 0
  for _, st in ipairs(S.bs[1] or {}) do if st.order ~= '' then c1 = c1 + 1 end end
  for _, st in ipairs(S.bs[2] or {}) do if st.order ~= '' then c2 = c2 + 1 end end
  local diff = math.abs(c1 - c2)
  local skips = math.ceil(diff / 2)
  local who = c1 < c2 and 1 or 2
  return c1, c2, (diff > 0) and who or 0, skips
end

local function addTokens(side, i, n)
  local st = stateOf(side, i)
  if not st then return end
  st.tokens = clamp(st.tokens + n, 0, 2)
  if st.tokens >= 2 and n > 0 then
    local u = unitOf(side, i)
    logLine((u.displayName or u.unitName) .. ' has 2 Battleshock tokens: Fleeing (D6+6" to the nearest friendly edge).')
  end
end

local function ordersList()
  local g = gameOf()
  local out = { '' }
  if g and g.orders then for _, o in ipairs(g.orders) do out[#out + 1] = o.name end end
  return out
end

local function cycleOrder(side, i)
  local st = stateOf(side, i)
  local list = ordersList()
  local at = 1
  for k, name in ipairs(list) do if name == st.order then at = k end end
  at = at % #list + 1
  st.order = list[at]
end

local function toggleDone(side, i)
  local st = stateOf(side, i)
  st.done = not st.done
  if st.done then expireEffects('activation', side, i) end
end

local function setAlive(side, i, j, delta)
  local st = stateOf(side, i)
  local u = unitOf(side, i)
  if not st or not u then return end
  local max = math.floor(tonumber(u.models[j].count) or 1)
  st.alive[j] = clamp((st.alive[j] or 0) + delta, 0, max)
  local before = belowHalf(side, i)
  if before and delta < 0 and aliveTotal(side, i) > 0 then
    logLine((u.displayName or u.unitName) .. ' is below half its Starting Strength: Leadership test (Ld -1 permanently), fail = 2 Battleshock tokens.')
  end
  if aliveTotal(side, i) == 0 then logLine((u.displayName or u.unitName) .. ' is destroyed.') end
end


-- ── casting: powers, prayers, pacts → targets, effects, automatic hits ──────────────────────────

local function listFor(u, kind)
  if kind == 'powers' then return u.powers or {} end
  if kind == 'prayers' then return u.prayers or {} end
  return u.pacts or {}
end

local PERILS = { 'Sucked into the Warp (Ld test: pass = 1 Mortal Wound/Hull Point, fail = removed)',
  'Mindsteal (1 Mortal Wound; the power cannot be used again this game)', 'Power Drain (1 Mortal Wound; -1D3 to all psychic tests this round)',
  'Psionic Feedback (1 Mortal Wound)', 'Empyrian Aftermath (Ld test, fail = 1 Mortal Wound)',
  'Warp Boost (Ld test: pass = +1 to hit and wound until its next activation, fail = 1 Mortal Wound)' }

local function applyPowerEffect(cs, ci, p, ts, ti)
  local tu = unitOf(ts, ti)
  local summary = {}
  local auto = parseAutoHits(p.effect)
  if auto then
    local weapon = { id = 'cast', name = p.name, range = '-', type = 'Melee', s = tostring(auto.s), ap = tostring(auto.ap), d = tostring(auto.d),
                     abilities = 'Auto Hit' .. (auto.seeking and ', Seeking' or '') }
    local c, err = buildAttack(cs, ci, 0, ts, ti, 1, { weapon = weapon, fixedAttacks = auto.n, cover = 0 })
    if c then
      local lines, removed = rollAttack(c)
      for _, l in ipairs(lines) do summary[#summary + 1] = l end
      if removed > 0 then
        local remaining = removed
        for j = #tu.models, 1, -1 do
          while remaining > 0 and stateOf(ts, ti).alive[j] > 0 do setAlive(ts, ti, j, -1); remaining = remaining - 1 end
        end
      end
    else summary[#summary + 1] = err end
  end
  local mods = parseEffect(p.effect)
  if mods.tokens > 0 then addTokens(ts, ti, mods.tokens); summary[#summary + 1] = 'Battleshock token(s): ' .. mods.tokens end
  local kind = durationKind(p.duration)
  if kind ~= 'instant' and not auto then
    addEffect(ts, ti, { name = p.name, text = p.effect, source = p.name, kind = kind, casterSide = cs, casterUnit = ci,
                        duration = p.duration or '' })
    summary[#summary + 1] = 'Status on ' .. (tu.displayName or tu.unitName) .. ': ' .. p.name .. ' (' .. (p.duration or '') .. ')'
  end
  if #mods.text > 0 then summary[#summary + 1] = 'Automated: ' .. table.concat(mods.text, ', ') end
  return summary
end

local function castPower(cs, ci, kind, idx, ts, ti)
  local cu = unitOf(cs, ci)
  local p = listFor(cu, kind)[idx]
  if not p then return end
  local cst = stateOf(cs, ci)
  cst.casts = cst.casts or {}
  local header = (cu.displayName or cu.unitName) .. ' -> ' .. p.name
  local lines = {}
  local ok = true
  local cv = plusValue(p.cast_value)
  if kind == 'powers' and cv then
    local tries = cst.casts[p.name] or 0
    cst.casts[p.name] = tries + 1
    local a, b = roll(), roll()
    local total = a + b - tries - (S.drain or 0)
    ok = total >= cv
    lines[#lines + 1] = string.format('Psychic test: %d+%d%s = %d vs %d+ -> %s', a, b, tries > 0 and (' -' .. tries .. ' (repeat)') or '', total, cv, cv, ok and 'manifested' or 'failed')
    if (a == 1 and b == 1) or (a == 6 and b == 6) then
      local r = roll()
      lines[#lines + 1] = 'PERILS OF THE WARP (' .. a .. a .. '): ' .. r .. ' = ' .. PERILS[r]
    end
  else
    lines[#lines + 1] = (kind == 'prayers' and 'Prayer' or 'Pact') .. ' invoked.'
  end
  if ok then
    for _, l in ipairs(applyPowerEffect(cs, ci, p, ts, ti)) do lines[#lines + 1] = l end
    -- "Self + Attached unit": the unit the caster leads gets the same status
    if cu.joinedTo and string.lower(p.target or ''):find('attached') and ts == cs and ti == ci then
      for k, other in ipairs(S.armies[cs].units) do
        if other.id == cu.joinedTo then
          local kind = durationKind(p.duration)
          if kind ~= 'instant' then
            addEffect(cs, k, { name = p.name, text = p.effect, source = p.name, kind = kind, casterSide = cs, casterUnit = ci, duration = p.duration or '' })
            lines[#lines + 1] = 'Also on the attached unit: ' .. (other.displayName or other.unitName)
          end
        end
      end
    end
  end
  logLine(header .. ': ' .. table.concat(lines, ' | '))
  return lines
end


-- ── missions & victory points ───────────────────────────────────────────────────────────────────

local function missionsFor(engagement)
  local g = gameOf()
  local out = {}
  for _, m in ipairs(g and g.missions or {}) do
    if not engagement or engagement == '' or string.lower(m.engagement):gsub('%s*battle', '') == string.lower(engagement):gsub('%s*battle', '') then
      out[#out + 1] = m
    end
  end
  if #out == 0 then return g and g.missions or {} end
  return out
end

local function currentMission()
  local list = missionsFor(nil)
  return list[clamp(S.mission, 1, math.max(1, #list))]
end

local function addVP(side, vp, why)
  S.vp[side] = S.vp[side] + vp
  logLine(sideName(side) .. ' ' .. (vp >= 0 and '+' or '') .. vp .. ' VP' .. (why and (' (' .. why .. ')') or '') .. ' = ' .. S.vp[side])
end

--- Attrition from the models removed: each destroyed unit is worth its points; at or below half strength, half.
local function attritionFor(victimSide)
  local a = S.armies[victimSide]
  if not a then return 0 end
  local total = 0
  for i, u in ipairs(a.units) do
    local st = stateOf(victimSide, i)
    local left = aliveTotal(victimSide, i)
    if st and st.start > 0 then
      if left == 0 then total = total + u.points
      elseif left * 2 <= st.start then total = total + math.floor(u.points / 2) end
    end
  end
  return total
end

local function secondaryOf(side) S.secondary[side] = S.secondary[side] or {}; return S.secondary[side] end

local function totals()
  local g = gameOf()
  local t = { 0, 0 }
  for side = 1, 2 do
    local foe = (side == 1) and 2 or 1
    t[side] = S.vp[side] + attritionFor(foe)
    for _, on in pairs(secondaryOf(side)) do if on then t[side] = t[side] + (g and g.scoring.secondaryVp or 200) end end
  end
  return t
end

local function verdict()
  local t = totals()
  local diff = t[1] - t[2]
  if diff >= 100 then return sideName(1) .. ' wins (' .. t[1] .. ' vs ' .. t[2] .. ')' end
  if -diff >= 100 then return sideName(2) .. ' wins (' .. t[2] .. ' vs ' .. t[1] .. ')' end
  return 'Draw (' .. t[1] .. ' vs ' .. t[2] .. '): a win needs at least 100 more VP.'
end


-- ── binder: miniatures on the table <-> units ───────────────────────────────────────────────────

local function boundObject(guid) return getObjectFromGUID(guid) end

local function slotsOf(u)
  local out = {}
  for j, m in ipairs(u.models or {}) do
    for _ = 1, math.max(1, math.floor(tonumber(m.count) or 1)) do out[#out + 1] = j end
  end
  return out
end

local function applyBinding(obj, side, ui, j)
  local u = unitOf(side, ui)
  local m = u.models[j] or u.models[1]
  local name = (u.displayName or u.unitName) .. ' - ' .. (m.name or '')
  pcall(function() obj.setName(name) end)
  pcall(function() obj.setDescription(modelText(side, ui, j)) end)
  pcall(function() obj.addTag(SPAWN_TAG) end)
  local c = SIDE_RGB[side]
  pcall(function() obj.setColorTint({ c[1], c[2], c[3] }) end)
  local guid = obj.getGUID()
  S.bindings[guid] = { side = side, unit = ui, model = j }
  local st = stateOf(side, ui)
  local found = false
  for _, g in ipairs(st.guids) do if g == guid then found = true end end
  if not found then st.guids[#st.guids + 1] = guid end
end

--- Bind the selected miniatures to a unit, in the order of its model groups (3 sergeants first, then 7 troopers...).
local function bindSelected(player, side, ui)
  local u = unitOf(side, ui)
  if not u then warn('Load an army and pick a unit first.'); return end
  local objs = player.getSelectedObjects()
  if not objs or #objs == 0 then warn('Select the miniatures on the table first (drag a box around them).'); return end
  -- reading order over the table: rows from the far edge down, then left to right. Rows are binned so the
  -- comparator is a strict ordering (a "close enough" test on z is not transitive and makes table.sort throw).
  local function rowOf(o) return math.floor(-o.getPosition().z / 1.2 + 0.5) end
  table.sort(objs, function(a, b)
    local ra, rb = rowOf(a), rowOf(b)
    if ra ~= rb then return ra < rb end
    local xa, xb = a.getPosition().x, b.getPosition().x
    if xa ~= xb then return xa < xb end
    return a.getGUID() < b.getGUID()
  end)
  local slots = slotsOf(u)
  for k, obj in ipairs(objs) do applyBinding(obj, side, ui, slots[math.min(k, #slots)] or 1) end
  say('Bound ' .. #objs .. ' miniature(s) to ' .. (u.displayName or u.unitName) .. (#objs ~= #slots and (' (the unit has ' .. #slots .. ' model(s))') or '') .. '.')
end

local function unbindSelected(player)
  local n = 0
  for _, obj in ipairs(player.getSelectedObjects() or {}) do
    local b = S.bindings[obj.getGUID()]
    if b then
      local st = stateOf(b.side, b.unit)
      if st then for k = #st.guids, 1, -1 do if st.guids[k] == obj.getGUID() then table.remove(st.guids, k) end end end
      S.bindings[obj.getGUID()] = nil
      n = n + 1
    end
  end
  say('Unbound ' .. n .. ' miniature(s).')
end


-- ── range rings ─────────────────────────────────────────────────────────────────────────────────

local function circlePoints(radius, scale, steps)
  local pts = {}
  steps = steps or 48
  for k = 0, steps do
    local ang = (k / steps) * 2 * math.pi
    pts[#pts + 1] = { x = math.cos(ang) * radius / scale, y = 0.15 / scale, z = math.sin(ang) * radius / scale }
  end
  return pts
end

local RING_COLORS = { move = { 0.3, 0.9, 0.4 }, advance = { 0.95, 0.9, 0.3 }, charge = { 0.95, 0.35, 0.3 } }
local WEAPON_COLORS = { { 0.35, 0.6, 1 }, { 0.8, 0.4, 1 }, { 1, 0.6, 0.2 }, { 0.3, 0.9, 0.9 } }

local function ringSpecs(side, ui)
  local u = unitOf(side, ui)
  local specs = {}
  local st = stateOf(side, ui)
  local m = u.models[1]
  local mv = statNum(modelStat(m, 'M')) or 0
  local rings = (st.rings or {})
  if rings.move and mv > 0 then specs[#specs + 1] = { r = mv, color = RING_COLORS.move, label = 'move ' .. mv } end
  if rings.advance and mv > 0 then specs[#specs + 1] = { r = mv + 6, color = RING_COLORS.advance, label = 'advance ' .. (mv + 6) } end
  if rings.charge and mv > 0 then specs[#specs + 1] = { r = math.min(mv, 12) + 6, color = RING_COLORS.charge, label = 'charge ' .. (math.min(mv, 12) + 6) } end
  local k = 0
  for idx, w in ipairs(u.weapons or {}) do
    if rings['w' .. idx] then
      local r = statNum(w.range)
      if r and r > 0 then k = k + 1; specs[#specs + 1] = { r = r, color = WEAPON_COLORS[((k - 1) % #WEAPON_COLORS) + 1], label = w.name .. ' ' .. r } end
    end
  end
  return specs
end

local function drawRings(side, ui)
  local st = stateOf(side, ui)
  local specs = ringSpecs(side, ui)
  local drawn = 0
  for _, guid in ipairs(st.guids) do
    local obj = boundObject(guid)
    if obj then
      local sc = 1
      pcall(function() sc = obj.getScale().x end)
      if not sc or sc == 0 then sc = 1 end
      local base = BASE_RADIUS_INCH
      pcall(function() local b = obj.getBounds(); if b and b.size then base = math.max(0.3, math.min(b.size.x, b.size.z) / 2) end end)
      local lines = {}
      for _, sp in ipairs(specs) do
        lines[#lines + 1] = { points = circlePoints(sp.r * UNIT_PER_INCH + base, sc, 48), color = sp.color, thickness = 0.12 / sc, rotation = { 0, 0, 0 } }
      end
      pcall(function() obj.setVectorLines(lines) end)
      drawn = drawn + 1
    end
  end
  return drawn
end

local function toggleRing(side, ui, key)
  local st = stateOf(side, ui)
  st.rings = st.rings or {}
  st.rings[key] = (not st.rings[key]) or nil
  drawRings(side, ui)
end

local function clearAllRings()
  for side = 1, 2 do
    for _, st in ipairs(S.bs[side] or {}) do
      st.rings = {}
      for _, guid in ipairs(st.guids) do
        local obj = boundObject(guid)
        if obj then pcall(function() obj.setVectorLines({}) end) end
      end
    end
  end
end

--- A miniature leaving the table counts as a casualty, in its unit's own model group.
function onObjectDestroy(obj)
  if not S then return end
  local ok, guid = pcall(function() return obj.getGUID() end)
  if not ok or not guid then return end
  local b = S.bindings[guid]
  if not b then return end
  S.bindings[guid] = nil
  local st = stateOf(b.side, b.unit)
  if st then for k = #st.guids, 1, -1 do if st.guids[k] == guid then table.remove(st.guids, k) end end end
  setAlive(b.side, b.unit, b.model, -1)
  if _G.uiRefresh then _G.uiRefresh() end
end


-- ── text paging ─────────────────────────────────────────────────────────────────────────────────

local function wrapText(text, width)
  local out = {}
  for line in (tostring(text or '') .. '\n'):gmatch('(.-)\n') do
    if #line <= width then out[#out + 1] = line
    else
      local cur = ''
      for word in line:gmatch('%S+') do
        if #cur + #word + 1 > width then out[#out + 1] = cur; cur = word
        else cur = (cur == '') and word or (cur .. ' ' .. word) end
      end
      if cur ~= '' then out[#out + 1] = cur end
    end
  end
  return out
end

local function pageOf(text, page, perPage, width)
  local lines = wrapText(text, width or TEXT_CHARS_PER_LINE)
  perPage = perPage or TEXT_LINES_PER_PAGE
  local pages = math.max(1, math.ceil(#lines / perPage))
  page = clamp(page, 1, pages)
  local from, to = (page - 1) * perPage + 1, math.min(#lines, page * perPage)
  local chunk = {}
  for k = from, to do chunk[#chunk + 1] = lines[k] end
  return table.concat(chunk, '\n'), page, pages
end


-- ── XML building blocks ─────────────────────────────────────────────────────────────────────────

local COL = { bg = '#12161CF2', panel = '#1C222B', text = '#E8E2D2', dim = '#9AA3AE', accent = '#E0A030', good = '#6CCB7A', bad = '#E26A5C', btn = '#2B3441', btnOn = '#7A5A1C' }

local function sepId(...)
  local parts = {}
  for i = 1, select('#', ...) do parts[i] = tostring((select(i, ...))) end
  return table.concat(parts, '__')
end

--- A button. `act` is the action name followed by its arguments (sepId'd into the element id).
local function btn(label, w, color, ...)
  return string.format('<Button id="%s" onClick="uiClick" preferredWidth="%d" preferredHeight="30" fontSize="13" colors="%s|%s|%s|%s" textColor="%s">%s</Button>',
    sepId(...), w or 90, color or COL.btn, COL.accent, COL.accent, COL.btn, COL.text, xmlEscape(label))
end

local function txt(text, size, color, height, align)
  return string.format('<Text fontSize="%d" color="%s" alignment="%s" preferredHeight="%d" horizontalOverflow="Wrap" verticalOverflow="Overflow">%s</Text>',
    size or 14, color or COL.text, align or 'UpperLeft', height or 22, xmlEscape(text))
end

local function row(inner, height)
  return string.format('<HorizontalLayout spacing="6" childForceExpandWidth="false" preferredHeight="%d" childAlignment="MiddleLeft">%s</HorizontalLayout>', height or 32, inner)
end

local function gap(h) return string.format('<Panel preferredHeight="%d" color="#00000000"></Panel>', h or 6) end

local function pager(pages)
  if pages <= 1 then return '' end
  return row(btn('<  page', 90, nil, 'pg', -1) .. btn('page  >', 90, nil, 'pg', 1) .. txt('page ' .. UI_STATE.page .. '/' .. pages, 13, COL.dim, 28), 32)
end

local TABS = { { 'army', 'ARMY' }, { 'rules', 'RULES' }, { 'binder', 'BINDER' }, { 'battle', 'BATTLE' },
               { 'attack', 'ATTACK' }, { 'powers', 'POWERS' }, { 'mission', 'MISSION' } }

local function curSelection()
  local side = UI_STATE.side
  local a = S.armies[side]
  if not a or #a.units == 0 then return side, 0, nil end
  UI_STATE.unit = clamp(UI_STATE.unit, 1, #a.units)
  return side, UI_STATE.unit, a.units[UI_STATE.unit]
end

local function unitSelector(prefix)
  local side, i, u = curSelection()
  local label = u and ((u.displayName or u.unitName) .. '  (' .. u.slot .. ', ' .. num(u.points) .. ' pts)') or '(no army loaded)'
  return row(
    btn(sideName(side), 80, side == 1 and '#6B4B14' or '#164C6B', prefix .. 'side') ..
    btn('<', 36, nil, prefix .. 'unit', -1) ..
    btn('>', 36, nil, prefix .. 'unit', 1) ..
    txt(label, 15, SIDE_COLOR[side], 28), 34)
end


-- ── tab contents ────────────────────────────────────────────────────────────────────────────────

local function tabArmy()
  local out = { txt('Load one army per side from a notebook tab (Notes -> add a tab named "Custom40k" / "Custom40k 2" and paste the JSON exported by the builder: Print View -> TTS).', 13, COL.dim, 40) }
  for side = 1, 2 do
    local a = S.armies[side]
    local head = a and (tostring(a.army.name) .. ' - ' .. tostring(a.army.faction) .. ' - ' .. #a.units .. ' units - ' .. num(a.army.totalPoints) .. '/' .. num(a.army.pointLimit) .. ' pts') or '(empty)'
    out[#out + 1] = row(txt(sideName(side), 16, SIDE_COLOR[side], 28) .. btn('LOAD', 90, nil, 'load', side) .. btn('Spawn cards', 110, nil, 'cards', side) .. btn('To notebook', 110, nil, 'notebook', side), 34)
    out[#out + 1] = txt(head, 14, COL.text, 26)
    if a then
      local lines = {}
      for i, u in ipairs(a.units) do lines[#lines + 1] = string.format('%d. %s (%s) %s pts%s', i, u.displayName or u.unitName, u.slot, num(u.points), u.joinedTo and ' [attached]' or '') end
      out[#out + 1] = txt(table.concat(lines, '\n', 1, math.min(#lines, 9)) .. (#lines > 9 and ('\n... +' .. (#lines - 9) .. ' more') or ''), 12, COL.dim, math.min(#lines, 10) * 17 + 6)
    end
    out[#out + 1] = gap(4)
  end
  return table.concat(out)
end

local GAME_TOPICS = { { 'phases', 'Phases' }, { 'orders', 'Orders' }, { 'meta', 'Reactions' }, { 'shock', 'Battleshock' }, { 'weapons', 'Weapon types' }, { 'score', 'Scoring' } }

local function gameText(topic)
  local g = gameOf()
  if not g then return 'Load an army: the rules of the turn come with the export.' end
  local out = {}
  if topic == 'phases' then
    out[#out + 1] = g.intro or ''
    for _, ph in ipairs(g.phases or {}) do
      out[#out + 1] = '\n== ' .. string.upper(ph.name) .. ' ==  ' .. (ph.summary or '')
      for _, st in ipairs(ph.steps or {}) do out[#out + 1] = '- ' .. st end
    end
  elseif topic == 'orders' or topic == 'meta' then
    for _, o in ipairs(topic == 'orders' and g.orders or g.metaOrders or {}) do
      out[#out + 1] = '\n== ' .. string.upper(o.name) .. ' ==  ' .. (o.prerequisite or '')
      for _, e in ipairs(o.effects or {}) do out[#out + 1] = '- ' .. e end
    end
    if topic == 'meta' and g.metaNote then out[#out + 1] = '\n' .. g.metaNote end
  elseif topic == 'shock' then
    local b = g.battleshock or {}
    for _, lv in ipairs(b.levels or {}) do
      out[#out + 1] = '\n== ' .. lv.tokens .. ' TOKEN(S): ' .. string.upper(lv.name) .. ' =='
      for _, e in ipairs(lv.effects or {}) do out[#out + 1] = '- ' .. e end
    end
    out[#out + 1] = '\n' .. (b.note or '')
  elseif topic == 'weapons' then
    local order = { 'Assault', 'Grenade', 'Heavy', 'Melee', 'Pistol', 'Rapid Fire' }
    for ord, tbl in pairs(g.weaponOrders or {}) do
      local ok = {}
      for _, t in ipairs(order) do if tbl[t] then ok[#ok + 1] = t end end
      out[#out + 1] = ord .. ': ' .. table.concat(ok, ', ')
    end
    table.sort(out)
    for _, n in ipairs(g.weaponTypeNotes or {}) do out[#out + 1] = '\n' .. n end
  else
    local sc = g.scoring or {}
    out[#out + 1] = (sc.attrition or '') .. '\n\n' .. (sc.objectives or '') .. '\n\n' .. (sc.winning or '')
    for _, s2 in ipairs(sc.secondary or {}) do out[#out + 1] = '\n' .. s2.name .. ': ' .. s2.text end
  end
  return table.concat(out, '\n')
end

local function tabRules()
  local side, i, u = curSelection()
  local mode = UI_STATE.rulesMode or 'unit'
  local out = {}
  local modes = row(btn('Datasheet', 90, mode == 'unit' and COL.btnOn or nil, 'rmode', 'unit') .. btn('Unit rules', 90, mode == 'rules' and COL.btnOn or nil, 'rmode', 'rules')
    .. btn('Statuses', 80, mode == 'status' and COL.btnOn or nil, 'rmode', 'status'), 34)
  local topics = {}
  for _, t in ipairs(GAME_TOPICS) do topics[#topics + 1] = btn(t[2], 92, mode == ('game:' .. t[1]) and COL.btnOn or nil, 'rmode', 'game:' .. t[1]) end
  local body
  if mode:sub(1, 5) == 'game:' then body = gameText(mode:sub(6))
  else
    out[#out + 1] = unitSelector('r')
    if not u then body = 'No army loaded.'
    elseif mode == 'rules' then
      local rl = ruleLines(side, u)
      body = (#rl == 0) and 'This unit lists no abilities or weapon abilities.' or table.concat(rl, '\n\n')
    elseif mode == 'status' then
      local list = effectsOf(side, i)
      local lines = {}
      for _, e in ipairs(list) do lines[#lines + 1] = e.name .. ' (' .. (e.duration or '') .. '): ' .. e.text end
      local m = modsFor(side, i)
      body = (#lines == 0 and 'No active statuses on this unit.' or table.concat(lines, '\n\n')) .. (#m.text > 0 and ('\n\nAutomated: ' .. table.concat(m.text, ', ')) or '')
    else body = unitCardText(u) end
  end
  local shown, page, pages = pageOf(body, UI_STATE.page)
  UI_STATE.page = page
  return modes .. row(table.concat(topics), 34) .. table.concat(out) .. txt(shown, 12, COL.text, TEXT_LINES_PER_PAGE * 16 + 8) .. pager(pages)
end

local function tabBinder()
  local side, i, u = curSelection()
  local out = { unitSelector('b') }
  if not u then return out[1] .. txt('Load an army first.', 14, COL.dim, 24) end
  local st = stateOf(side, i)
  local slots = slotsOf(u)
  local lines = {}
  for j, m in ipairs(u.models) do
    local bound = 0
    for _, g in ipairs(st.guids) do local b = S.bindings[g]; if b and b.model == j then bound = bound + 1 end end
    lines[#lines + 1] = string.format('%dx %s   bound %d/%d   alive %d', m.count, m.name .. ((m.loadoutName and m.loadoutName ~= m.name) and (' (' .. m.loadoutName .. ')') or ''), bound, math.floor(m.count), st.alive[j] or 0)
  end
  out[#out + 1] = txt('1. Select this unit\'s miniatures on the table (drag a box).   2. BIND.\nThey take the unit\'s name, datasheet and colour; removing one counts as a casualty.', 13, COL.dim, 38)
  out[#out + 1] = txt(table.concat(lines, '\n'), 13, COL.text, #lines * 18 + 6)
  out[#out + 1] = row(btn('BIND selection', 130, COL.btnOn, 'bind') .. btn('Unbind selection', 130, nil, 'unbind') ..
    btn('Bind + next unit', 140, nil, 'bindnext'), 36)
  local specs = {}
  out[#out + 1] = txt('Range rings (measured from the base edge, in inches):', 14, COL.accent, 24)
  local r = st.rings or {}
  out[#out + 1] = row(btn('Move', 80, r.move and COL.btnOn or nil, 'ring', 'move') .. btn('Advance', 80, r.advance and COL.btnOn or nil, 'ring', 'advance') ..
    btn('Charge', 80, r.charge and COL.btnOn or nil, 'ring', 'charge') .. btn('Clear all', 90, nil, 'ringclear'), 34)
  local wb = {}
  for idx, w in ipairs(u.weapons or {}) do
    if statNum(w.range) and statNum(w.range) > 0 and #wb < 10 then
      wb[#wb + 1] = btn(w.name .. ' ' .. w.range, 150, r['w' .. idx] and COL.btnOn or nil, 'ring', 'w' .. idx)
    end
  end
  for k = 1, #wb, 4 do out[#out + 1] = row(table.concat(wb, '', k, math.min(#wb, k + 3)), 34) end
  local _ = specs
  return table.concat(out)
end

local function unitLine(side, i, u)
  local st = stateOf(side, i)
  local bits = { string.format('%d/%d', aliveTotal(side, i), st.start) }
  if st.tokens > 0 then bits[#bits + 1] = (st.tokens >= 2 and 'FLEEING' or 'PINNED') end
  if st.order ~= '' then bits[#bits + 1] = st.order end
  if st.done then bits[#bits + 1] = 'done' end
  if st.reserve then bits[#bits + 1] = 'reserve' end
  local ef = effectsOf(side, i)
  if #ef > 0 then local n = {}; for _, e in ipairs(ef) do n[#n + 1] = e.name end; bits[#bits + 1] = '{' .. table.concat(n, ', ') .. '}' end
  if u.joinedTo then bits[#bits + 1] = '(attached)' end
  return string.format('%s%d. %s  %s', (i == UI_STATE.unit and side == UI_STATE.side) and '> ' or '  ', i, u.displayName or u.unitName, table.concat(bits, ' | '))
end

local function tabBattle()
  local ph = currentPhase()
  local g = gameOf()
  local out = {}
  local total = g and g.rounds or 5
  out[#out + 1] = row(txt('Round ' .. S.round .. '/' .. total, 18, COL.accent, 30) .. btn('< phase', 80, nil, 'phase', -1) .. btn('phase >', 80, COL.btnOn, 'phase', 1) ..
    btn('Roll initiative', 120, nil, 'init') .. txt(S.initiative ~= 0 and ('Initiative: ' .. sideName(S.initiative)) or 'Initiative: not rolled', 14, S.initiative ~= 0 and SIDE_COLOR[S.initiative] or COL.dim, 28), 34)
  if ph then
    out[#out + 1] = txt(string.upper(ph.name) .. ' PHASE  -  ' .. (ph.summary or ''), 14, COL.accent, 24)
    local key = ph.key
    local steps = {}
    for _, s2 in ipairs(ph.steps or {}) do steps[#steps + 1] = '- ' .. s2 end
    local stepText = table.concat(steps, '\n')
    local shown, page, pages = pageOf(stepText, UI_STATE.page, 5, 130)
    UI_STATE.page = page
    out[#out + 1] = txt(shown, 12, COL.text, 5 * 16 + 6) .. pager(pages)
    if key == 'rally' then out[#out + 1] = row(btn('Rally Side 1', 110, nil, 'rally', 1) .. btn('Rally Side 2', 110, nil, 'rally', 2), 34)
    elseif key == 'reinforcement' then out[#out + 1] = row(btn('Reinforce Side 1', 130, nil, 'reinf', 1) .. btn('Reinforce Side 2', 130, nil, 'reinf', 2), 34)
    elseif key == 'command' then
      local c1, c2, who, skips = skipTokens()
      out[#out + 1] = txt(string.format('Orders placed: Side 1 = %d, Side 2 = %d.  %s', c1, c2, who ~= 0 and (sideName(who) .. ' receives ' .. skips .. ' Skip token(s).') or 'No Skip tokens.'), 13, COL.good, 22)
    end
  else
    out[#out + 1] = txt('Load an army to get the phases of the round.', 14, COL.dim, 24)
  end
  local side, i, u = curSelection()
  out[#out + 1] = unitSelector('t')
  if u then
    local st = stateOf(side, i)
    out[#out + 1] = row(btn('Order: ' .. (st.order == '' and 'none' or st.order), 190, nil, 'order') ..
      btn('Done', 60, st.done and COL.btnOn or nil, 'done') .. btn('Reserve', 76, st.reserve and COL.btnOn or nil, 'reserve') ..
      btn('Token +', 74, nil, 'tok', 1) .. btn('Token -', 74, nil, 'tok', -1) .. btn('Clear fx', 76, nil, 'fxclear'), 34)
    local mb = {}
    for j, m in ipairs(u.models) do
      mb[#mb + 1] = btn(string.format('%s -1 (%d)', m.name:sub(1, 16), st.alive[j] or 0), 150, nil, 'alive', j, -1) .. btn('+', 30, nil, 'alive', j, 1)
    end
    for k = 1, math.min(#mb, 6), 2 do out[#out + 1] = row(table.concat(mb, '', k, math.min(#mb, k + 1)), 34) end
    local w = effectiveWard(side, i)
    local m = modsFor(side, i)
    out[#out + 1] = txt('Ward now: ' .. (w and (w .. '+') or 'none') .. (#m.text > 0 and ('    Automated: ' .. table.concat(m.text, ', ')) or ''), 12, COL.dim, 20)
  end
  local a = S.armies[UI_STATE.side]
  if a then
    local lines = {}
    local first = math.max(1, UI_STATE.unit - 3)
    for k = first, math.min(#a.units, first + 7) do lines[#lines + 1] = unitLine(UI_STATE.side, k, a.units[k]) end
    out[#out + 1] = txt(table.concat(lines, '\n'), 12, COL.text, #lines * 16 + 6)
  end
  local lastLog = {}
  for k = math.max(1, #S.log - 2), #S.log do lastLog[#lastLog + 1] = S.log[k] end
  out[#out + 1] = txt(table.concat(lastLog, '\n'), 11, COL.dim, 48)
  return table.concat(out)
end

local COVER_LABEL = { [0] = 'no cover', [1] = 'light cover', [2] = 'heavy cover' }
local ORDER_CYCLE = { '', 'Stand & Shoot', 'Move & Shoot', 'Advance', 'Charge', 'Fight' }

local function atkOpts()
  local A = UI_STATE.atk
  return { cover = A.cover, takeCover = A.takeCover, halfRange = A.halfRange, facing = A.facing, copies = A.copies,
           manualHit = A.mHit or 0, manualWound = A.mWound or 0, manualAp = A.mAp or 0, order = (A.order ~= '' and A.order or nil) }
end

local function tabAttack()
  local A = UI_STATE.atk
  local sa, ia = UI_STATE.side, UI_STATE.unit
  local ua = unitOf(sa, ia)
  local out = { unitSelector('a') }
  if not ua then return out[1] .. txt('Load an army first.', 14, COL.dim, 24) end
  A.weapon = clamp(A.weapon, 1, math.max(1, #(ua.weapons or {})))
  local w = ua.weapons and ua.weapons[A.weapon]
  out[#out + 1] = row(btn('<', 36, nil, 'awp', -1) .. btn('>', 36, nil, 'awp', 1) ..
    txt(w and (w.name .. '   ' .. joinParts(' ', w.range, w.type, 'S' .. tostring(w.s), 'AP' .. tostring(w.ap), 'D' .. tostring(w.d), isBlank(w.abilities) and '' or ('(' .. w.abilities .. ')'))) or 'This unit has no weapons.', 13, COL.text, 28), 34)
  local da = S.armies[A.defSide]
  A.defUnit = da and clamp(A.defUnit, 1, math.max(1, #da.units)) or 1
  local ud = unitOf(A.defSide, A.defUnit)
  A.defModel = ud and clamp(A.defModel, 1, math.max(1, #ud.models)) or 1
  out[#out + 1] = row(txt('Target:', 13, COL.dim, 28) .. btn(sideName(A.defSide), 72, nil, 'dside') .. btn('<', 32, nil, 'dunit', -1) .. btn('>', 32, nil, 'dunit', 1) ..
    txt(ud and ((ud.displayName or ud.unitName) .. '  [' .. (ud.models[A.defModel] and ud.models[A.defModel].name or '') .. ']') or '(no target army)', 13, SIDE_COLOR[A.defSide], 28) ..
    btn('model', 60, nil, 'dmodel'), 34)
  out[#out + 1] = row(btn(COVER_LABEL[A.cover], 100, nil, 'cover') .. btn('Take Cover', 90, A.takeCover and COL.btnOn or nil, 'takecover') ..
    btn('Half range', 90, A.halfRange and COL.btnOn or nil, 'half') .. btn('Facing: ' .. A.facing, 110, nil, 'facing') ..
    btn('Order: ' .. (A.order == '' and 'any' or A.order), 150, nil, 'aorder') .. btn('Copies ' .. (A.copies == 0 and 'auto' or A.copies), 100, nil, 'copies'), 34)
  out[#out + 1] = row(btn('hit -', 50, nil, 'man', 'mHit', -1) .. btn('hit +', 50, nil, 'man', 'mHit', 1) .. btn('wound -', 58, nil, 'man', 'mWound', -1) .. btn('wound +', 58, nil, 'man', 'mWound', 1) ..
    btn('AP -', 46, nil, 'man', 'mAp', -1) .. btn('AP +', 46, nil, 'man', 'mAp', 1) ..
    txt('manual: hit ' .. signed(A.mHit or 0) .. '  wound ' .. signed(A.mWound or 0) .. '  AP ' .. signed(A.mAp or 0), 12, COL.dim, 28), 34)
  out[#out + 1] = row(btn('EXPECTED', 110, COL.btnOn, 'expect') .. btn('ROLL IT', 100, COL.btnOn, 'rollit') .. btn('Apply casualties', 130, nil, 'applycas'), 36)
  local res = A.lastResult or ''
  out[#out + 1] = txt(res, 12, COL.text, 190)
  return table.concat(out)
end

local function tabPowers()
  local side, i, u = curSelection()
  local P = UI_STATE.pw
  local out = { unitSelector('q') }
  if not u then return out[1] .. txt('Load an army first.', 14, COL.dim, 24) end
  local kinds = { { 'powers', 'Psychic' }, { 'prayers', 'Prayers' }, { 'pacts', 'Pacts' } }
  local kb = {}
  for _, k in ipairs(kinds) do kb[#kb + 1] = btn(k[2] .. ' (' .. #listFor(u, k[1]) .. ')', 110, P.kind == k[1] and COL.btnOn or nil, 'pkind', k[1]) end
  out[#out + 1] = row(table.concat(kb), 34)
  local list = listFor(u, P.kind)
  P.idx = clamp(P.idx, 1, math.max(1, #list))
  local p = list[P.idx]
  if p then
    out[#out + 1] = row(btn('<', 36, nil, 'pidx', -1) .. btn('>', 36, nil, 'pidx', 1) .. txt(p.name .. '  ' .. P.idx .. '/' .. #list, 15, COL.accent, 28), 34)
    out[#out + 1] = txt(powerText(p), 12, COL.text, 112)
  else
    out[#out + 1] = txt('This unit has none of those.', 14, COL.dim, 24)
  end
  local tg = S.armies[P.tSide]
  P.tUnit = tg and clamp(P.tUnit, 1, math.max(1, #tg.units)) or 1
  local tu = unitOf(P.tSide, P.tUnit)
  out[#out + 1] = row(txt('Target:', 13, COL.dim, 28) .. btn(sideName(P.tSide), 72, nil, 'pside') .. btn('<', 32, nil, 'ptu', -1) .. btn('>', 32, nil, 'ptu', 1) ..
    txt(tu and (tu.displayName or tu.unitName) or '(none)', 14, SIDE_COLOR[P.tSide], 28) .. btn('CAST / USE', 120, COL.btnOn, 'cast'), 36)
  if tu then
    local lines = {}
    for k, e in ipairs(effectsOf(P.tSide, P.tUnit)) do lines[#lines + 1] = e.name .. ' (' .. (e.duration or '') .. ')' end
    out[#out + 1] = row(txt('On target: ' .. (#lines == 0 and 'no statuses' or table.concat(lines, ', ')), 12, COL.dim, 28) .. btn('Clear target fx', 120, nil, 'tfxclear'), 32)
  end
  out[#out + 1] = txt(P.last or '', 12, COL.text, 120)
  return table.concat(out)
end

local function tabMission()
  local g = gameOf()
  local out = {}
  if not g then return txt('Load an army to get the missions.', 14, COL.dim, 24) end
  local list = missionsFor(nil)
  S.mission = clamp(S.mission, 1, math.max(1, #list))
  local m = list[S.mission]
  out[#out + 1] = row(btn('<', 36, nil, 'mis', -1) .. btn('>', 36, nil, 'mis', 1) .. txt((m.engagement or '') .. ' - ' .. m.name, 16, COL.accent, 28), 34)
  local body = 'SET UP\n- ' .. table.concat(m.setup or {}, '\n- ') .. '\n\nVICTORY\n' .. (m.victory or '')
  local shown, page, pages = pageOf(body, UI_STATE.page, 8, 140)
  UI_STATE.page = page
  out[#out + 1] = txt(shown, 12, COL.text, 8 * 16 + 6) .. pager(pages)
  for side = 1, 2 do
    local bs = {}
    for k, sc in ipairs(m.scoring or {}) do bs[#bs + 1] = btn('+' .. sc.vp .. ' ' .. sc.label, 190, nil, 'vp', side, k) end
    bs[#bs + 1] = btn('+50', 50, nil, 'vpm', side, 50) .. btn('-50', 50, nil, 'vpm', side, -50)
    out[#out + 1] = row(txt(sideName(side) .. ': ' .. S.vp[side], 14, SIDE_COLOR[side], 28) .. table.concat(bs, '', 1, math.min(#bs, 3)), 34)
  end
  for side = 1, 2 do
    local bs = {}
    for k, s2 in ipairs(g.scoring.secondary or {}) do
      local on = secondaryOf(side)[s2.name]
      bs[#bs + 1] = btn(s2.name, 120, on and COL.btnOn or nil, 'sec', side, k)
    end
    out[#out + 1] = row(txt(sideName(side) .. ' secondary:', 12, COL.dim, 28) .. table.concat(bs), 34)
  end
  local t = totals()
  out[#out + 1] = txt(string.format('Totals (VP pad + attrition + secondary): Side 1 = %d  |  Side 2 = %d      Attrition: Side 1 earns %d, Side 2 earns %d', t[1], t[2], attritionFor(2), attritionFor(1)), 13, COL.good, 24)
  out[#out + 1] = row(txt(verdict(), 15, COL.accent, 28) .. btn('Reset game', 100, COL.bad, 'reset'), 34)
  return table.concat(out)
end

local TAB_BUILDERS = { army = tabArmy, rules = tabRules, binder = tabBinder, battle = tabBattle, attack = tabAttack, powers = tabPowers, mission = tabMission }

local function buildXml()
  local toggle = string.format('<Button id="%s" onClick="uiClick" rectAlignment="UpperRight" offsetXY="-12 -12" width="86" height="34" fontSize="14" colors="%s|%s|%s|%s" textColor="%s">C40K</Button>',
    sepId('toggle'), COL.btnOn, COL.accent, COL.accent, COL.btnOn, COL.text)
  if not UI_STATE.open then return '<Defaults></Defaults>' .. toggle end
  local tabs = {}
  for _, t in ipairs(TABS) do tabs[#tabs + 1] = btn(t[2], 98, UI_STATE.tab == t[1] and COL.btnOn or nil, 'tab', t[1]) end
  local okc, content = pcall(TAB_BUILDERS[UI_STATE.tab] or tabArmy)
  if not okc then content = txt('Internal error: ' .. tostring(content), 12, COL.bad, 60) end
  return '<Defaults></Defaults>' .. toggle ..
    string.format('<Panel id="c40k" rectAlignment="MiddleRight" offsetXY="-12 -20" width="900" height="720" color="%s" allowDragging="true" returnToOriginalPositionWhenReleased="false" padding="10 10 10 10">', COL.bg) ..
    '<VerticalLayout spacing="4" childForceExpandHeight="false" padding="8 8 8 8">' ..
    row(txt('Custom40k Table', 20, COL.accent, 34), 38) ..
    row(table.concat(tabs), 36) ..
    content ..
    '</VerticalLayout></Panel>'
end

function uiRefresh()
  if not S then return end
  local ok, xml = pcall(buildXml)
  if not ok then warn('UI error: ' .. tostring(xml)); return end
  UI.setXml(xml)
end

local function lastLines(tbl) return table.concat(tbl, '\n') end

local function spawnCards(side)
  local a = S.armies[side]
  if not a then warn('Load an army first.'); return end
  for k, u in ipairs(a.units) do
    local col, rowN = (k - 1) % GRID_COLS, math.floor((k - 1) / GRID_COLS)
    local o = spawnObject({ type = 'Notecard', position = { x = GRID_ORIGIN.x + col * GRID_DX, y = GRID_ORIGIN.y, z = GRID_ORIGIN.z - rowN * GRID_DZ + (side == 2 and 12 or 0) }, rotation = { 0, 180, 0 } })
    o.setName(u.displayName or u.unitName)
    o.setDescription(unitCardText(u))
    o.addTag(SPAWN_TAG)
  end
  say('Spawned ' .. #a.units .. ' card(s) for ' .. sideName(side) .. '.')
end

local function toNotebook(side)
  local a = S.armies[side]
  if not a then warn('Load an army first.'); return end
  local parts = {}
  for _, u in ipairs(a.units) do parts[#parts + 1] = unitCardText(u) .. '\n\nRULES\n' .. table.concat(ruleLines(side, u), '\n') end
  Notes.addNotebookTab({ title = 'C40K ' .. (a.army.name or 'army') .. ' (' .. side .. ')', body = table.concat(parts, '\n\n==========\n\n'), color = 'Grey' })
  say('Datasheets and rules written to the notebook.')
end


-- ── actions ─────────────────────────────────────────────────────────────────────────────────────

local function resetGame()
  local keepArmies, keepBs = S.armies, S.bs
  local fresh = freshState()
  fresh.armies = keepArmies
  fresh.bs = {}
  for side = 1, 2 do
    fresh.bs[side] = {}
    for i, u in ipairs((keepArmies[side] or { units = {} }).units) do
      local st = freshUnitState(u)
      local old = keepBs[side] and keepBs[side][i]
      if old then st.guids = old.guids end
      fresh.bs[side][i] = st
    end
  end
  fresh.bindings = S.bindings
  S = fresh
  clearAllRings()
  say('Game reset: round 1, victory points 0. Bindings are kept.')
end

local function stepSel(delta)
  local a = S.armies[UI_STATE.side]
  local n = a and #a.units or 0
  if n == 0 then return end
  UI_STATE.unit = ((UI_STATE.unit - 1 + delta) % n) + 1
  UI_STATE.page = 1
end

local ACTION = {}
ACTION.toggle = function() UI_STATE.open = not UI_STATE.open end
ACTION.tab = function(_, t) UI_STATE.tab = t; UI_STATE.page = 1 end
ACTION.pg = function(_, d) UI_STATE.page = math.max(1, UI_STATE.page + tonumber(d)) end
ACTION.load = function(_, side) loadFromTab(tonumber(side)) end
ACTION.cards = function(_, side) spawnCards(tonumber(side)) end
ACTION.notebook = function(_, side) toNotebook(tonumber(side)) end
for _, p in ipairs({ 'r', 'b', 't', 'a', 'q' }) do
  ACTION[p .. 'side'] = function() UI_STATE.side = (UI_STATE.side == 1) and 2 or 1; UI_STATE.unit = 1; UI_STATE.page = 1 end
  ACTION[p .. 'unit'] = function(_, d) stepSel(tonumber(d)) end
end
ACTION.rmode = function(_, m) UI_STATE.rulesMode = m; UI_STATE.page = 1 end
ACTION.bind = function(pl)
  local side, i = curSelection()
  bindSelected(pl, side, i)
end
ACTION.bindnext = function(pl)
  local side, i = curSelection()
  bindSelected(pl, side, i)
  stepSel(1)
end
ACTION.unbind = function(pl) unbindSelected(pl) end
ACTION.ring = function(_, key) local side, i = curSelection(); if i > 0 then toggleRing(side, i, key) end end
ACTION.ringclear = function() clearAllRings() end
ACTION.phase = function(_, d) if tonumber(d) > 0 then nextPhase() else prevPhase() end; UI_STATE.page = 1 end
ACTION.init = function() rollInitiative() end
ACTION.rally = function(_, side) rallyAll(tonumber(side)) end
ACTION.reinf = function(_, side) reinforce(tonumber(side)) end
ACTION.order = function() local side, i = curSelection(); if i > 0 then cycleOrder(side, i) end end
ACTION.done = function() local side, i = curSelection(); if i > 0 then toggleDone(side, i) end end
ACTION.reserve = function() local side, i = curSelection(); if i > 0 then local st = stateOf(side, i); st.reserve = not st.reserve end end
ACTION.tok = function(_, d) local side, i = curSelection(); if i > 0 then addTokens(side, i, tonumber(d)) end end
ACTION.fxclear = function() local side, i = curSelection(); if i > 0 then S.bs[side][i].effects = {} end end
ACTION.alive = function(_, j, d) local side, i = curSelection(); if i > 0 then setAlive(side, i, tonumber(j), tonumber(d)) end end

ACTION.awp = function(_, d) UI_STATE.atk.weapon = UI_STATE.atk.weapon + tonumber(d) end
ACTION.dside = function() UI_STATE.atk.defSide = (UI_STATE.atk.defSide == 1) and 2 or 1; UI_STATE.atk.defUnit = 1; UI_STATE.atk.defModel = 1 end
ACTION.dunit = function(_, d)
  local da = S.armies[UI_STATE.atk.defSide]
  if da then UI_STATE.atk.defUnit = ((UI_STATE.atk.defUnit - 1 + tonumber(d)) % #da.units) + 1; UI_STATE.atk.defModel = 1 end
end
ACTION.dmodel = function()
  local ud = unitOf(UI_STATE.atk.defSide, UI_STATE.atk.defUnit)
  if ud then UI_STATE.atk.defModel = (UI_STATE.atk.defModel % #ud.models) + 1 end
end
ACTION.cover = function() UI_STATE.atk.cover = (UI_STATE.atk.cover + 1) % 3 end
ACTION.takecover = function() UI_STATE.atk.takeCover = not UI_STATE.atk.takeCover end
ACTION.half = function() UI_STATE.atk.halfRange = not UI_STATE.atk.halfRange end
ACTION.facing = function() local A = UI_STATE.atk; A.facing = (A.facing == 'front') and 'side' or (A.facing == 'side') and 'rear' or 'front' end
ACTION.aorder = function()
  local A = UI_STATE.atk
  local at = 1
  for k, o in ipairs(ORDER_CYCLE) do if o == A.order then at = k end end
  A.order = ORDER_CYCLE[(at % #ORDER_CYCLE) + 1]
end
ACTION.copies = function() local A = UI_STATE.atk; A.copies = (A.copies + 1) % 11 end
ACTION.man = function(_, key, d) local A = UI_STATE.atk; A[key] = clamp((A[key] or 0) + tonumber(d), -4, 4) end

local function currentAttack()
  local A = UI_STATE.atk
  return buildAttack(UI_STATE.side, UI_STATE.unit, A.weapon, A.defSide, A.defUnit, A.defModel, atkOpts())
end

ACTION.expect = function()
  local A = UI_STATE.atk
  local c, err = currentAttack()
  if not c then A.lastResult = err; A.pending = nil; return end
  local lines = expectAttack(c)
  for _, wline in ipairs(c.why) do lines[#lines + 1] = '  . ' .. wline end
  for _, n in ipairs(c.notes) do lines[#lines + 1] = '  ! ' .. n end
  A.lastResult = table.concat(lines, '\n')
  A.pending = nil
end
ACTION.rollit = function()
  local A = UI_STATE.atk
  local c, err = currentAttack()
  if not c then A.lastResult = err; A.pending = nil; return end
  local lines, removed, lost = rollAttack(c)
  for _, n in ipairs(c.notes) do lines[#lines + 1] = '  ! ' .. n end
  A.lastResult = table.concat(lines, '\n') .. '\n(press "Apply casualties" to remove ' .. removed .. ' model(s)' .. (lost > 0 and (' / ' .. lost .. ' Hull Point(s)') or '') .. ')'
  A.pending = { removed = removed, lost = lost, side = A.defSide, unit = A.defUnit, model = A.defModel }
  logLine((unitOf(UI_STATE.side, UI_STATE.unit).displayName or '') .. ' fires ' .. c.w.name .. ' at ' .. (c.unitD.displayName or c.unitD.unitName) .. ': ' .. removed .. ' casualty(ies).')
end
ACTION.applycas = function()
  local A = UI_STATE.atk
  local p = A.pending
  if not p then return end
  local remaining = p.removed
  local u = unitOf(p.side, p.unit)
  local st = stateOf(p.side, p.unit)
  if u and st then
    -- the targeted model group first, then the rest (the owner picks casualties, cheapest groups last)
    local order = { p.model }
    for j = 1, #u.models do if j ~= p.model then order[#order + 1] = j end end
    for _, j in ipairs(order) do
      while remaining > 0 and st.alive[j] > 0 do setAlive(p.side, p.unit, j, -1); remaining = remaining - 1 end
    end
    if p.lost > 0 and isVehicleUnit(u) then say('Hull Points lost: ' .. p.lost .. ' (track them on the vehicle).') end
  end
  A.pending = nil
  A.lastResult = A.lastResult .. '\nApplied.'
end

ACTION.pkind = function(_, k) UI_STATE.pw.kind = k; UI_STATE.pw.idx = 1 end
ACTION.pidx = function(_, d) UI_STATE.pw.idx = UI_STATE.pw.idx + tonumber(d) end
ACTION.pside = function() UI_STATE.pw.tSide = (UI_STATE.pw.tSide == 1) and 2 or 1; UI_STATE.pw.tUnit = 1 end
ACTION.ptu = function(_, d)
  local a = S.armies[UI_STATE.pw.tSide]
  if a then UI_STATE.pw.tUnit = ((UI_STATE.pw.tUnit - 1 + tonumber(d)) % #a.units) + 1 end
end
ACTION.cast = function()
  local P = UI_STATE.pw
  local side, i = curSelection()
  if i == 0 or not unitOf(P.tSide, P.tUnit) then return end
  local lines = castPower(side, i, P.kind, P.idx, P.tSide, P.tUnit)
  P.last = lines and table.concat(lines, '\n') or ''
end
ACTION.tfxclear = function() local P = UI_STATE.pw; if unitOf(P.tSide, P.tUnit) then S.bs[P.tSide][P.tUnit].effects = {} end end

ACTION.mis = function(_, d) local n = #missionsFor(nil); S.mission = ((S.mission - 1 + tonumber(d)) % math.max(1, n)) + 1; UI_STATE.page = 1 end
ACTION.vp = function(_, side, k)
  local m = currentMission()
  local sc = m and m.scoring and m.scoring[tonumber(k)]
  if sc then addVP(tonumber(side), sc.vp, sc.label) end
end
ACTION.vpm = function(_, side, vp) addVP(tonumber(side), tonumber(vp), 'manual') end
ACTION.sec = function(_, side, k)
  local g = gameOf()
  local name = g and g.scoring.secondary[tonumber(k)].name
  if name then local t = secondaryOf(tonumber(side)); t[name] = (not t[name]) or nil end
end
ACTION.reset = function() resetGame() end

function uiClick(player, _, id)
  if not S then return end
  local parts = {}
  for p in tostring(id):gmatch('[^_]+') do parts[#parts + 1] = p end
  -- ids are joined with a double underscore; single underscores never appear in names we generate
  local name = parts[1]
  local fn = ACTION[name]
  if fn then
    local ok, e = pcall(fn, player, unpack(parts, 2))
    if not ok then warn('Action ' .. tostring(name) .. ' failed: ' .. tostring(e)) end
  end
  uiRefresh()
end


-- ── TTS entry points ────────────────────────────────────────────────────────────────────────────

function onSave()
  if not S then return '' end
  local ok, enc = pcall(function() return JSON.encode(S) end)
  return ok and enc or ''
end

function onLoad(saved)
  S = freshState()
  UI_STATE.pw = { kind = 'powers', idx = 1, tSide = 2, tUnit = 1, last = '' }
  if saved and saved ~= '' then
    local ok, data = pcall(function() return JSON.decode(saved) end)
    if ok and type(data) == 'table' and data.armies then
      S = data
      S.bindings = S.bindings or {}; S.log = S.log or {}; S.vp = S.vp or { 0, 0 }; S.secondary = S.secondary or { {}, {} }
      S.bs = S.bs or {}; S.round = S.round or 1; S.phase = S.phase or 1; S.mission = S.mission or 1
      -- JSON turns the integer keys of the two sides into strings; put them back
      for _, key in ipairs({ 'armies', 'bs' }) do
        local fixed = {}
        for k, v in pairs(S[key]) do fixed[tonumber(k) or k] = v end
        S[key] = fixed
      end
    end
  end
  S.armies = S.armies or {}
  ensureTabs()
  -- the UI layer is not always ready on the very first frame of a load
  if Wait and Wait.frames then Wait.frames(function() uiRefresh() end, 10) else uiRefresh() end
  say('Custom40k Table ready. Open the menu with the C40K button (top right).')
end


-- Exposed for tts/test/run_table.cjs (headless). TTS ignores it.
C40K = { buildAttack = buildAttack, expectAttack = expectAttack, rollAttack = rollAttack, parseAbilities = parseAbilities,
         parseEffect = parseEffect, parseAutoHits = parseAutoHits, woundNeed = woundNeed, effectiveWard = effectiveWard,
         modsFor = modsFor, attritionFor = attritionFor, totals = totals, verdict = verdict, getState = function() return S end,
         getUI = function() return UI_STATE end, buildXml = buildXml, castPower = castPower, rollInitiative = rollInitiative,
         reinforce = reinforce, rallyAll = rallyAll, nextPhase = nextPhase, skipTokens = skipTokens, addEffect = addEffect }
