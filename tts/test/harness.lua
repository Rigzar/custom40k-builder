-- Minimal stand-ins for the Tabletop Simulator API, enough to exercise Custom40k.lua headlessly.
local spawned, tabs = {}, {}
local guid = 0

self = {
  getPosition    = function() return { x = 0, y = 0, z = 0 } end,
  clearButtons   = function() end,
  createButton   = function(_) end,
}

function spawnObject(p)
  guid = guid + 1
  local o = { _guid = string.format('%06d', guid), _name = '', _desc = '', _tags = {} }
  o.setName        = function(n) o._name = n end
  o.setDescription = function(d) o._desc = d end
  o.addTag         = function(t) o._tags[#o._tags + 1] = t end
  o.getGUID        = function() return o._guid end
  spawned[o._guid] = o
  return o
end
function getObjectFromGUID(g) return spawned[g] end
function destroyObject(o) spawned[o._guid] = nil end
function printToAll(m) print(m) end

Notes = {
  getNotebookTabs = function()
    local out = {}
    for i, t in ipairs(tabs) do out[i] = { index = i, title = t.title, body = t.body } end
    return out
  end,
  addNotebookTab  = function(t) tabs[#tabs + 1] = { title = t.title, body = t.body } end,
  editNotebookTab = function(t) tabs[t.index] = { title = t.title, body = t.body } end,
}

-- JSON.decode / encode via a tiny pure-Lua decoder is overkill; the harness injects the already
-- decoded payload instead and only needs decode() to hand it back.
local payloadTable
JSON = {
  decode = function(_) return payloadTable end,
  encode = function(_) return '{}' end,
}

function HARNESS_RUN(payload)
  payloadTable = payload
  tabs = { { title = 'Custom40k', body = '{PAYLOAD}' } }
  onLoad('')
  btnLoad()
  local cards = {}
  for _, o in pairs(spawned) do cards[#cards + 1] = { name = o._name, desc = o._desc, tags = o._tags } end
  table.sort(cards, function(a, b) return a.name < b.name end)
  return cards, tabs
end
