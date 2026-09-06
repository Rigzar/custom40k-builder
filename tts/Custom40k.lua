--[[
  Custom40k — Tabletop Simulator army loader
  ------------------------------------------------------------------------------------------------
  Paste this into the script of ONE object (a tablet, a tile, anything). That object becomes the
  loader: it grows three buttons and spawns your army as physical cards on the table.

  It carries NO codex. The builder app exports an army that is already fully RESOLVED — final
  stats after wargear and army traits, final weapon profiles, the actual rules text — so this
  script never has to know a single Custom40k rule and never needs re-uploading when a codex
  changes. See src/utils/ttsExport.ts on the app side; `SCHEMA` below must match its `TTS_SCHEMA`.

  HOW TO GET AN ARMY IN
    1. In the builder: open Print View, press TTS. A .json file downloads.
    2. In TTS: Notes (the notebook, top-right) -> add a tab called  Custom40k
       and paste the whole file into its body.  (A plain https:// URL to the JSON also works.)
    3. Click LOAD ARMY on this object.

  Everything spawned is tagged, so CLEAR ARMY removes exactly what this script made and nothing
  else on the table.
--]]

local SCHEMA        = 1
local NOTEBOOK_TAB  = 'Custom40k'   -- tab this script reads the army from
local SPAWN_TAG     = 'c40k_spawn'  -- so CLEAR only ever deletes our own objects

-- Card grid, in table units, laid out in front of the loader object.
local GRID_COLS   = 6
local GRID_DX     = 2.6
local GRID_DZ     = 3.6
local GRID_ORIGIN = { x = -6.5, y = 1.2, z = 3.0 }

local spawnedGuids = {}   -- persisted so CLEAR still works after a save/reload


-- ── persistence ─────────────────────────────────────────────────────────────────────────────────

function onSave()
  return JSON.encode({ spawnedGuids = spawnedGuids })
end

function onLoad(saved)
  if saved and saved ~= '' then
    local ok, state = pcall(function() return JSON.decode(saved) end)
    if ok and state and state.spawnedGuids then spawnedGuids = state.spawnedGuids end
  end
  buildButtons()
end

function buildButtons()
  self.clearButtons()
  self.createButton({
    click_function = 'btnLoad', function_owner = self, label = 'LOAD ARMY',
    position = { 0, 0.3, -0.7 }, width = 1100, height = 320, font_size = 180,
    color = { 0.55, 0.13, 0.13 }, font_color = { 1, 0.93, 0.8 },
    tooltip = 'Read the "' .. NOTEBOOK_TAB .. '" notebook tab and spawn the army',
  })
  self.createButton({
    click_function = 'btnRules', function_owner = self, label = 'RULES -> NOTEBOOK',
    position = { 0, 0.3, 0.0 }, width = 1100, height = 320, font_size = 150,
    color = { 0.18, 0.18, 0.2 }, font_color = { 0.9, 0.9, 0.9 },
    tooltip = 'Write prayers / pacts / psychic disciplines into notebook tabs',
  })
  self.createButton({
    click_function = 'btnClear', function_owner = self, label = 'CLEAR ARMY',
    position = { 0, 0.3, 0.7 }, width = 1100, height = 320, font_size = 150,
    color = { 0.2, 0.2, 0.2 }, font_color = { 0.85, 0.85, 0.85 },
    tooltip = 'Delete only the cards this loader spawned',
  })
end


-- ── small helpers ───────────────────────────────────────────────────────────────────────────────

local function trim(s) return (tostring(s or ''):gsub('^%s+', ''):gsub('%s+$', '')) end

local function isBlank(s) s = trim(s); return s == '' or s == '-' end

--- Format a JSON number as a game value. JSON has no integer type, so points and model counts can
--- arrive as floats and print as "150.0"; every number in an army list is a whole number.
local function num(v)
  if type(v) ~= 'number' then return tostring(v or '') end
  if v == math.floor(v) then return string.format('%d', v) end
  return tostring(v)
end

--- Join the non-empty arguments with `sep`.
--- VARIADIC ON PURPOSE: an earlier version took a table, and `ipairs` silently stopped at the first
--- nil hole — so a unit with no Mark lost its points, and every prayer lost its whole meta line
--- (prayers carry no `type`, so the hole was at index 1). `select('#', ...)` counts nils correctly.
local function joinParts(sep, ...)
  local kept = {}
  for i = 1, select('#', ...) do
    local p = select(i, ...)
    if not isBlank(p) then kept[#kept + 1] = trim(p) end
  end
  return table.concat(kept, sep)
end

--- Right-pad to `n` characters, always leaving at least one space so a long name never runs into
--- the next column. TTS renders descriptions in a proportional font, so this aligns only roughly —
--- but roughly is still far more readable than not at all.
local function pad(s, n)
  s = tostring(s or '')
  if #s >= n then return s .. ' ' end
  return s .. string.rep(' ', n - #s)
end

local function say(msg, color) printToAll('[Custom40k] ' .. msg, color or { 1, 0.85, 0.6 }) end


-- ── text builders (one per kind of card) ────────────────────────────────────────────────────────

local NAME_COL = 26

--- One "Name  M WS BS ..." line per model, with a shared header row above it.
local function modelBlock(models)
  if not models or #models == 0 then return '' end
  local out = {}
  local keys = models[1].statKeys or {}

  local header = pad('', NAME_COL)
  for _, k in ipairs(keys) do header = header .. pad(k, 5) end
  out[#out + 1] = header

  for _, m in ipairs(models) do
    local label = m.name .. (m.count and (' x' .. num(m.count)) or '')
    local row = pad(label, NAME_COL)
    for _, k in ipairs(keys) do row = row .. pad((m.stats or {})[k] or '-', 5) end
    out[#out + 1] = row
  end
  return table.concat(out, '\n')
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

--- The meta line under a power's name: type, range, cast value, target, duration.
local function powerMeta(p)
  return joinParts(' | ', p.type, p.range,
                   p.cast_value and ('Cast ' .. p.cast_value) or '', p.target, p.duration)
end

local function powerText(p)
  return joinParts('\n', p.name, powerMeta(p), p.effect)
end

local function unitCardText(u)
  local sections = {}

  sections[#sections + 1] = joinParts('\n',
    string.upper(u.displayName or u.unitName or '?'),
    joinParts(' | ', u.slot, u.unitType,
              u.mark and ('Mark: ' .. u.mark) or '',
              u.size and (num(u.size) .. (u.size == 1 and ' model' or ' models')) or '',
              num(u.points) .. ' pts'))

  local mb = modelBlock(u.models); if mb ~= '' then sections[#sections + 1] = mb end

  if not isBlank(u.equippedWith) then
    sections[#sections + 1] = 'EQUIPPED WITH\n' .. u.equippedWith
  end

  local wb = weaponBlock(u.weapons); if wb ~= '' then sections[#sections + 1] = 'WEAPONS\n' .. wb end

  if u.wargear and #u.wargear > 0 then
    local lines = {}
    for _, g in ipairs(u.wargear) do
      -- A weapon bought from the armoury has no rules text of its own; it already appears in the
      -- weapons table above, so here it stays just a name.
      lines[#lines + 1] = isBlank(g.desc) and ('- ' .. g.name) or ('- ' .. g.name .. ': ' .. g.desc)
    end
    sections[#sections + 1] = 'WARGEAR\n' .. table.concat(lines, '\n')
  end

  if u.abilities and #u.abilities > 0 then
    sections[#sections + 1] = 'ABILITIES\n- ' .. table.concat(u.abilities, '\n- ')
  end

  -- Ordered on purpose: `pairs` over a literal would shuffle these between loads.
  for _, entry in ipairs({ { 'PRAYERS', u.prayers }, { 'PACTS', u.pacts },
                           { 'PSYCHIC POWERS', u.powers } }) do
    local label, list = entry[1], entry[2]
    if list and #list > 0 then
      local lines = {}
      for _, p in ipairs(list) do lines[#lines + 1] = powerText(p) end
      sections[#sections + 1] = label .. '\n' .. table.concat(lines, '\n\n')
    end
  end

  return table.concat(sections, '\n\n')
end


-- ── spawning ────────────────────────────────────────────────────────────────────────────────────

--- Spawn one notecard at grid slot `i` (0-based). Notecards show their description on the face,
--- and Alt-zoom makes a full datasheet readable, which is why they beat tokens or tiles here.
local function spawnCard(i, name, description)
  local base = self.getPosition()
  local col, row = i % GRID_COLS, math.floor(i / GRID_COLS)
  local card = spawnObject({
    type     = 'Notecard',
    position = { base.x + GRID_ORIGIN.x + col * GRID_DX,
                 base.y + GRID_ORIGIN.y,
                 base.z + GRID_ORIGIN.z + row * GRID_DZ },
    rotation = { 0, 180, 0 },
  })
  if not card then return end
  card.setName(name)
  card.setDescription(description)
  card.addTag(SPAWN_TAG)
  spawnedGuids[#spawnedGuids + 1] = card.getGUID()
end

local function clearSpawned()
  local n = 0
  for _, guid in ipairs(spawnedGuids) do
    local obj = getObjectFromGUID(guid)
    if obj then destroyObject(obj); n = n + 1 end
  end
  spawnedGuids = {}
  return n
end


-- ── reference -> notebook ───────────────────────────────────────────────────────────────────────

--- Write (or overwrite) a notebook tab by title, so pressing the button twice does not pile up
--- duplicate tabs.
local function writeTab(title, body)
  for _, tab in ipairs(Notes.getNotebookTabs()) do
    if tab.title == title then
      Notes.editNotebookTab({ index = tab.index, title = title, body = body })
      return
    end
  end
  Notes.addNotebookTab({ title = title, body = body })
end

local function powerListBody(list)
  local out = {}
  for _, p in ipairs(list or {}) do out[#out + 1] = powerText(p) end
  return table.concat(out, '\n\n')
end

local function writeReference(payload)
  local ref = payload.reference or {}
  local written = 0

  if ref.prayers and #ref.prayers > 0 then
    writeTab('Prayers', powerListBody(ref.prayers)); written = written + 1
  end
  if ref.pacts and #ref.pacts > 0 then
    writeTab('Infernal Pacts', powerListBody(ref.pacts)); written = written + 1
  end

  -- JSON object key order does not survive JSON.decode, so sort the discipline names for a stable
  -- tab order between loads.
  local names = {}
  for name, _ in pairs(ref.disciplines or {}) do names[#names + 1] = name end
  table.sort(names)
  for _, name in ipairs(names) do
    local powers = ref.disciplines[name]
    if powers and #powers > 0 then
      writeTab(name, powerListBody(powers)); written = written + 1
    end
  end

  return written
end


-- ── loading ─────────────────────────────────────────────────────────────────────────────────────

local function armySummary(a)
  return joinParts('\n',
    string.upper(a.name or 'ARMY'),
    joinParts(' | ', a.faction, a.engagement,
              num(a.totalPoints or 0) .. ' / ' .. num(a.pointLimit or 0) .. ' pts'),
    not isBlank(a.archetype) and ('Archetype: ' .. a.archetype) or '',
    not isBlank(a.legacy) and ('Legacy: ' .. a.legacy) or '',
    not isBlank(a.legacy2) and ('Legacy: ' .. a.legacy2) or '',
    (a.traits and #a.traits > 0) and ('Army traits: ' .. table.concat(a.traits, ', ')) or '')
end

local function buildArmy(payload)
  if type(payload) ~= 'table' or not payload.units then
    say('That JSON is not a Custom40k export.', { 1, 0.4, 0.4 }); return
  end
  if payload.schema ~= SCHEMA then
    say('Export schema ' .. tostring(payload.schema) .. ', this mod expects ' .. SCHEMA
        .. '. Update the mod (or re-export).', { 1, 0.4, 0.4 })
    return
  end

  clearSpawned()

  local i = 0
  spawnCard(i, payload.army.name or 'Army', armySummary(payload.army)); i = i + 1
  for n, u in ipairs(payload.units) do
    -- Numbered because a list often fields the same unit twice; without it the two cards are
    -- indistinguishable in the object list even though their wargear differs.
    spawnCard(i, n .. '. ' .. (u.displayName or u.unitName) .. ' (' .. num(u.points or 0) .. ')',
              unitCardText(u))
    i = i + 1
  end

  local tabs = writeReference(payload)
  say(#payload.units .. ' units on the table, ' .. tabs .. ' rules tabs in the notebook.')
end

--- The notebook tab may hold either the JSON itself or a URL pointing at it.
local function readSource()
  for _, tab in ipairs(Notes.getNotebookTabs()) do
    if tab.title == NOTEBOOK_TAB then return trim(tab.body) end
  end
  return nil
end

local function decodeAndBuild(text)
  local ok, payload = pcall(function() return JSON.decode(text) end)
  if not ok or type(payload) ~= 'table' then
    say('Could not parse that as JSON — check the notebook tab holds the whole file.', { 1, 0.4, 0.4 })
    return
  end
  buildArmy(payload)
end

function btnLoad()
  local src = readSource()
  if not src or src == '' then
    say('No notebook tab called "' .. NOTEBOOK_TAB .. '". Create it and paste the exported JSON in.',
        { 1, 0.4, 0.4 })
    return
  end
  if src:sub(1, 4) == 'http' then
    say('Fetching ' .. src .. ' ...')
    WebRequest.get(src, function(req)
      if req.is_error or req.response_code ~= 200 then
        say('Fetch failed: ' .. tostring(req.error or req.response_code), { 1, 0.4, 0.4 })
        return
      end
      decodeAndBuild(req.text)
    end)
  else
    decodeAndBuild(src)
  end
end

function btnRules()
  local src = readSource()
  if not src or src:sub(1, 1) ~= '{' then
    say('Paste the exported JSON into the "' .. NOTEBOOK_TAB .. '" tab first.', { 1, 0.4, 0.4 })
    return
  end
  local ok, payload = pcall(function() return JSON.decode(src) end)
  if not ok then say('Could not parse that JSON.', { 1, 0.4, 0.4 }); return end
  say(writeReference(payload) .. ' rules tabs written to the notebook.')
end

function btnClear()
  say(clearSpawned() .. ' cards removed.')
end
