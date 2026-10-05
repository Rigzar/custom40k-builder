/**
 * An Armory purchase that belongs to ONE model (a squad's built-in Leader/Champion) must change that
 * model alone in EVERY view, not only on the unit card.
 *
 * GitHub #208: "Plate armor ... modifies not only the leader's save, but also all other models" (a
 * Platoon Command Squad Lieutenant) and "a Gang Champion with Swordsman honours should have WS 3+, but
 * the other gangers should stay at WS 4+". The unit card scoped it (the Nob / Rough Rider fix), the
 * printed card, the simple printout and the battle view each applied it to every row.
 *
 *   npx tsx scripts/check_equip_scoped_to_champion.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { equipTargetsModel } from '../src/lib/battleProfile';
type Any = any;

(async () => {
  const fails: string[] = [];
  const row = (u: Any, name: string): Any => u.models.find((m: Any) => m.name === name);
  const ig: Any = await (FACTION_LOADERS as Any).imperial_guard();

  const pcs = ig.units['Platoon Command Squad'];
  if (equipTargetsModel(pcs, row(pcs, 'Lieutenant'), null) !== true) fails.push('the Lieutenant does not take his own armour');
  if (equipTargetsModel(pcs, row(pcs, 'Guardsman'), null) !== false) fails.push('the Guardsmen take the Lieutenant\'s armour');

  // Hive Gangers (Imperial Guard): Hive Ganger 9-9 + Gang Champion 1-1, champion-only Armory
  const gangs = [ig.units['Hive Gangers']].filter(Boolean);
  if (!gangs.length) fails.push('no Gang unit found to test');
  for (const u of gangs) {
    const champ = u.models[1];
    if (champ && champ.min === 1 && champ.max === 1 && u.champion_has_armory && !u.has_armory_access) {
      if (!equipTargetsModel(u, champ, null)) fails.push(`${u.name}: the champion does not take his own gear`);
      if (equipTargetsModel(u, u.models[0], null)) fails.push(`${u.name}: the rank and file take the champion's gear`);
    }
  }

  // unit-wide access still changes every row
  const wide = Object.values<Any>(ig.units).find(u => u.has_armory_access && u.models.length > 1);
  if (wide && !equipTargetsModel(wide, wide.models[0], null)) fails.push(`${wide.name}: unit-wide access no longer reaches every row`);

  for (const f of fails) console.log('  ' + f);
  if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
  console.log('OK — champion-only Armory changes land on the champion row alone.');
})();
