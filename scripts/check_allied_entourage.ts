/**
 * GH#258: Chaos Daemons as an ALLIED detachment. The Entourage rule ("For each Greater Daemon of the same Chaos god, up to two units
 * with this rule ... do not occupy an HQ slot") only worked for the primary army, so an ally with a Lord of Change and its single HQ slot
 * could not add a Changecaster. Builds the ally through the real validator: a Lord of Change plus two Changecasters is legal, a third is not.
 *   npx tsx scripts/check_allied_entourage.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { validateArmy } from '../src/engine/validators';

type Any = any;
let failures = 0;
const fail = (m: string) => { failures++; console.log('  WRONG ' + m); };

(async () => {
  const cd: Any = await (FACTION_LOADERS as Any)['chaos_daemons']();
  cd.allied = { chaos_daemons: cd };
  const primary: Any = await (FACTION_LOADERS as Any)['space_marines']();
  primary.allied = { chaos_daemons: cd };
  const mk = (id: string, name: string): Any => ({ id, unitName: name, slot: cd.units[name]?.slot, size: cd.units[name]?.default_size ?? 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], factionSource: 'chaos_daemons' });
  const base: Any = { traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 3000, alliedFaction: 'chaos_daemons', alliedArchetype: null };
  const hqErrors = (army: Any[]) => {
    const res: Any = validateArmy({ ...base, army }, primary, cd);
    return ((res?.items ?? res ?? []) as Any[]).filter(i => i.type === 'error' && /HQ/.test(String(i.text ?? '')) && /alli|Allied/i.test(String(i.text ?? '')));
  };
  const troops = Object.values<Any>(cd.units).find((u: Any) => u.slot === 'Troops');
  const t = (id: string): Any => mk(id, troops.name);
  const lord = 'Lord of Change', caster = 'Changecaster';
  if (hqErrors([mk('a', lord), t('t1')]).length) fail('control: one Lord of Change alone should fill the ally HQ slot without error');
  if (!hqErrors([mk('a', lord), mk('b', 'Bloodthirster'), t('t1')]).length) fail('control: two Greater Daemons of different gods should overflow one ally HQ slot, the probe measures nothing otherwise');
  if (hqErrors([mk('a', lord), mk('b', caster), t('t1')]).length) fail('a Changecaster next to a Lord of Change should occupy no HQ slot (Entourage)');
  if (hqErrors([mk('a', lord), mk('b', caster), mk('c', caster), t('t1')]).length) fail('two Changecasters next to a Lord of Change should both be free');
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nOK  allied Entourage frees the HQ slot');
  process.exit(failures ? 1 : 0);
})();
