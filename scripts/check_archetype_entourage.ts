/**
 * Entourage for the Chaos Daemons reached through a Chaos Space Marine archetype (Dominic, 2026-11-13: it applies there and to allies,
 * and the Greater Daemon must be in the same detachment as the Entourage unit). Archetype Daemons carry factionSource 'chaos_daemons' with
 * no allied detachment picked, so the slot count has to evaluate that scope on its own.
 *   npx tsx scripts/check_archetype_entourage.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { alliedCdFreeHeraldIds } from '../src/engine/validators';

type Any = any;
let failures = 0;
const fail = (m: string) => { failures++; console.log('  WRONG ' + m); };

(async () => {
  const cd: Any = await (FACTION_LOADERS as Any)['chaos_daemons']();
  const csm: Any = await (FACTION_LOADERS as Any)['chaos_space_marines']();
  csm.allied = { chaos_daemons: cd };
  const mk = (id: string, name: string, src = 'chaos_daemons'): Any => ({ id, unitName: name, slot: cd.units[name]?.slot, size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], factionSource: src });
  const free = (army: Any[], scope: string) => alliedCdFreeHeraldIds(army, csm, scope);
  const lord = 'Lord of Change', caster = 'Changecaster';
  if (free([mk('a', lord), mk('b', caster)], 'chaos_daemons').size !== 1) fail('a Changecaster next to a Lord of Change in the archetype scope should be free');
  if (free([mk('a', lord), mk('b', caster), mk('c', caster), mk('d', caster)], 'chaos_daemons').size < 2) fail('two Changecasters should be free per Lord of Change');
  // same detachment: a Greater Daemon of the primary army (no factionSource) must not free a Herald of the Daemon scope
  if (free([{ ...mk('a', lord), factionSource: undefined }, mk('b', caster)], 'chaos_daemons').size !== 0) fail('a Greater Daemon outside the detachment must not free the Herald');
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nOK  archetype Entourage');
  process.exit(failures ? 1 : 0);
})();
