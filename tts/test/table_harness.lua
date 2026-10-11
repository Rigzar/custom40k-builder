-- Stand-ins for the Tabletop Simulator API used by tts/Custom40kTable.lua (Global script).
MESSAGES, LAST_XML, VECTOR_CALLS = {}, '', 0
local tabs, objects, guidN = {}, {}, 0

function printToAll(m) MESSAGES[#MESSAGES + 1] = m end
UI = { setXml = function(x) LAST_XML = x end }
Notes = {
  getNotebookTabs = function() local o = {} for i, t in ipairs(tabs) do o[i] = { index = i, title = t.title, body = t.body } end return o end,
  addNotebookTab = function(t) tabs[#tabs + 1] = { title = t.title, body = t.body } end,
  editNotebookTab = function(t) tabs[t.index] = { title = t.title, body = t.body } end,
}
function NOTEBOOK_SET(title, body) tabs[#tabs + 1] = { title = title, body = body } end
function NOTEBOOK_COUNT() return #tabs end

local function newObject(x, z)
  guidN = guidN + 1
  local o = { _guid = string.format('%06d', guidN), _pos = { x = x or 0, y = 1, z = z or 0 }, _tags = {}, _lines = nil, _name = '', _desc = '' }
  o.getGUID = function() return o._guid end
  o.getPosition = function() return o._pos end
  o.getScale = function() return { x = 1, y = 1, z = 1 } end
  o.getBounds = function() return { size = { x = 1.26, y = 2, z = 1.26 } } end
  o.setName = function(n) o._name = n end
  o.setDescription = function(d) o._desc = d end
  o.addTag = function(t) o._tags[#o._tags + 1] = t end
  o.setColorTint = function() end
  o.setVectorLines = function(l) o._lines = l; VECTOR_CALLS = VECTOR_CALLS + 1 end
  objects[o._guid] = o
  return o
end
function spawnObject(p) return newObject(p.position and p.position.x, p.position and p.position.z) end
function getObjectFromGUID(g) return objects[g] end
function MAKE_OBJECTS(n) local out = {} for i = 1, n do out[i] = newObject((i % 6) * 2, math.floor(i / 6) * 2) end return out end
function DESTROY(o) local g = o; objects[o._guid] = nil; if onObjectDestroy then onObjectDestroy(g) end end

PLAYER = { _sel = {}, getSelectedObjects = function() return PLAYER._sel end }
function SELECT(list) PLAYER._sel = list end
WebRequest = { get = function() end }
Wait = { frames = function(f) f() end }

function NOTEBOOK_FILL(title, body) for _, t in ipairs(tabs) do if t.title == title then t.body = body return end end tabs[#tabs + 1] = { title = title, body = body } end
