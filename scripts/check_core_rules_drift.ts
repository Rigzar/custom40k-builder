/**
 * Core Rules check: the rulebook's glossary (src/data/coreRules.generated.json, made by scripts/gen_core_rules.cjs)
 * against what the app shows (CORE_WEAPON_ABILITIES / CORE_MODEL_ABILITIES in src/data/coreRules.ts, which applies the
 * generated text on load). "In sync" means every rule of the rulebook is in the app with the rulebook's text; the
 * other way round it lists rules the app has that the rulebook's two lists do not (hand-written leftovers to review).
 *
 *   npx tsx scripts/check_core_rules_drift.ts
 *
 * Lists every rule whose text differs once quotes, case, punctuation and the {X} placeholder are ignored, plus rules
 * the rulebook has and the app lacks (and the reverse). Exit code 1 when anything differs, so it can gate a CI step.
 * Codex-only rules (CODEX_WEAPON_ABILITIES, FACTION_SIGNATURE_RULES) are not in the Core Rules and are not compared.
 */
import fs from 'fs';
import { CORE_WEAPON_ABILITIES, CORE_MODEL_ABILITIES } from '../src/data/coreRules';

const gen = JSON.parse(fs.readFileSync('src/data/coreRules.generated.json', 'utf8')) as {
  rulesVersion: string; modelAbilities: Record<string, string>; weaponAbilities: Record<string, string>;
};
// The rulebook writes the parameter as "x+", "+x", "-x", "X+"; the app stores it as {X}, which carries the sign and the plus itself.
const norm = (s: string) => s.toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
  .replace(/\{x\}/g, 'x').replace(/(?<![a-z])[+-]?x\+?(?![a-z])/g, 'x').replace(/ x amount of /g, ' x ').replace(/[^a-z0-9]+/g, ' ').trim();
const key = (n: string) => n.toLowerCase().replace(/\s*\(.*$/, '').replace(/!$/, '').replace(/\s+/g, ' ').trim();

let problems = 0;
for (const [label, doc, app] of [
  ['Weapon abilities', gen.weaponAbilities, CORE_WEAPON_ABILITIES],
  ['Model abilities', gen.modelAbilities, CORE_MODEL_ABILITIES],
] as const) {
  const lines: string[] = [];
  const seen = new Set<string>();
  for (const [name, text] of Object.entries(doc)) {
    const k = key(name); seen.add(k);
    const a = app[k];
    if (!a) { lines.push(`  missing in app: ${name}`); continue; }
    if (norm(text) !== norm(a.description)) lines.push(`  differs: ${name}\n     rulebook: ${text}\n     app:      ${a.description}`);
  }
  for (const k of Object.keys(app)) if (!seen.has(k)) lines.push(`  in app, not in the rulebook's list: ${k}`);
  problems += lines.length;
  console.log(`${label} (Core Rules ${gen.rulesVersion}): ${lines.length ? lines.length + ' difference(s)' : 'in sync'}`);
  lines.forEach(l => console.log(l));
}
process.exit(problems ? 1 : 0);
