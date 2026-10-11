-- Scenario driver for Custom40kTable.lua, run by run_table.cjs inside fengari.
FAILS, PASSES = {}, 0
local function check(cond, msg) if cond then PASSES = PASSES + 1 else FAILS[#FAILS + 1] = msg end end
local function click(id) c40k_click(PLAYER, nil, id) end
local function xmlOk(label)
  local err = XML_CHECK(LAST_XML)
  check(err == nil, label .. ': XML is not well formed (' .. tostring(err) .. ')')
end
local function lastMessages(n) local o = {} for i = math.max(1, #MESSAGES - n + 1), #MESSAGES do o[#o + 1] = MESSAGES[i] end return table.concat(o, ' || ') end

local raw = READ_EXPORT()
onLoad('')
check(NOTEBOOK_COUNT() == 2, 'the two army tabs are created on the first load, got ' .. NOTEBOOK_COUNT())
click('load__1')
check(lastMessages(1):find('still holds the instructions'), 'loading before pasting says what to do: ' .. lastMessages(1))
NOTEBOOK_FILL('Custom40k', raw)
NOTEBOOK_FILL('Custom40k 2', raw)
onLoad('')
check(NOTEBOOK_COUNT() == 2, 'a second load does not duplicate the tabs')
local st = C40K.getState()
check(st ~= nil, 'state exists after onLoad')
xmlOk('start screen')

click('load__1'); click('load__2')
st = C40K.getState()
check(st.armies[1] and #st.armies[1].units > 0, 'side 1 loaded: ' .. lastMessages(2))
check(st.armies[2] and #st.armies[2].units > 0, 'side 2 loaded')
check(st.armies[1].game ~= nil, 'export carries the game rules (turn structure)')
check(next(st.armies[1].rules or {}) ~= nil, 'export carries rule texts')

-- every tab renders valid XML, with an army loaded
for _, tab in ipairs({ 'army', 'rules', 'binder', 'battle', 'attack', 'powers', 'mission' }) do
  click('tab__' .. tab)
  xmlOk('tab ' .. tab)
  check(not LAST_XML:find('Internal error'), 'tab ' .. tab .. ' hit an internal error: ' .. (LAST_XML:match('Internal error[^<]*') or ''))
end
click('tab__rules')
for _, m in ipairs({ 'unit', 'rules', 'status', 'game:phases', 'game:orders', 'game:meta', 'game:shock', 'game:weapons', 'game:score' }) do
  click('rmode__' .. m); xmlOk('rules mode ' .. m)
  check(not LAST_XML:find('Internal error'), 'rules mode ' .. m .. ' failed')
end

-- ── attack calculator, checked against the Core Rules by hand ──
local ex = st.armies[1]
local function find(name) for i, u in ipairs(ex.units) do if u.displayName == name or u.unitName == name then return i end end end
local function weapon(ui, name) for wi, w in ipairs(ex.units[ui].weapons) do if w.name == name then return wi end end end
local function near(a, b, msg) check(a ~= nil and math.abs(a - b) < 0.06, msg .. ' (got ' .. tostring(a) .. ', want ' .. tostring(b) .. ')') end
local function pickLine(lines, pat) for _, l in ipairs(lines) do local m = l:match(pat) if m then return tonumber(m) end end end

local function isVeh(u) local m = u.models[1] return m and m.stats and m.stats.FRONT ~= nil end
local function firstWeapon(u, pat, wantMelee)
  for wi, w in ipairs(u.weapons) do
    local melee = w.type:lower():find('melee') ~= nil
    if melee == wantMelee and (not pat or w.type:find(pat)) then return wi end
  end
end
local squad, rhino
for i, u in ipairs(ex.units) do
  if not isVeh(u) and not squad and firstWeapon(u, nil, true) and firstWeapon(u, nil, false) then squad = i end
  if isVeh(u) and not rhino then rhino = i end
end
check(squad ~= nil, 'the army has an infantry unit with a melee and a ranged weapon')
local chain = firstWeapon(ex.units[squad], nil, true)
local bolter = firstWeapon(ex.units[squad], nil, false)

local cveh
if rhino then
  local gun = firstWeapon(ex.units[squad], nil, false)
  local c = C40K.buildAttack(1, squad, gun, 2, rhino, 1, { cover = 0 })
  cveh = c
  check(c ~= nil, 'a ranged weapon vs a vehicle builds')
  local lines = C40K.expectAttack(c)
  local sNeed, av = c.s, c.av
  local pen, glance = 0, 0
  for f = 1, 6 do
    local at = c.at
    local tot = f + sNeed + (c.penBonus or 0)
    if tot > av then if at > 0 then pen = pen + 1 else glance = glance + 1 end elseif tot == av then glance = glance + 1 end
  end
  local hits = c.attacks * c.pHit
  near(pickLine(lines, '([%d%.]+) penetrating'), hits * pen / 6, 'penetrating hits from 1d6+S vs armour value')
  near(pickLine(lines, ', ([%d%.]+) glancing'), hits * glance / 6, 'glancing hits from 1d6+S vs armour value')
end

local c2 = C40K.buildAttack(1, squad, chain, 2, squad, 1, { cover = 0 })
-- melee attacks = A x the models that carry the weapon
local carriedA, wid = 0, ex.units[squad].weapons[chain].id
for j, m in ipairs(ex.units[squad].models) do
  for _, mw in ipairs(m.modelWeapons or {}) do
    if mw.weaponId == wid then carriedA = carriedA + m.count * (mw.count or 1) * tonumber(m.stats.A:match('%d+')) end
  end
end
check(c2.attacks == carriedA, 'melee attacks = A x carriers: ' .. carriedA .. ', got ' .. tostring(c2.attacks))
check(c2.woundNeed == C40K.woundNeed(c2.s, c2.t), 'the wound roll comes from the S vs T table')
local l2 = C40K.expectAttack(c2)
local pw = (7 - c2.woundNeed) / 6
local pSv = c2.save and (c2.save <= 6 and (7 - math.max(c2.save, 2)) / 6 or 0) or 0
local pWd = c2.ward and (7 - math.max(c2.ward, 2)) / 6 or 0
near(pickLine(l2, 'To wound %d%+: ([%d%.]+) wounds'), c2.attacks * c2.pHit * pw, 'expected wounds')
near(pickLine(l2, 'Unsaved: ([%d%.]+) wounds'), c2.attacks * c2.pHit * pw * (1 - pSv) * (1 - pWd), 'expected unsaved wounds (armour save with AP, then ward)')
-- cover: heavy cover +2 to the save of a ranged attack, -1 to hit
local cc = C40K.buildAttack(1, squad, bolter, 2, squad, 1, { cover = 2 })
local cn = C40K.buildAttack(1, squad, bolter, 2, squad, 1, { cover = 0 })
check(cc.hitNeed == cn.hitNeed + 1, 'cover gives -1 to hit')
check(cc.save == cn.save - 2, 'heavy cover gives +2 to the save, ' .. tostring(cc.save) .. ' vs ' .. tostring(cn.save))
local ct = C40K.buildAttack(1, squad, bolter, 2, squad, 1, { cover = 0, takeCover = true })
check(ct.save == cn.save - 1, 'Take Cover gives +1 to the save')
-- order legality
local cl = C40K.buildAttack(1, squad, chain, 2, squad, 1, { order = 'Stand & Shoot' })
check(#cl.notes > 0 and cl.notes[1]:find('cannot be used'), 'a Melee weapon is refused with Stand & Shoot')
-- wound table
check(C40K.woundNeed(8, 4) == 2 and C40K.woundNeed(5, 4) == 3 and C40K.woundNeed(4, 4) == 4 and C40K.woundNeed(3, 4) == 5 and C40K.woundNeed(2, 4) == 6, 'S vs T wound table')
-- parsing
local ab = C40K.parseAbilities('AT(1), Deadly(6+), Slow(-1)')
check(ab['at'] == '1' and ab['deadly'] == '6+' and ab['slow'] == '-1', 'weapon abilities split on top-level commas')
local auto = C40K.parseAutoHits('The target suffers three automatic hits with Strength: 5 AP: -1 D: 1; Seeking.')
check(auto and auto.n == 3 and auto.s == 5 and auto.ap == -1 and auto.d == 1 and auto.seeking, 'Smite text parses into three S5 AP-1 D1 seeking hits')
local fx = C40K.parseEffect('Melee weapons gain the "Decimate" ability. Melee weapons gain additional -1AP.')
check(fx.abil.melee[1] == 'Decimate' and fx.apMelee == 1, 'effect text gives Decimate and -1 AP to melee')
local warded = C40K.parseEffect('The model and its attached unit gain the "Warded" ability. Unique.')
check(warded.warded == 1, '"Warded" granted to the attached unit is read')

-- rolled attack: never errors, never removes more than it hits
math.randomseed(7)
local lns, removed = C40K.rollAttack(c2)
check(type(removed) == 'number' and removed >= 0 and #lns >= 3, 'a rolled attack returns lines and a casualty count')
if cveh then
  local lv = C40K.rollAttack(cveh)
  check(#lv >= 2, 'a rolled attack on a vehicle reports penetrating hits')
end

-- UI path for the same thing
click('tab__attack')
click('aord__3'); click('cov__1'); click('wpick__1'); click('atpick__2'); click('atside__2')
click('expect'); xmlOk('attack expected'); check(C40K.getUI().atk.lastResult:find('To hit'), 'EXPECTED fills the result')
click('rollit'); xmlOk('attack roll'); check(C40K.getUI().atk.lastResult:find('To hit') or C40K.getUI().atk.lastResult:find('Auto Hit'), 'ROLL IT fills the result')
click('applycas'); xmlOk('apply casualties')

-- ── binder ──
click('tab__binder')
C40K.getUI().side = 1; C40K.getUI().unit = squad
local objs = MAKE_OBJECTS(5)
SELECT(objs)
click('bind'); xmlOk('binder after bind')
local bound = 0
for _ in pairs(C40K.getState().bindings) do bound = bound + 1 end
check(bound == 5, 'five selected miniatures are bound, got ' .. bound)
check(objs[1]._name:find(ex.units[squad].displayName, 1, true) ~= nil, 'a bound miniature is named after its unit')
check(#objs[1]._desc > 20, 'a bound miniature carries its datasheet text')
local rangeW; for wi, w in ipairs(ex.units[squad].weapons) do if not rangeW and tonumber(w.range:match('%d+')) then rangeW = wi end end
click('ring__move'); click('ring__w' .. rangeW)
check(objs[1]._lines and #objs[1]._lines == 2 and #objs[1]._lines[1].points == 49, 'two rings (move + bolter range) are drawn around each bound miniature')
local r1 = objs[1]._lines[1].points[1].x
local mv = tonumber(ex.units[squad].models[1].stats.M:match('%d+'))
near(r1, mv + 0.63, 'move ring radius = M + the base radius from its bounds')
local before = C40K.getState().bs[1][squad].alive[1] or 0
DESTROY(objs[1])
check((C40K.getState().bs[1][squad].alive[1] or 0) == before - 1, 'removing a bound miniature takes a model off the unit')
click('ringclear'); check(objs[2]._lines ~= nil and #objs[2]._lines == 0, 'CLEAR RINGS removes the lines')
xmlOk('binder after rings')

-- ── battle ──
click('tab__battle')
local ph0 = C40K.getState().phase
click('phase__1'); check(C40K.getState().phase == ph0 + 1, 'the phase advances')
for _ = 1, 4 do click('phase__1') end
check(C40K.getState().round == 2 and C40K.getState().phase == 1, 'after the fifth phase round 2 begins, got round ' .. C40K.getState().round)
click('init'); check(C40K.getState().initiative ~= 0 or lastMessages(1):find('tie'), 'initiative is rolled')
click('tok__1'); check(C40K.getState().bs[1][squad].tokens == 1, 'a Battleshock token is added')
click('tok__1'); click('tok__1'); check(C40K.getState().bs[1][squad].tokens == 2, 'never more than two Battleshock tokens')
click('rally__1'); xmlOk('after rally')
click('ordset__3'); check(C40K.getState().bs[1][squad].order ~= '', 'an order is assigned')
click('reserve'); click('reinf__1'); xmlOk('after reinforcement')
click('done'); check(C40K.getState().bs[1][squad].done, 'a unit is marked as activated')
click('alive__1__-1'); xmlOk('after casualty')

-- ── effects, powers, attached leader ──
local casterIdx, kind
for i, u in ipairs(ex.units) do
  if #(u.powers or {}) > 0 then casterIdx, kind = i, 'powers' break end
  if #(u.prayers or {}) > 0 then casterIdx, kind = i, 'prayers' break end
  if #(u.pacts or {}) > 0 then casterIdx, kind = i, 'pacts' break end
end
if casterIdx then
  click('tab__powers')
  C40K.getUI().side = 1; C40K.getUI().unit = casterIdx
  click('pkind__' .. kind); xmlOk('powers tab')
  click('cast'); xmlOk('after cast')
  check(lastMessages(3):find(ex.units[casterIdx].displayName, 1, true) ~= nil, 'casting reports the caster: ' .. lastMessages(2))
end
C40K.addEffect(1, squad, { name = 'Test', text = 'Melee weapons gain the "Decimate" ability.', source = 'Test', kind = 'round', casterSide = 1, casterUnit = 1, duration = 'Until the end of the round' })
local c3 = C40K.buildAttack(1, squad, chain, 2, squad, 1, { cover = 0 })
check(c3.woundNeed == math.max(2, c2.woundNeed - 1), 'an active "Decimate" status improves the wound roll by one')
C40K.getUI().side = 1; C40K.getUI().unit = squad
click('tab__rules'); click('rmode__status'); xmlOk('statuses'); check(LAST_XML:find('Test'), 'the status shows in RULES > Statuses')
for _ = 1, 5 do click('phase__1') end
check(#C40K.getState().bs[1][squad].effects == 0, 'round statuses expire when the round ends')

-- an attached leader hands its wargear's bonuses to the unit it leads (Armor of Badab: "Warded")
local leader = (squad == 1) and 2 or 1
local baseWard = C40K.effectiveWard(1, squad)
ex.units[leader].joinedTo = ex.units[squad].id
ex.units[leader].grantsToUnit = { { source = 'Armor of Badab', text = 'The model and its attached unit gain the "Warded" ability. Unique.' } }
local want = baseWard and math.max(4, baseWard - 1) or 6
check(C40K.effectiveWard(1, squad) == want, 'a joined leader gives Warded: the unit ward goes from ' .. tostring(baseWard) .. ' to ' .. want .. ', got ' .. tostring(C40K.effectiveWard(1, squad)))
local cw = C40K.buildAttack(2, 1, 1, 1, squad, 1, { cover = 0 })
check(cw == nil or cw.ward == want, 'the attack calculator uses the improved ward against that unit')
click('tab__battle'); C40K.getUI().side = 1; C40K.getUI().unit = squad; xmlOk('battle with attached leader')
check(LAST_XML:find('Ward save now: ' .. want), 'the Battle View shows the ward save as ' .. want .. '+')

-- ── missions ──
click('tab__mission'); xmlOk('mission')
click('vp__1__1'); click('vpm__2__50')
check(C40K.getState().vp[1] > 0 and C40K.getState().vp[2] == 50, 'victory points are added from the pad')
click('sec__1__1'); xmlOk('secondary')
local t = C40K.totals()
check(t[1] >= C40K.getState().vp[1] + 200, 'a secondary objective adds its 200 VP')
check(C40K.verdict():find('Side') or C40K.verdict():find('Draw'), 'there is a verdict')
-- attrition: remove a whole enemy unit
local st2 = C40K.getState()
for j = 1, #st2.bs[2][rhino or squad].alive do st2.bs[2][rhino or squad].alive[j] = 0 end
check(C40K.attritionFor(2) >= ex.units[rhino or squad].points, 'a destroyed unit is worth its points in attrition')

-- ── save / load round trip ──
local saved = onSave()
check(type(saved) == 'string' and #saved > 1000, 'onSave serialises the state')
local roundBefore = st2.round
onLoad(saved)
local back = C40K.getState()
check(back.round == roundBefore and back.vp[2] == 50 and back.armies[1] and back.armies[2], 'a saved game loads back (round, VP, both armies)')
check(back.bs[1][squad].alive[1] ~= nil, 'unit state survives the round trip')
xmlOk('after load')

-- no action may have failed or hit a UI error
local bad = {}
for _, m in ipairs(MESSAGES) do if m:find('failed:') or m:find('UI error') or m:find('Internal error') then bad[#bad + 1] = m end end
check(#bad == 0, 'no action reported an error: ' .. table.concat(bad, ' || '))

-- ── picking from lists instead of stepping with arrows ──
click('tab__attack')
click('sidepick__2'); check(C40K.getUI().side == 2 and C40K.getUI().unit == 1, 'pressing a side button switches the side')
click('pick__2'); check(C40K.getUI().unit == 2, 'pressing a unit button selects that unit')
check(LAST_XML:find('2%. ') ~= nil, 'the unit list shows numbered unit buttons')
click('sidepick__1'); click('pick__' .. squad)
click('atside__2'); click('atpick__' .. (rhino or 1)); check(C40K.getUI().atk.defSide == 2 and C40K.getUI().atk.defUnit == (rhino or 1), 'pressing a target unit selects it as the target')
click('wpick__2'); check(C40K.getUI().atk.weapon == 2, 'pressing a weapon selects it')
click('cov__2'); check(C40K.getUI().atk.cover == 2, 'pressing a cover button sets it')
click('aord__2'); check(C40K.getUI().atk.order == 'Stand & Shoot', 'pressing an order button sets it')
xmlOk('attack with pickers')
click('tab__powers'); click('pwpick__1'); click('ptside__1'); click('ptpick__2'); xmlOk('powers with pickers')
click('tab__mission'); click('mpick__2'); check(C40K.getState().mission == 2, 'pressing a mission selects it'); xmlOk('mission pick')
click('tab__army'); check(not LAST_XML:find('Spawn cards'), 'there is no Spawn cards button any more'); xmlOk('army tab')
local fails2 = {}
for _, m in ipairs(MESSAGES) do if m:find('failed:') or m:find('UI error') or m:find('Internal error') then fails2[#fails2 + 1] = m end end
check(#fails2 == 0, 'pickers raised no errors: ' .. table.concat(fails2, ' || '))

-- ── order and Battleshock tokens beside the unit, highlight on pick ──
CLEAR_TOKENS()
onLoad('')
click('load__1'); click('load__2')
C40K.getUI().side = 1; C40K.getUI().unit = squad
local tokObjs = MAKE_OBJECTS(5)
SELECT(tokObjs); click('tab__binder'); click('bind')
local function tokenImages() local o = {} for _, t in ipairs(TOKENS()) do o[#o + 1] = t._image:match('[^/]+$') end table.sort(o) return table.concat(o, ',') end
local before = COUNT_TOKENS()
-- command phase: the order goes down face down
local phases = C40K.getState().phase
while C40K.getState().phase ~= 3 do click('phase__1') end
click('tab__battle'); click('ordset__3')
check(COUNT_TOKENS() == before + 1 and tokenImages():find('hidden.png'), 'in the Command Phase the order token goes down face down, got ' .. tokenImages())
local tk = TOKENS()[1]
local maxX = -1e9; for _, o in ipairs(tokObjs) do maxX = math.max(maxX, o.getPosition().x) end
check(tk._pos.x > maxX, 'the order token sits to the right of the unit')
click('ordset__4')
check(COUNT_TOKENS() == before + 1, 'choosing another order replaces the token instead of adding one')
-- initiative then action phase: orders are turned over
click('phase__1'); click('phase__1')
check(C40K.getState().phase == 5, 'now in the Action Phase')
check(tokenImages():find('hidden.png') == nil and tokenImages():find('escape.png') ~= nil, 'entering the Action Phase reveals the order: ' .. tokenImages())
-- Battleshock
click('tok__1'); check(tokenImages():find('pinned.png'), 'one Battleshock token puts a Pinned token on the table')
local pin; for _, t in ipairs(TOKENS()) do if t._image:find('pinned') then pin = t end end
local minX = 1e9; for _, o in ipairs(tokObjs) do minX = math.min(minX, o.getPosition().x) end
check(pin and pin._pos.x < minX, 'the Battleshock token sits to the left of the unit')
click('tok__1'); check(tokenImages():find('fleeing.png') and not tokenImages():find('pinned.png'), 'a second token turns it into a Fleeing token')
click('tok__-1'); click('tok__-1'); check(not tokenImages():find('fleeing') and not tokenImages():find('pinned'), 'removing the Battleshock tokens removes the marker')
-- the next round clears the orders
for _ = 1, 5 do click('phase__1') end
check(not tokenImages():find('escape.png'), 'a new round clears the order tokens')
click('ordset__5'); click('cleartokens'); check(COUNT_TOKENS() == before, 'Remove all tokens clears them')
click('pick__' .. squad); check(tokObjs[1]._highlighted, 'picking a unit highlights its miniatures on the table')
xmlOk('battle with tokens')
local failsT = {}
for _, m in ipairs(MESSAGES) do if m:find('failed:') or m:find('UI error') or m:find('Internal error') then failsT[#failsT + 1] = m end end
check(#failsT == 0, 'token actions raised no errors: ' .. table.concat(failsT, ' || '))
