/**
 * Entourage for the Chaos Daemons reached through a Chaos Space Marine archetype (Dominic, 2026-11-13: it applies there and to allies,
 * and the Greater Daemon must be in the same detachment as the Entourage unit).
 *
 * The app creates those Daemons with `ownArmy: true` (SlotPanel addUnit(..., ownArmy)), and isAlliedEntry says "not allied" for them.
 * A first version of this guard built them WITHOUT the flag, passed, and the Entourage never applied in the real app (Discord, Sophtym:
 * Lord of Change + Changecaster took 2 HQ slots under All is Dust). So every case below goes through the flag the app really sets, and the
 * last ones run the whole slot count, not just the helper.
 *   npx tsx scripts/check_archetype_entourage.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { alliedCdFreeHeraldIds, getSlotUsage } from '../src/engine/validators';
import { getArchetypeRule } from '../src/engine/archetypes';

type Any = any;
let failures = 0;
const fail = (m: string) => { failures++; console.log('  WRONG ' + m); };
const eq = (l: string, a: unknown, b: unknown) => { if (a !== b) fail(`${l}: got ${a}, want ${b}`); };

(async () => {
  const cd: Any = await (FACTION_LOADERS as Any)['chaos_daemons']();
  const csm: Any = await (FACTION_LOADERS as Any)['chaos_space_marines']();
  csm.allied = { chaos_daemons: cd };
  const mk = (id: string, name: string, extra: Any = { ownArmy: true }): Any => ({ id, unitName: name, slot: cd.units[name]?.slot, size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], factionSource: 'chaos_daemons', ...extra });
  const free = (army: Any[], scope: string, own = true) => alliedCdFreeHeraldIds(army, csm, scope, own).size;
  const lord = 'Lord of Change', caster = 'Changecaster';
  eq('archetype scope: Changecaster next to a Lord of Change is free', free([mk('a', lord), mk('b', caster)], 'chaos_daemons'), 1);
  // one per Greater Daemon since the sheet's Entourage line says "one unit" (it used to say "up to two")
  eq('archetype scope: exactly one Changecaster free per Lord of Change', free([mk('a', lord), mk('b', caster), mk('c', caster), mk('d', caster)], 'chaos_daemons'), 1);
  // same detachment: a Greater Daemon of the primary army (no factionSource) must not free a Herald of the Daemon scope
  eq('a Greater Daemon outside the detachment frees nothing', free([{ ...mk('a', lord), factionSource: undefined }, mk('b', caster)], 'chaos_daemons'), 0);
  // the two scopes never read each other's entries
  eq('an ownArmy Herald is not seen by the allied-detachment scope', free([mk('a', lord), mk('b', caster)], 'chaos_daemons', false), 0);
  eq('a picked allied detachment is not seen by the archetype scope', free([mk('a', lord, {}), mk('b', caster, {})], 'chaos_daemons', true), 0);
  eq('a picked allied detachment still works in its own scope', free([mk('a', lord, {}), mk('b', caster, {})], 'chaos_daemons', false), 1);

  // The whole count, as the panel and validator call it: All is Dust reaches the Daemons (rule.alliedFaction), no allied faction picked.
  const rule: Any = getArchetypeRule('All is Dust');
  const army = [mk('a', lord), mk('b', caster)];
  eq('All is Dust, Pitched: Lord of Change + Changecaster = 1 HQ', getSlotUsage(army, csm, 'HQ', rule, undefined, false, 'pitched'), 1);
  eq('All is Dust, Skirmish: both occupy a slot = 2 HQ', getSlotUsage(army, csm, 'HQ', rule, undefined, false, 'skirmish'), 2);
  // a second Changecaster beside one Lord of Change is NOT free
  eq('All is Dust, Pitched: a second Changecaster takes a slot', getSlotUsage([...army, mk('c', caster)], csm, 'HQ', rule, undefined, false, 'pitched'), 2);
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nOK  archetype Entourage');
  process.exit(failures ? 1 : 0);
})();
