/**
 * Builds the Custom40k Installer: a one-object Tabletop Simulator "saved object" that installs / updates the table mod
 * on ANY table without replacing it, plus the public copy of the script it downloads.
 *
 *   node tts/build_installer.cjs                 -> tts/Custom40k Installer.json (+ public/tts/Custom40kTable.lua)
 *   node tts/build_installer.cjs --install       -> also copies it into Saves/Saved Objects
 *
 * The installer downloads https://custom40k-builder.vercel.app/tts/Custom40kTable.lua, so updating the mod is: change
 * tts/Custom40kTable.lua, run this script, push. Nobody has to re-upload anything to the Workshop.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const lua = fs.readFileSync(path.join(__dirname, 'Custom40kInstaller.lua'), 'utf8').replace(/\r\n/g, '\n');
const mod = fs.readFileSync(path.join(__dirname, 'Custom40kTable.lua'), 'utf8').replace(/\r\n/g, '\n');
fs.mkdirSync(path.join(__dirname, '..', 'public', 'tts'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'public', 'tts', 'Custom40kTable.lua'), mod);

const stamp = new Date();
const save = {
  SaveName: 'Custom40k Installer',
  Date: stamp.toLocaleString('en-US'),
  VersionNumber: 'v14.2.2',
  GameMode: 'Custom40k',
  GameType: 'Game',
  GameComplexity: 'Medium Complexity',
  Tags: [],
  Gravity: 0.5,
  PlayArea: 0.5,
  Table: '',
  Sky: '',
  Note: '',
  TabStates: {},
  LuaScript: '',
  LuaScriptState: '',
  XmlUI: '',
  ObjectStates: [{
    GUID: 'c40kin',
    Name: 'Custom_Token',
    Transform: { posX: 0, posY: 1.2, posZ: 0, rotX: 0, rotY: 180, rotZ: 0, scaleX: 3, scaleY: 1, scaleZ: 3 },
    Nickname: 'Custom40k Installer',
    Description: 'Press the button to install or update the Custom40k Table mod on this table. Your table is not replaced.',
    GMNotes: '',
    ColorDiffuse: { r: 1, g: 1, b: 1 },
    Locked: false,
    Grid: true,
    Snap: true,
    IgnoreFoW: false,
    Autoraise: true,
    Sticky: true,
    Tooltip: true,
    CustomImage: {
      ImageURL: 'https://custom40k-builder.vercel.app/custom40k-logo.png',
      ImageSecondaryURL: '',
      ImageScalar: 1,
      WidthScale: 0,
      CustomToken: { Thickness: 0.2, MergeDistancePixels: 15, StandUp: false, Stackable: false },
    },
    LuaScript: lua,
    LuaScriptState: '',
    XmlUI: '',
  }],
};

const out = path.join(__dirname, 'Custom40k Installer.json');
fs.writeFileSync(out, JSON.stringify(save, null, 2));
console.log('wrote ' + out);

if (process.argv.includes('--install')) {
  const dir = path.join(os.homedir(), 'Documents', 'My Games', 'Tabletop Simulator', 'Saves', 'Saved Objects');
  if (!fs.existsSync(dir)) { console.error('Saved Objects folder not found: ' + dir); process.exit(1); }
  fs.copyFileSync(out, path.join(dir, 'Custom40k Installer.json'));
  console.log('installed to ' + dir);
}
