/** Core Rules 1.39: "A model may only benefit from extra attacks from one Armoury weapon." Two such Armory weapons on one model warn; one does not.
 *    npx tsx scripts/check_extra_attack_one_weapon.ts */
import { FACTION_LOADERS } from '../src/data/loaders';
import { validateArmy } from '../src/engine/validators';
type Any = any;
(async () => {
  const d: Any = await (FACTION_LOADERS as Any)['space_marines']();
  const unit: Any = Object.values<Any>(d.units).find((u: Any) => u.has_armory_access && u.is_character);
  const base: Any = { traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
  const warns = (armory: Any[]) => {
    const item: Any = { id: 'x', unitName: unit.name, slot: unit.slot, size: 1, optionQty: {}, armory, traits: [], powers: [], prayers: [], pacts: [] };
    const r: Any = validateArmy({ ...base, army: [item] }, d, d);
    return ((r?.items ?? r) as Any[]).filter(i => /only one Armory weapon can give extra attacks/.test(String(i.text)));
  };
  const sel = (n: string): Any => ({ itemName: n, section: 'weapons', source: 'General' });
  let f = 0;
  if (warns([sel('Pair of lightning claws')]).length) { f++; console.log('  WRONG one Extra Attack weapon should not warn'); }
  if (!warns([sel('Pair of lightning claws'), sel('Ossific Blades')]).length) { f++; console.log('  WRONG two Extra Attack weapons should warn'); }
  console.log(f ? `\n${f} FAILURE(S)` : `\nOK  tested on ${unit.name}`);
  process.exit(f ? 1 : 0);
})();
