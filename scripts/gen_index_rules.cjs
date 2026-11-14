// The "Special rules" block of every faction's Index tab -> src/data/factionIndexRules.ts (army-wide rules for the Print view).
const X = require('xlsx'), fs = require('fs');
const dir = 'Codex/';
const FILES = {
  'Adeptus Custodes': 'AdeptusCustodes1.7', 'Adeptus Mechanicus': 'Adeptus Mechanicus 1.5', 'Adeptus Sororitas': 'Adeptus Sororitas 1.3', 'Chaos Daemons': 'ChaosDaemons1.3',
  'Chaos Space Marines': 'Chaos Space Marines 1.11', 'Dark Eldar': 'DarkEldar1.7', 'Eldar': 'Eldar1.13', 'Genestealer Cults': 'Genestealer Cults 1.5', 'Grey Knights': 'Grey Knights 1.4',
  'Harlequins': 'Harlequins1.4', 'Imperial Guard': 'ImperialGuard1.15', 'Imperial Navy': 'Imperial Navy 1.2', 'Inquisition': 'Inquisition 1.4', 'Knight Households': 'Knight Households 1.0',
  'Leagues of Votann': 'LeaguesofVotann1.7', 'Necrons': 'Necrons1.12', 'Orks': 'Orks1.8', 'Space Marines': 'SpaceMarines1.14', 'Tau Empire': 'Tau Empire 1.10', 'Tyranids': 'Tyranids1.14',
};
const out = {};
for (const [name, f] of Object.entries(FILES)) {
  const p = dir + f + '.ods';
  if (!fs.existsSync(p)) { console.log('missing', p); continue; }
  const wb = X.readFile(p);
  if (!wb.SheetNames.includes('Index')) continue;
  const rr = X.utils.sheet_to_json(wb.Sheets['Index'], { header: 1, defval: '' }).map(r => r.map(c => String(c).trim()));
  const i = rr.findIndex(r => /^special rules$/i.test(r[1] || '') || /^special rules$/i.test(r[0] || ''));
  if (i < 0) continue;
  const list = [];
  for (const r of rr.slice(i + 1)) {
    const t = (r[1] || r[0] || '').replace(/\s+/g, ' ').trim();
    if (!t) continue;
    if (/^designer.?s note|^\*/i.test(t)) continue;
    const m = t.match(/^([^:]{2,60}):\s*(.+)$/);
    if (!m) continue;
    const nm = m[1].replace(/\*+$/, '').trim(); if (!list.some(x => x.name === nm)) list.push({ name: nm, text: m[2].trim() });
  }
  if (list.length) out[name] = list;
}
const body = Object.entries(out).map(([k, v]) => `  ${JSON.stringify(k)}: [\n${v.map(x => `    { name: ${JSON.stringify(x.name)}, text: ${JSON.stringify(x.text)} },`).join('\n')}\n  ],`).join('\n');
fs.writeFileSync('src/data/factionIndexRules.ts', `/**
 * The army-wide rules each codex prints under "Special rules" on its Index tab (Tyranids: Instinctive Behaviour, Psychic Feedback,
 * Shadow in the Warp). Generated from the sheets by scripts/gen_index_rules.cjs; the Print view lists them in an "Army rules" card,
 * because a player who only read the unit cards never saw them (Discord, Dave, 2026-11-13: "the Tyranid army wide rule doesn't appear").
 * Regenerate when a sheet's Index changes.
 */
export interface IndexRule { name: string; text: string }
export const FACTION_INDEX_RULES: Record<string, IndexRule[]> = {
${body}
};
`);
console.log(Object.entries(out).map(([k, v]) => k + ': ' + v.map(x => x.name).join(', ')).join('\n'));
