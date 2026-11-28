/**
 * GitHub #313-#320 (Sophtym, 2026-11-28), each claim through the code the app really runs:
 *  #319 a Tzeentch unit of nine Blue Horrors has no squad leader (its Brimstone row is a max-0 reference), so it is not Favored;
 *  #315 "For every Helbrute fist" is one pick per fist carried, including a second fist bought in place of the Power scourge;
 *  #317 Furioso: two melee weapons add +2 Attacks to the statline, and a fist swapped for a ranged weapon takes it away;
 *  #320 a Chaos Sorcerer's Psychic training turns the other disciplines into single-power picks (modal logic, checked in the browser).
 *   npx tsx scripts/check_github_313_320.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { perOwnedWeaponCap, inlinePerModelCap, computeUnitPoints } from '../src/engine/points';
type Any = any;
let bad = 0;
const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };

(async () => {
  const L: Any = FACTION_LOADERS;
  const mk = (data: Any, unitName: string, size: number, optionQty: Any = {}, mark: Any = null, hqMark: Any = ''): [Any, Any, Any] => {
    const u = data.units[unitName];
    const item: Any = { id: 'x', unitName, slot: u.slot, size, optionQty, mark, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
    const st: Any = { army: [item], traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', legacy3: '', hqMark, engagement: 'pitched', pointLimit: 2000, faction: data.faction, alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], alliedHqMark: '' };
    return [item, u, st];
  };

  const cd: Any = await L['chaos_daemons']();
  for (const [name, size, expect] of [['Blue Horrors', 9, false], ['Blue Horrors', 18, false], ['Bloodletters', 8, true], ['Bloodletters', 9, false]] as const) {
    const [item, u, st] = mk(cd, name, size);
    eq(`${name} x${size} Favored`, resolveUnitProfile(item, u, st, cd).isFavored, expect);
  }

  const csm: Any = await L['chaos_space_marines']();
  const hb = csm.units['Helbrute'];
  const gi = (re: RegExp) => hb.option_groups.findIndex((g: Any) => re.test(g.header));
  const gFist = gi(/replace its Helbrute fist/), gScourge = gi(/replace its Power scourge/), gEvery = gi(/^For every Helbrute fist/);
  const cap = (size: number, q: Any) => { const [item, u] = mk(csm, 'Helbrute', size, q); return perOwnedWeaponCap(u, item, u.option_groups[gEvery]); };
  const fistIdx = hb.option_groups[gScourge].choices.findIndex((c: Any) => c.name === 'Helbrute fist');
  eq('one Helbrute: one fist, one Heavy flamer', cap(1, {}), 1);
  eq('two Helbrutes, nothing bought: two fists', cap(2, {}), 2);
  eq('one Helbrute with a second fist in place of the scourge: two', cap(1, { [gScourge]: { [fistIdx]: 1 } }), 2);
  eq('two Helbrutes, both take a second fist: four', cap(2, { [gScourge]: { [fistIdx]: 2 } }), 4);
  eq('one Helbrute that swaps its fist away: none', cap(1, { [gFist]: { 0: 1 } }), 0);

  const A = (size: number, q: Any) => { const [item, u, st] = mk(csm, 'Helbrute', size, q); return resolveUnitProfile(item, u, st, csm).equipMods?.statDeltas?.A ?? 0; };
  eq('Helbrute default (fist + power scourge) is a Furioso: +2 Attacks', A(1, {}), 2);
  eq('Helbrute that traded its fist for a ranged weapon is not', A(1, { [gFist]: { 0: 1 } }), 0);
  eq('Helbrute with fist + hammer is a Furioso', A(1, { [gScourge]: { 1: 1 } }), 2);
  eq('Helbrute with fist + missile launcher is not (fist, then a ranged weapon)', A(1, { [gScourge]: { 2: 1 } }), 0);

  // #313 / #318, ruled by the author (Rigzar, 2026-11-28): "if the unit can have 2, both can".
  const cc = cd.units['Changecaster'];
  const ccGroup = cc.option_groups.findIndex((g: Any) => /Staff of change/.test(g.header));
  eq('Changecaster "Can be equipped with a Staff" is a count up to the unit size', inlinePerModelCap(cc, cc.option_groups[ccGroup], 2), 2);
  const price = (size: number, qty: number) => computeUnitPoints({ id: 'p', unitName: 'Changecaster', slot: cc.slot, size, optionQty: qty ? { [ccGroup]: { __inline: qty } } : {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] } as Any, cc, '', cd.faction, 2000);
  eq('two Changecasters, no staff', price(2, 0), 204);
  eq('two Changecasters, one staff (+63)', price(2, 1), 267);
  eq('two Changecasters, two staves (+126)', price(2, 2), 330);
  const hbPsy = hb.option_groups.findIndex((g: Any) => /psyker/.test(g.header));
  eq('Helbrute psyker upgrade is a count too', inlinePerModelCap(hb, hb.option_groups[hbPsy], 2), 2);
  const eld: Any = await L['eldar']();
  const da = eld.units['Dire Avengers'];
  eq('"The Exarch can be equipped..." stays a single tick-box', da.option_groups.filter((g: Any) => inlinePerModelCap(da, g, 5) !== null).length, 0);
  const igc: Any = await L['imperial_guard']();
  const ccs = igc.units['Company Command Squad'];
  eq('"One Veteran may be equipped..." stays single', ccs.option_groups.filter((g: Any) => inlinePerModelCap(ccs, g, 4) !== null).length, 0);

  process.exit(bad ? 1 : 0);
})();
