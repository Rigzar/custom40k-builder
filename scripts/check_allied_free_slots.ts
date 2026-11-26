/**
 * A unit rule that says "does not occupy a slot" also works inside an ALLIED detachment, computed with that detachment's own units
 * (Discord, Sophtym: an allied Necron Hexmark Destroyer still used an Elite slot with a Lord in the detachment). Skirmish grants none.
 * Also pins the Chaos Daemons Entourage under a Chaos Space Marines archetype (All is Dust) in Pitched.
 *   npx tsx scripts/check_allied_free_slots.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { validateArmy, computeAlliedFreeSlotAdjustments, getSlotUsage } from '../src/engine/validators';
import { getArchetypeRule } from '../src/engine/archetypes';
type Any = any;
let bad = 0;
const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };

(async () => {
  const L: Any = FACTION_LOADERS;
  const prim: Any = await L['adeptus_mechanicus']();
  const nec: Any = await L['necrons']();
  prim.allied = { ...(prim.allied ?? {}), necrons: nec };
  const mk = (data: Any, names: string[], src?: string): Any[] => names.map((n, i) => ({ id: n + i, unitName: n, slot: data.units[n].slot, factionSource: src, size: data.units[n].default_size ?? 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] }));
  const st = (army: Any[], eng: string): Any => ({ army, traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', legacy3: '', hqMark: '', engagement: eng, pointLimit: 2000, faction: prim.faction, alliedFaction: 'necrons', alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], alliedHqMark: '' });
  const slotErrors = (army: Any[], eng: string) => validateArmy(st(army, eng), prim, nec).filter(v => v.type === 'error' && /Allied/.test(v.text) && /Elites/.test(v.text)).length;

  const withLord = mk(nec, ['Lord', 'Warriors', 'Lychguard', 'Hexmark Destroyer'], 'necrons');
  eq('allied Lord frees the allied Hexmark (1 Elite)', computeAlliedFreeSlotAdjustments(withLord, nec, 'necrons', st(withLord, 'pitched')).elites, 1);
  eq('allied Lord + Hexmark: no Elite error in Pitched', slotErrors(withLord, 'pitched'), 0);

  const noLord = mk(nec, ['Warriors', 'Lychguard', 'Hexmark Destroyer'], 'necrons');
  eq('no Lord: nothing is freed', computeAlliedFreeSlotAdjustments(noLord, nec, 'necrons', st(noLord, 'pitched')).elites, 0);
  eq('no Lord: two Elites over the one Troop still errors', slotErrors(noLord, 'pitched') > 0, true);

  eq('Skirmish grants no exemption', computeAlliedFreeSlotAdjustments(withLord, nec, 'necrons', st(withLord, 'skirmish')).elites, 0);

  // a Lord of the PRIMARY army must not free an allied Hexmark
  const necPrim: Any[] = mk(nec, ['Lord'], undefined);
  const mixed = [...necPrim, ...mk(nec, ['Warriors', 'Lychguard', 'Hexmark Destroyer'], 'necrons')];
  eq('a primary Lord does not free an allied Hexmark', computeAlliedFreeSlotAdjustments(mixed, nec, 'necrons', st(mixed, 'pitched')).elites, 0);

  // Entourage under a CSM archetype that reaches Chaos Daemons: Lord of Change + Changecaster take ONE HQ slot in Pitched, two in Skirmish
  const csm: Any = await L['chaos_space_marines']();
  const cd: Any = await L['chaos_daemons']();
  csm.allied = { ...(csm.allied ?? {}), chaos_daemons: cd };
  const rule: Any = getArchetypeRule('All is Dust');
  const dae = mk(cd, ['Lord of Change', 'Changecaster'], 'chaos_daemons');
  eq('All is Dust, Pitched: Lord of Change + Changecaster = 1 HQ', getSlotUsage(dae, csm, 'HQ', rule, undefined, undefined, 'pitched'), 1);
  eq('All is Dust, Skirmish: both occupy a slot = 2 HQ', getSlotUsage(dae, csm, 'HQ', rule, undefined, undefined, 'skirmish'), 2);
  process.exit(bad ? 1 : 0);
})();
