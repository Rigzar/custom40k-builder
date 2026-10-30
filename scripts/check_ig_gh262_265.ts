/** GH#262 (Abhuman Auxiliaries opt-in), GH#264 (bought Heavy stubber survives a swap), GH#265 (Sentinel chainsaw per model). */
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { computeUnitPoints } from '../src/engine/points';
import { OPT_IN_TRAITS, optInTraitApplies } from '../src/store/army';
(async () => {
  const d: any = await (FACTION_LOADERS as any)['imperial_guard']();
  const fails: string[] = [];
  const st = (item: any): any => ({ army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2500, alliedFaction: null, alliedArchetype: null });
  const mk = (name: string, size: number, optionQty: any = {}, armory: any[] = []): any => ({ id: 'x', unitName: name, slot: d.units[name].slot, size, optionQty, armory, traits: [], powers: [], prayers: [], pacts: [] });

  if (!OPT_IN_TRAITS.has('Abhuman Auxiliaries')) fails.push('Abhuman Auxiliaries must be opt-in');
  for (const [n, want] of [['Ogryns', false], ['Ratlings', false], ['Bullgryns', false], ['Infantry Squad', true], ['Armoured Sentinels', false], ['Chimera', false]] as const)
    if (d.units[n] && optInTraitApplies('Abhuman Auxiliaries', d.units[n]) !== want) fails.push(`Abhuman Auxiliaries on ${n} should be ${want}`);

  const stub = { id: 'a', itemName: 'Heavy stubber', source: 'Armory', section: 'equipment', points: 15 };
  const m = mk('Malcador', 1, { 2: { 0: 1 } }, [stub]);
  const shown = resolveUnitProfile(m, d.units['Malcador'], st(m), d).weaponsToShow.map((w: any) => w.name);
  if (!shown.includes('Heavy stubber')) fails.push('Malcador that swapped its stubbers and bought one must show a Heavy stubber');

  const pts = (size: number, q: any) => { const it = mk('Sentinel', size, q); return computeUnitPoints(it, d.units['Sentinel'], st(it), d); };
  if (pts(3, { 1: { __inline: 1 } }) - pts(3, {}) !== 45) fails.push('Sentinel chainsaw on 3 Sentinels must cost 3 x 15');
  if (pts(1, { 1: { __inline: 1 } }) - pts(1, {}) !== 15) fails.push('Sentinel chainsaw on 1 Sentinel must cost 15');

  if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
  console.log('OK  GH#262/264/265');
})();
