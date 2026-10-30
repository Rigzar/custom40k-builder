/** Knight Households: Pilot (a Scion for each Knight), Freeblade (one Scion, one Knight), Chaos Knights, Peasant's Duty on <Feudal Levy> units. */
import { FACTION_LOADERS } from '../src/data/loaders';
import { validateArmy } from '../src/engine/validators';
import { getRelationship as relationship } from '../src/data/alliedMatrix';
import { resolveUnitProfile } from '../src/engine/resolver';
(async () => {
  const d: any = await (FACTION_LOADERS as any)['knight_households']();
  const fails: string[] = [];
  const mk = (id: string, n: string): any => ({ id, unitName: n, slot: d.units[n].slot, size: d.units[n].default_size ?? 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] });
  const errors = (names: string[], archetype: string | null = null) => {
    const army = names.map((n, i) => mk('u' + i, n));
    const res: any = validateArmy({ traits: {}, traitPool: [], archetype, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2500, alliedFaction: null, alliedArchetype: null, army } as any, d, d);
    return ((res.items ?? res) as any[]).filter(i => i.type === 'error').map(i => String(i.text));
  };
  if (!errors(['Scion', 'Knight Paladin']).every(e => !/Pilot/.test(e))) fails.push('one Scion + one Knight is legal');
  if (!errors(['Scion', 'Knight Paladin', 'Knight Paladin']).some(e => /Pilot/.test(e))) fails.push('two Knights with one Scion must trip Pilot');
  if (!errors(['Knight Paladin']).some(e => /Pilot/.test(e))) fails.push('a Knight without a Scion must trip Pilot');
  if (!errors(['Scion', 'Scion', 'Knight Paladin', 'Knight Paladin'], 'Freeblade').some(e => /Freeblade/.test(e))) fails.push('Freeblade allows one Scion and one Knight');
  for (const n of ['Feudal Levy', 'Men-at-Arms', 'Royal Guard', 'Yeomen', 'Lancebreakers', 'Siegebreakers', 'War Wagon'])
    if (!(d.units[n].abilities ?? []).some((a: string) => /^The Peasant's Duty/.test(a))) fails.push(`${n} should carry The Peasant's Duty`);
  if (relationship('knight_households', 'imperial_guard') !== 'G') fails.push('Knight Households and Imperial Guard are Battle Brothers');
  if (relationship('knight_households', 'tyranids') !== 'R') fails.push('Knight Households vs Tyranids is red, like the Guard');
  // the paid promotions the sheet writes together with the Armory access (they were dropped as plain flags once)
  for (const [n, to] of [['Men-at-Arms', 'Captain'], ['Lancers', 'Lancer Captain'], ['Mounted Pistoleers', 'Outrider']] as const)
    if (!d.units[n].option_groups.some((g: any) => g.variant_link === to && g.inline_pts)) fails.push(`${n}: the upgrade to ${to} is missing`);
  const prof = (unit: string, optionQty: any, armory: any[] = []) => { const u = d.units[unit]; const item: any = { id: 'x', unitName: unit, slot: u.slot, size: 10, optionQty, armory, traits: [], powers: [], prayers: [], pacts: [] };
    return resolveUnitProfile(item, u, { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2500, alliedFaction: null, alliedArchetype: null } as any, d) as any; };
  if (prof('Royal Guard', { 0: { 0: 10 } }).optionStatSets?.SV !== '4+') fails.push('Heavy armor must give a 4+ save');
  if (!(prof('Yeomen', { 4: { 0: 1 } }).optionAbilities ?? []).includes('Infiltrator')) fails.push('the Infiltrator option must grant Infiltrator');
  const rep = (name: string) => ({ id: 'a', itemName: name, source: 'Knight Households Armory', section: 'equipment', points: 10 });
  if (!prof('Knight Paladin', {}, [rep('Wyrd')]).effectivePsyker) fails.push('Wyrd must make the Knight a psyker');
  if (!(prof('Knight Paladin', {}, [rep('Paragon')]).optionStatMods ?? []).some((m: any) => m.stat === 'HP' && m.delta === 1)) fails.push('Paragon must give +1 Hull Point');
  if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
  console.log('OK  Knight Households: Pilot, Freeblade, Peasant\'s Duty, ally row');
})();
