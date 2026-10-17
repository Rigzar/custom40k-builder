/** GH#243: T'au "up to two SUPPORT SYSTEMS from the armory" is counted and capped: npx tsx scripts/check_support_systems.ts */
import { loadBundledFaction } from '../src/data/loaders';
import { supportSystemCap, supportSystemsOwned } from '../src/lib/supportSystems';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };
(async () => {
  const tau: Any = await loadBundledFaction('tau_empire');
  const sel = (name: string, i: number): Any => ({ id: 's' + i, itemName: name, source: 'x', section: 'equipment', points: 5 });
  const mk = (unit: string, size: number, armory: Any[]): Any => ({ id: 'x', unitName: unit, slot: 'HQ', size, optionQty: {}, armory, traits: [], powers: [], prayers: [], pacts: [] });
  const cmd = tau.units['Commander'];
  eq('Commander cap is 2', supportSystemCap(cmd, mk('Commander', 1, []), tau, []), 2);
  eq('Commander with 2 support systems owns 2', supportSystemsOwned(cmd, mk('Commander', 1, [sel('Shield generatorᴵ', 1), sel('Target lock', 2)]), tau), 2);
  eq('a non-support item is not counted', supportSystemsOwned(cmd, mk('Commander', 1, [sel('Bonding knifeᴵ', 1)]), tau), 0);
  eq('Advanced Miniaturization adds one', supportSystemCap(cmd, mk('Commander', 1, []), tau, ['Advanced Miniaturization']), 3);
  eq('an XV85 Enforcer adds one', supportSystemCap(cmd, mk('Commander', 1, [sel('XV85 Enforcer battlesuit', 1)]), tau, []), 3);
  const crisis = tau.units['Crisis Battlesuits'];
  eq('Crisis x3: "any model" is 2 each = 6', supportSystemCap(crisis, mk('Crisis Battlesuits', 3, []), tau, []), 6);
  const fw = tau.units['Fire Warriors'];
  eq('a unit without the line has no cap', fw ? supportSystemCap(fw, mk('Fire Warriors', 6, []), tau, []) : null, null);
  process.exit(bad ? 1 : 0);
})();
