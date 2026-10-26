/**
 * Alpha factions (the Horus Heresy books) are visible only to admins and Servitors. The one list a player sees goes through
 * visibleCategories(); this proves an ordinary player gets none of them and that nothing else in src/ names them.
 *   npx tsx scripts/check_alpha_visibility.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { CATEGORIES, visibleCategories, isAlphaFaction } from '../src/data/factionCatalog';

let f = 0;
const alphaKeys = CATEGORIES.flatMap(c => c.factions).filter(x => x.alpha).map(x => x.key);
if (alphaKeys.length < 2) { f++; console.log('  WRONG no alpha factions in the catalogue, the probe measures nothing'); }
const plain = visibleCategories(false).flatMap(c => c.factions).map(x => x.key);
for (const k of alphaKeys) {
  if (plain.includes(k)) { f++; console.log('  WRONG an ordinary player sees ' + k); }
  if (!visibleCategories(true).flatMap(c => c.factions).some(x => x.key === k)) { f++; console.log('  WRONG an admin or Servitor does not see ' + k); }
  if (!isAlphaFaction(k)) { f++; console.log('  WRONG isAlphaFaction(' + k + ') is false'); }
}
if (visibleCategories(false).some(c => c.factions.length === 0)) { f++; console.log('  WRONG an empty category is shown'); }
const nonAlpha = CATEGORIES.flatMap(c => c.factions).filter(x => !x.alpha).length;
if (plain.length !== nonAlpha) { f++; console.log(`  WRONG ordinary player sees ${plain.length} factions, expected ${nonAlpha}`); }
// nothing outside the catalogue may name an alpha faction (it would be a second, ungated list)
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []);
for (const file of walk('src')) {
  if (file.endsWith(path.join('data', 'factionCatalog.ts')) || /known-issues|changelog|loaders.ts$|factionLabel.ts$/.test(file)) continue;   // loaders / labels map a key, they are not a list a player sees
  const text = fs.readFileSync(file, 'utf8');
  for (const k of alphaKeys) if (text.includes(`'${k}'`) || text.includes(`"${k}"`)) { f++; console.log(`  WRONG ${file} names ${k} outside the gated catalogue`); }
}
console.log(f ? `\n${f} FAILURE(S)` : `\nOK  ${alphaKeys.length} alpha factions hidden from ordinary players`);
process.exit(f ? 1 : 0);
