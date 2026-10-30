/**
 * Every archetype a player can pick must resolve to a rule object.
 *
 * FOUND 2026-09-19 in the faction coverage audit. `getArchetypeRule` looks the name up verbatim
 * (or through the renames map), and ELDAR'S AND DARK ELDAR'S "Ynnari" lived under the keys
 * 'Ynnari (Eldar)' and 'Ynnari (Dark Eldar)' — which nothing anywhere produced. The rules were
 * written and unreachable, so the archetype did nothing: "May not select any Legacy" went
 * unenforced and the Ynnari Armory was never offered. The Revenant discipline worked throughout
 * because `PsychicModal` gates it on the archetype STRING rather than on the rule object, which is
 * exactly why the rest went unnoticed.
 *
 * A rule object is not proof the archetype DOES anything — plenty are notes plus one flag — but a
 * MISSING one is proof it cannot.
 *
 *   npx tsx scripts/check_archetype_rules_reachable.ts
 */
import { getArchetypeRule } from '../src/engine/archetypes';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

type Any = any;
let ok = true;
const check = (label: string, got: Any, want: Any) => {
  const good = JSON.stringify(got) === JSON.stringify(want);
  ok = ok && good;
  console.log(`  ${good ? 'ok   ' : 'WRONG'} ${label.padEnd(56)} ${JSON.stringify(got)}`
    + (good ? '' : `  (expected ${JSON.stringify(want)})`));
};

/** Known to have no rule yet, each recorded in known-issues with what it owes. */
const KNOWN_UNWIRED = new Set([
  'inquisition/Heretic',        // borrow one item from any Chaos faction
  'inquisition/Iconoclast',     // borrow one item from any Xenos faction
  'inquisition/Sector Lord',    // Henchman Warband without an Inquisitor, size 5-10
  'imperial_navy/Heretic',      // widens the Legendary Retinue (engine/legendaryRetinue.ts), no ArchetypeRule needed
  'imperial_navy/Iconoclast',   // same, with the Xenos codices
  // Horus Heresy books (hidden alpha work, deliberately not in known-issues): detachments whose effects are movement, reserve or ability
  // rules the rule table cannot express, so they stay as the sheet's text. Their slot effects are in engine/codex_horus_heresy/archetypes.ts.
  "horus_heresy_loyal/Drop Pod Assault (HH)",
  "horus_heresy_loyal/Angel's Wrath",
  "horus_heresy_loyal/Underworld Assault",
  "horus_heresy_loyal/The Bloodied Claw",
  "horus_heresy_loyal/Hammerfall Strike Force",
  "horus_heresy_loyal/The Day of Revelation",
  "horus_heresy_loyal/Logos Lectora",
  "horus_heresy_loyal/The Awakening Fire",
  "horus_heresy_traitor/Drop Pod Assault (HH)",
  "horus_heresy_traitor/Angel's Wrath",
  "horus_heresy_traitor/Underworld Assault",
  "horus_heresy_traitor/The Coils of the Hydra",
  "horus_heresy_traitor/The Hammer of Olympia",
  "horus_heresy_traitor/The Maru Skara",
  "horus_heresy_traitor/Berserker Assault",
]);

function main() {
  const missing: string[] = [];
  let total = 0;
  for (const d of readdirSync('data/parsed')) {
    let a: Any;
    try { a = JSON.parse(readFileSync(join('data/parsed', d, 'archetypes.json'), 'utf8').replace(/^﻿/, '')); }
    catch { continue; }
    for (const x of a.archetypes ?? []) {
      total++;
      if (!getArchetypeRule(x.name)) missing.push(`${d}/${x.name}`);
    }
  }
  console.log(`${total} archetypes in the data`);

  const unexpected = missing.filter(m => !KNOWN_UNWIRED.has(m));
  check('no archetype is unreachable except the known ones', unexpected, []);
  check('and the known ones are still the same ones', missing.sort(), [...KNOWN_UNWIRED].sort());

  // The specific regression: Ynnari under a suffixed key nothing asks for.
  check('Ynnari resolves under the name the data uses', !!getArchetypeRule('Ynnari'), true);
  check('it forbids a Legacy', getArchetypeRule('Ynnari')?.noLegacy, true);
  check('and it opens the Ynnari Armory', getArchetypeRule('Ynnari')?.sharedSupplementArmory, 'Ynnari');

  console.log(ok ? '\nAll checks passed.' : '\nSOME CHECKS FAILED.');
  process.exit(ok ? 0 : 1);
}
main();
