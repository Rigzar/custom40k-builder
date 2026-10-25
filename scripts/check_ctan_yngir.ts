/**
 * Necrons 1.5 C'tan Shard: one generic datasheet with up to three upgrades; under Yngir it is an HQ selection,
 * costs +30 and takes up to five: npx tsx scripts/check_ctan_yngir.ts
 */
import { loadBundledFaction } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { computeUnitPoints, groupConstraint } from '../src/engine/points';
import { getEffectiveSlotFor, getArchetypeRule } from '../src/engine/archetypes';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };
(async () => {
  const nec: Any = await loadBundledFaction('necrons');
  const u = nec.units["C'tan Shard"];
  eq('the three named shards are gone', ['Dragon', 'Deceiver', 'Nightbringer'].map(n => !!nec.units[`C'tan Shard of the ${n}`]), [false, false, false]);
  const gi = u.option_groups.findIndex((g: Any) => /upgrades/i.test(g.header));
  const ci = (n: string) => u.option_groups[gi].choices.findIndex((c: Any) => c.name === n);
  const mk = (flag: boolean, picks: string[]): Any => ({ id: 'x', unitName: "C'tan Shard", slot: 'Elites', size: 1, ctanYngirUpgrade: flag,
    optionQty: { [gi]: Object.fromEntries(picks.map(p => [ci(p), 1])) }, armory: [], traits: [], powers: [], prayers: [], pacts: [] });
  const price = (it: Any, arch: string | null) => computeUnitPoints(it, u, arch ?? '', 'Necrons', 2000);
  eq('base 254', price(mk(false, []), null), 254);
  eq('Spear of the Dragon + Untamed Power', price(mk(false, ['Spear of the Dragon', 'Untamed Power']), null), 254 + 12 + 14);
  eq('Yngir +30', price(mk(true, []), 'Yngir'), 284);
  eq('plain cap is three', groupConstraint(u.option_groups[gi], mk(false, []), u).max, 3);
  eq('Yngir cap is five', groupConstraint(u.option_groups[gi], mk(true, []), u).max, 5);
  eq('Yngir shard counts as HQ', getEffectiveSlotFor(mk(true, []), getArchetypeRule('Yngir')), 'HQ');
  const state: Any = { army: [], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
  const it = mk(false, ['Gaze of Death', 'Hardened Necrodermis', 'Untamed Power']);
  const r: Any = resolveUnitProfile(it, u, { ...state, army: [it] }, nec);
  const names = r.weaponGroups.flatMap((g: Any) => g.weapons.map((w: Any) => w.name));
  eq('weapons: Fists + Gaze of Death only', names.sort(), ['Fists of a Star God', 'Gaze of Death']);
  // Necrons 1.7: the Spear and the Scythe REPLACE the Fists of a Star God.
  const namesOf = (picks: string[]) => { const it2 = mk(false, picks); return resolveUnitProfile(it2, u, { ...state, army: [it2] }, nec).weaponsToShow.map((w: Any) => w.name).sort(); };
  eq('Spear of the Dragon replaces the Fists', namesOf(['Spear of the Dragon']), ['Spear of the Dragon']);
  eq('Scythe + Gaze of Death: no Fists', namesOf(['Scythe of the Nightbringer', 'Gaze of Death']), ['Gaze of Death', 'Scythe of the Nightbringer']);
  eq('Spear costs 12', price(mk(false, ['Spear of the Dragon']), null), 254 + 12);
  eq('Scythe costs 20', price(mk(false, ['Scythe of the Nightbringer']), null), 254 + 20);
  const m = r.models?.[0]?.stats ?? r.stats;
  console.log('stats', JSON.stringify(m));
  process.exit(bad ? 1 : 0);
})();
