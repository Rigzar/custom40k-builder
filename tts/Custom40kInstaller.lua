--[[
  Custom40k Installer  -  object script
  ------------------------------------------------------------------------------------------------
  Drop this object on ANY table (yours stays exactly as it is) and press its button: it downloads the latest
  Custom40k Table script and installs it as the table's Global script. Press it again whenever you want to update.

  Why an object: the window and the rules live in the Global script (only that script can draw a screen UI), and a
  Workshop table replaces the whole table when loaded. This object carries nothing but the installer, so loading
  it never touches your table.

  It will not overwrite a Global script that is not ours: a table with its own Global script keeps it, and the
  object says so (paste the mod by hand and merge, or ask for help).
--]]

local URL    = 'https://custom40k-builder.vercel.app/tts/Custom40kTable.lua'
local MARKER = 'C40K-TABLE-MOD'

local function tell(msg, color) broadcastToAll('[Custom40k] ' .. msg, color or { 1, 0.85, 0.6 }) end

function onLoad()
  self.clearButtons()
  self.createButton({
    label = 'INSTALL / UPDATE\nCUSTOM40K', click_function = 'installMod', function_owner = self,
    position = { 0, 0.3, 0 }, rotation = { 0, 0, 0 }, width = 2400, height = 900, font_size = 220,
    color = { 0.2, 0.15, 0.05 }, font_color = { 1, 0.85, 0.4 },
    tooltip = 'Downloads the latest Custom40k Table script and installs it as this table\'s Global script',
  })
end

local function currentGlobal()
  local ok, src = pcall(function() return Global.getLuaScript() end)
  return ok and (src or '') or ''
end

--- A Global script with no code in it (TTS writes a default comment into a new table) is safe to replace.
--- Plain finds only: a lazy pattern over a long script raises "pattern too complex" in Tabletop Simulator's Lua.
local function isBlankScript(src)
  return #src < 800 and not src:find('function', 1, true) and not src:find('end', 1, true)
end

function installMod(_, playerColor)
  local before = currentGlobal()
  local ours = before:find(MARKER, 1, true) ~= nil
  if not ours and not isBlankScript(before) then
    tell('This table already has its own Global script, so nothing was changed. Open Modding > Scripting > Global and add the Custom40k script to it by hand, or remove that script first.', { 1, 0.45, 0.45 })
    return
  end
  tell('Downloading the Custom40k Table script...')
  WebRequest.get(URL, function(req)
    if req.is_error or req.response_code ~= 200 then
      tell('Could not download the script (' .. tostring(req.error or req.response_code) .. '). Check your connection and try again.', { 1, 0.45, 0.45 })
      return
    end
    local src = req.text or ''
    if not src:find(MARKER, 1, true) then
      tell('The downloaded file is not the Custom40k Table script. Nothing was changed.', { 1, 0.45, 0.45 })
      return
    end
    local ok, err = pcall(function() Global.setLuaScript(src) end)
    if not ok then
      tell('This version of Tabletop Simulator would not let the object set the Global script (' .. tostring(err) .. '). Paste it by hand: Modding > Scripting > Global.', { 1, 0.45, 0.45 })
      return
    end
    tell(ours and 'Updated. Reloading the table script...' or 'Installed. Starting it...')
    Wait.time(function()
      local running = false
      pcall(function() running = Global.getTable('C40K') ~= nil end)
      if running then
        tell('Done: press the C40K button (top right).', { 0.5, 1, 0.5 })
      else
        tell('Installed. If the C40K button does not appear, open Modding > Scripting > Global and press Save & Play (or save and reload the table).', { 1, 0.85, 0.4 })
      end
    end, 3)
  end)
end
