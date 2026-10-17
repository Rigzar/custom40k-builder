/**
 * Sheets of 2026-10-17 (Orks 1.5, Tau 1.4, Necrons 1.7): the RULES apply, not just the data
 * (Lugga, Grot Mega armor, the four Orks units, the Gretchin Revolutionary Committee, the Kroot Shaman):
 *   npx tsx scripts/check_oct17_sheets.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { computeUnitPoints } from '../src/engine/points';
import { effectiveKeywords } from '../src/engine/keywords';
import { isUnitAllowed, getArchetypeRule } from '../src/engine/archetypes';
import { dataForArchetype } from '../src/engine/archetypes/dataPatch';
type Any = any;
let bad = 0;
const eq = (l: string, a: unknown, b: unknown) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l);
};
(async () => {
  const orks: Any = await (FACTION_LOADERS as Any).orks();
  const mk = (name: string, over: Any = {}): Any => ({ id: 'x', unitName: name, slot: orks.units[name]?.slot ?? 'HQ', size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], ...over });
  const stOf = (items: Any[]): Any => ({ army: items, faction: 'Orks', data: orks, traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', hqMark: null, engagement: 'epic', pointLimit: 4000, alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0 });
  const prof = (it: Any) => resolveUnitProfile(it, orks.units[it.unitName], stOf([it]), orks) as Any;
  const pts = (it: Any) => computeUnitPoints(it, orks.units[it.unitName], '', 'Orks', 4000);

  // Lugga / Big Lugga
  const tk = orks.units['Trukk'];
  const lg = tk.option_groups.findIndex((g: Any) => g.choices.some((c: Any) => c.name === 'Lugga'));
  const t0 = mk('Trukk'), t1 = mk('Trukk', { optionQty: { [lg]: { 0: 1 } } });
  eq('Trukk + Lugga costs 15 more', pts(t1) - pts(t0), 15);
  eq('Trukk + Lugga: BS 4+', prof(t1).optionStatSets.BS, '4+');
  eq('Trukk without Lugga: no BS change', prof(t0).optionStatSets.BS, undefined);
  const wg = orks.units['Wagon'];
  const bl = wg.option_groups.findIndex((g: Any) => g.choices.some((c: Any) => c.name === 'Big Lugga'));
  eq('Wagon + Big Lugga costs 40 more', pts(mk('Wagon', { optionQty: { [bl]: { 0: 1 } } })) - pts(mk('Wagon')), 40);

  // Grot Mega armor: Nobz only, +1 T, 2+ save, WS and BS exactly 4+
  const sel = { id: 'a1', itemName: 'Grot Mega armor', source: 'General', section: 'equipment', points: 27 };
  eq('Grot Mega armor is for Nobz', [effectiveKeywords(orks.units['Nobz']).map((k: string) => k.toLowerCase()).includes('nobz'), effectiveKeywords(orks.units['Boyz']).map((k: string) => k.toLowerCase()).includes('nobz')], [true, false]);
  const pn = prof(mk('Nobz', { armory: [sel] }));
  eq('Nob in Grot Mega armor: WS and BS 4+ (WS 3+ gets worse)', [pn.optionStatExact.WS, pn.optionStatExact.BS], ['4+', '4+']);
  eq('Grot Mega armor: +1 Toughness and 2+ armor save', [pn.equipMods.statDeltas.T, pn.equipMods.armorSave], [1, 2]);
  eq('without it: nothing exact', prof(mk('Nobz')).optionStatExact.WS, undefined);

  // the four new units exist in the right slot and cost what the sheet says
  const exp: Record<string, [string, number]> = { 'Head Honcho': ['HQ', 35], 'Banna Wava': ['Elites', 16], 'Grot Mega Tank': ['Heavy Support', 187], 'Grot Cutta': ['Dedicated Transport', 49] };
  for (const [n, [slot, p]] of Object.entries(exp)) eq(`${n}: slot ${slot}, base ${p}`, [orks.units[n]?.slot, pts(mk(n))], [slot, p]);
  const hh = orks.units['Head Honcho'];
  const rg = hh.option_groups.findIndex((g: Any) => g.variant_link === 'Red Gobbo');
  eq('Red Gobbo upgrade costs +15', pts(mk('Head Honcho', { optionQty: { [rg]: { __inline: 1 } } })) - 35, 15);
  eq('Banna Wava is an advisor with armory access', [orks.units['Banna Wava'].advisor, orks.units['Banna Wava'].has_armory_access], [true, true]);
  const gt = orks.units['Grot Mega Tank'];
  const big = gt.option_groups[0].choices.findIndex((c: Any) => c.name === 'Twin-linked big shoota');
  const small = gt.option_groups[1].choices.findIndex((c: Any) => c.name === 'Big shoota');
  const tank = mk('Grot Mega Tank', { optionQty: { 0: { [big]: 3 }, 1: { [small]: 4 } } });
  eq('Grot Mega Tank, 3 big + 4 small turrets: 187 + 102 + 68', pts(tank), 357);
  eq('its weapon rows follow the picks', prof(tank).weaponsToShow.map((w: Any) => w.name).sort(), ['Big shoota', 'Twin-linked big shoota']);
  const cu = orks.units['Grot Cutta'];
  const rk = cu.option_groups[0].choices.findIndex((c: Any) => c.name === 'Rokkit launcha');
  const gc = mk('Grot Cutta', { optionQty: { 0: { [rk]: 1 } } });
  eq('Grot Cutta + Rokkit launcha: +23 and the row appears', [pts(gc) - 49, prof(gc).weaponsToShow.map((w: Any) => w.name)], [23, ['Rokkit launcha']]);

  // Gretchin Revolutionary Committee
  const rule: Any = getArchetypeRule('Gretchin Revolutionary Committee');
  const ok = (n: string) => isUnitAllowed(n, orks.units[n], rule, 'Orks' as Any);
  eq('Committee allows Gretchins, Snotlings, Head Honcho, Banna Wava, vehicles', ['Gretchins', 'Snotlings', 'Head Honcho', 'Banna Wava', 'Trukk', 'Grot Mega Tank'].map(ok), [true, true, true, true, true, true]);
  eq('Committee refuses Boyz, Nobz and Weirdboy', ['Boyz', 'Nobz', 'Weirdboy'].map(ok), [false, false, false]);
  eq('Committee asks 15% of the game for Troops', rule.troopsMinRatio, 0.15);
  const cd: Any = dataForArchetype(orks, 'Gretchin Revolutionary Committee');
  const gcu = cd.units['Gretchins'];
  eq('Committee: no Runtherd, no Cowardly, 30 pts for 10 Gretchins', [gcu.models.find((m: Any) => m.name === 'Runtherd').max, gcu.abilities.some((a: string) => /^Cowardly/.test(a)), gcu.min_cost], [0, false, 30]);
  eq('leaving the Committee restores both', dataForArchetype(cd, '').units['Gretchins'].models.find((m: Any) => m.name === 'Runtherd').max, 3);

  // Kroot Shaman: a CHOICE that makes the model a psyker
  const tau: Any = await (FACTION_LOADERS as Any).tau_empire();
  const ms = tau.units['Kroot Master Shaper'];
  const sg = ms.option_groups.findIndex((g: Any) => g.choices.some((c: Any) => c.name === 'Shaman'));
  const sc = ms.option_groups[sg].choices.findIndex((c: Any) => c.name === 'Shaman');
  const stT = (it: Any): Any => ({ army: [it], faction: 'Tau Empire', data: tau, traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', hqMark: null, engagement: 'epic', pointLimit: 4000, alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0 });
  const k0: Any = { id: 'k', unitName: 'Kroot Master Shaper', slot: 'HQ', size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
  const k1: Any = { ...k0, optionQty: { [sg]: { [sc]: 1 } } };
  eq('Kroot Shaman: psyker only when chosen, +5 points',
    [resolveUnitProfile(k0, ms, stT(k0), tau).effectivePsyker, resolveUnitProfile(k1, ms, stT(k1), tau).effectivePsyker,
      computeUnitPoints(k1, ms, '', 'Tau Empire', 4000) - computeUnitPoints(k0, ms, '', 'Tau Empire', 4000)], [false, true, 5]);
  process.exit(bad ? 1 : 0);
})();
