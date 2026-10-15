/**
 * "All remaining models may swap their X" (Hernkyn Yaegirs, Hearthkyn Warriors) covers every model the other swaps left
 * alone, in price and in the weapon rows: npx tsx scripts/check_all_remaining_swap.ts
 */
import { loadBundledFaction } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { computeUnitPoints } from '../src/engine/points';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };
(async () => {
  const vot: Any = await loadBundledFaction('leagues_of_votann');
  const rows = (u: Any, item: Any) => {
    const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
    const r: Any = resolveUnitProfile(item, u, state, vot);
    const out: Record<string, number> = {};
    for (const g of r.weaponGroups) for (const w of g.weapons) out[w.name] = g.countOverrides?.get(w.name) ?? g.count;
    return out;
  };
  const price = (u: Any, item: Any) => computeUnitPoints(item, u, '', 'Leagues of Votann', 2000);
  const mk = (name: string, size: number, optionQty: Any): Any => ({ id: 'x', unitName: name, slot: 'x', size, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] });

  const y = vot.units['Hernkyn Yaegirs'];
  // 5 Yaegirs: one APM launcher, one Magna-coil rifle, and the box ticked -> the other three swap
  let it = mk('Hernkyn Yaegirs', 5, { 0: { 0: 1, 1: 1 }, 1: { 0: 1 } });
  eq('Yaegirs x5: three Bolt revolvers', rows(y, it)['Bolt revolver'], 3);
  eq('Yaegirs x5: three Plasma knives', rows(y, it)['Plasma knife'], 3);
  eq('Yaegirs x5: no Bolt shotgun left', rows(y, it)['Bolt shotgun'] ?? 0, 0);
  eq('Yaegirs x5: priced 5x20 + 15 + 19 + 3x1', price(y, it), 137);
  // nothing ticked: five shotguns, base price
  it = mk('Hernkyn Yaegirs', 5, {});
  eq('Yaegirs x5 untouched: five Bolt shotguns', rows(y, it)['Bolt shotgun'], 5);
  eq('Yaegirs x5 untouched: 100 points', price(y, it), 100);
  // the box alone: all five swap
  it = mk('Hernkyn Yaegirs', 5, { 1: { 0: 1 } });
  eq('Yaegirs x5 box only: five Bolt revolvers', rows(y, it)['Bolt revolver'], 5);
  eq('Yaegirs x5 box only: 100 + 5', price(y, it), 105);
  // ten models, the box and no other swap
  it = mk('Hernkyn Yaegirs', 10, { 1: { 0: 1 } });
  eq('Yaegirs x10 box only: ten Bolt revolvers', rows(y, it)['Bolt revolver'], 10);
  eq('Yaegirs x10 box only: 200 + 10', price(y, it), 210);

  const w = vot.units['Hearthkyn Warriors'];
  const gi = w.option_groups.findIndex((g: Any) => /remaining models/i.test(g.header));
  it = mk('Hearthkyn Warriors', 10, { [gi]: { 0: 1 } });
  eq('Hearthkyn Warriors x10 box only: ten Ion blasters', rows(w, it)['Ion blaster'], 10);
  process.exit(bad ? 1 : 0);
})();
