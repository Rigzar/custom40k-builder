/**
 * Discord round of 2026-11-27, each claim through the code path the app really uses:
 *  1. Assassins are not offered as an allied detachment (DemonGyro).
 *  2. A Magos / Tech-Priest card shows only the specialisation that was bought (DemonGyro): the sheet prints each one as a TWO-line label
 *     ("Datasmith" then "Cybertheurgy: ..."), and only the first line was kept in the hidden list the cards compare against.
 *  3. Interdimensional Knowledge lets a Changecaster pick two general powers (Sophtym): the validator must accept them with the item
 *     and still refuse them without it.
 *   npx tsx scripts/check_discord_round_2026_11_27.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { getAlliableWith } from '../src/data/alliedMatrix';
import { resolveUnitProfile } from '../src/engine/resolver';
import { validateArmy } from '../src/engine/validators';
import { GENERAL_DISCIPLINES } from '../src/data/generalDisciplines';
type Any = any;
let bad = 0;
const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };

(async () => {
  const L: Any = FACTION_LOADERS;

  for (const f of ['space_marines', 'chaos_space_marines', 'necrons', 'inquisition', 'imperial_guard'])
    eq(`Assassins are not an ally option for ${f}`, getAlliableWith(f).some(o => o.key === 'assassins'), false);
  eq('the Inquisition is still an ally option for Necrons', getAlliableWith('necrons').some(o => o.key === 'inquisition'), true);

  const adm: Any = await L['adeptus_mechanicus']();
  const shown = (unitName: string, optionQty: Any): string[] => {
    const u = adm.units[unitName];
    const item: Any = { id: 'x', unitName, slot: u.slot, size: 1, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
    const st: Any = { army: [item], traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', hqMark: '', engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
    const hidden: string[] = resolveUnitProfile(item, u, st, adm).hiddenUpgradeAbilityLabels.map((h: string) => h.toLowerCase());
    // the same comparison UnitCard and PrintView make
    return u.abilities.filter((ab: string) => {
      const ci = ab.indexOf(':');
      return !hidden.includes((ci > 0 ? ab.substring(0, ci) : ab).trim().toLowerCase());
    }).map((ab: string) => ab.split(/[:\n]/)[0].trim());
  };
  const focus = ['Datasmith', 'Enginseer', 'Manipulus', 'Myrmidax', 'Technoarchaeologist', 'Underseer'];
  const tp = (q: Any) => shown('Tech-Priest', q).filter(n => focus.includes(n));
  eq('Tech-Priest with Datasmith bought shows only Datasmith', tp({ 0: { 0: 1 } }), ['Datasmith']);
  eq('Tech-Priest with Underseer bought shows only Underseer', tp({ 0: { 5: 1 } }), ['Underseer']);
  eq('Tech-Priest with nothing bought shows none of them', tp({}), []);
  const mg = (q: Any) => shown('Magos', q).filter(n => focus.includes(n));
  eq('Magos with Manipulus bought shows only Manipulus', mg({ 2: { 2: 1 } }), ['Manipulus']);
  eq('Magos with Enginseer bought shows only Enginseer', mg({ 2: { 1: 1 } }), ['Enginseer']);

  const cd: Any = await L['chaos_daemons']();
  const general = Object.entries(GENERAL_DISCIPLINES).find(([, ps]) => ps.some(p => p.name !== 'Smite'))!;
  const power = general[1].find(p => p.name !== 'Smite')!;
  const mkState = (withItem: boolean): Any => {
    const item: Any = { id: 'c1', unitName: 'Changecaster', slot: cd.units['Changecaster'].slot, size: 1, optionQty: {}, mark: null,
      armory: withItem ? [{ id: 'a1', itemName: 'Interdimensional Knowledge', source: 'Mark of Tzeentch', section: 'equipment', points: 10 }] : [],
      traits: [], pacts: [], prayers: [], powers: [{ disciplineName: general[0], powerName: power.name }] };
    return { army: [item], traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', legacy3: '', hqMark: 'Tzeentch', engagement: 'pitched', pointLimit: 2000, faction: cd.faction, alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], alliedHqMark: '' };
  };
  const powerErrors = (withItem: boolean) => validateArmy(mkState(withItem), cd, null).filter(v => v.type === 'error' && /not available to this unit/.test(v.text)).length;
  eq('Changecaster WITH Interdimensional Knowledge: a general power is accepted', powerErrors(true), 0);
  eq('Changecaster WITHOUT it: the same power is refused', powerErrors(false), 1);
  process.exit(bad ? 1 : 0);
})();
