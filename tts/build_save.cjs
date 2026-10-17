/**
 * Builds a ready-to-load Tabletop Simulator save with the Custom40k Table mod already inside it:
 * the Global script embedded and the two army notebook tabs created, with instructions.
 *
 *   node tts/build_save.cjs                 -> tts/Custom40k Table.json
 *   node tts/build_save.cjs --install       -> also copies it into your TTS Saves folder
 *
 * Load it from TTS (Games > Save & Load) or upload it to the Workshop from there (Modding > Workshop).
 * The table is the plain RPG table; change it in Options > Table if you prefer another one.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const lua = fs.readFileSync(path.join(__dirname, 'Custom40kTable.lua'), 'utf8').replace(/\r\n/g, '\n');
const stamp = new Date();
const grey = { r: 0.5, g: 0.5, b: 0.5 };

const save = {
  SaveName: 'Custom40k Table',
  EpochTime: Math.floor(stamp.getTime() / 1000),
  Date: stamp.toLocaleString('en-US'),
  VersionNumber: 'v14.2.2',
  GameMode: 'Custom40k',
  GameType: 'Game',
  GameComplexity: 'Medium Complexity',
  PlayingTime: [2, 4],
  PlayerCounts: [2, 2],
  Tags: ['Warhammer', 'Custom40k', 'Wargame'],
  Gravity: 0.5,
  PlayArea: 0.5,
  Table: 'Table_RPG',
  Sky: 'Sky_Field',
  Note: 'Custom40k Table. Paste your exported army JSON into the notebook tabs "Custom40k" and "Custom40k 2" (builder: Print View > TTS), then press C40K (top right) > ARMY > LOAD.',
  TabStates: {
    '0': {
      title: 'Custom40k', color: 'Grey', visibleColor: grey, id: 0,
      body: '[PASTE YOUR ARMY JSON HERE - replace this whole text]\n\nIn the Custom40k builder open your army, go to Print View and press TTS: a .json file downloads. Open it, copy everything and paste it here (Ctrl+V), replacing this text. Then press C40K (top right) > ARMY > LOAD for Side 1.',
    },
    '1': {
      title: 'Custom40k 2', color: 'Grey', visibleColor: grey, id: 1,
      body: '[PASTE YOUR ARMY JSON HERE - replace this whole text]\n\nSame as the other tab, for the second player. Then press C40K (top right) > ARMY > LOAD for Side 2.',
    },
  },
  Grid: { Type: 0, Lines: false, Color: { r: 0, g: 0, b: 0 }, Opacity: 0.6, ThickLines: true, Snapping: false, Offset: false, BothSnapping: false, xSize: 2, ySize: 2, PosOffset: { x: 0, y: 1, z: 0 } },
  Lighting: { LightIntensity: 0.54, LightColor: { r: 1, g: 0.98, b: 0.89 }, AmbientIntensity: 1.3, AmbientType: 0, AmbientSkyColor: { r: 0.5, g: 0.5, b: 0.5 }, AmbientEquatorColor: { r: 0.5, g: 0.5, b: 0.5 }, AmbientGroundColor: { r: 0.5, g: 0.5, b: 0.5 }, ReflectionIntensity: 1, LutIndex: 0, LutContribution: 1, LutURL: '' },
  Hands: { Enable: true, DisableUnused: false, Hiding: 0 },
  Turns: { Enable: false, Type: 0, TurnOrder: [], Reverse: false, SkipEmpty: false, DisableInteractions: false, PassTurns: true, TurnColor: '' },
  LuaScript: lua,
  LuaScriptState: '',
  XmlUI: '',
  ObjectStates: [],
};

const out = path.join(__dirname, 'Custom40k Table.json');
fs.writeFileSync(out, JSON.stringify(save, null, 2));
console.log('wrote ' + out + ' (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');

if (process.argv.includes('--install')) {
  const dir = path.join(os.homedir(), 'Documents', 'My Games', 'Tabletop Simulator', 'Saves');
  const dest = path.join(dir, 'Custom40k Table.json');
  try { fs.copyFileSync(out, dest); } catch (e) { console.error('TTS Saves folder not usable: ' + dir + ' (' + e.code + ')'); process.exit(1); }
  console.log('installed to ' + dest);
  // The Save & Load list is read from SaveFileInfos.json, not from the folder, so the save has to be registered there
  // too. Tabletop Simulator rewrites that index while it runs: close the game first, or run this again if it vanishes.
  const index = path.join(dir, 'SaveFileInfos.json');
  let indexText = null;
  try { indexText = fs.readFileSync(index, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (indexText !== null) {
    const list = JSON.parse(indexText);
    const sample = list[0] && list[0].Directory;
    const prefix = sample ? sample.slice(0, sample.lastIndexOf('\\') + 1) : dir + path.sep;
    const entry = { Directory: prefix + 'Custom40k Table.json', Name: 'Custom40k Table', UpdateTime: Math.floor(Date.now() / 1000) };
    const at = list.findIndex(x => /Custom40k Table\.json$/.test(x.Directory));
    if (at >= 0) list[at] = entry; else list.push(entry);
    fs.copyFileSync(index, index.replace('.json', '.backup-custom40k.json'));
    fs.writeFileSync(index, JSON.stringify(list, null, 2));
    console.log('registered in SaveFileInfos.json');
  }
}
