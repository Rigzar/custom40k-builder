/**
 * Tyranids 1.10, Megafauna: the promoted Carnifex "gains the Fearless and Synapse abilities" and "costs +36 points".
 * npx tsx scripts/check_megafauna_promotion.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { computeUnitPoints, resolveUnit } = await import('../src/engine/points');
  const { resolveUnitProfile } = await import('../src/engine/resolver');
  const d: Any = await (FACTION_LOADERS as Any).tyranids();
  const u = d.units['Carnifex Brood'];
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const make = (promoted: boolean): Any => ({ id: 'x', unitName: 'Carnifex Brood', slot: u.slot, size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], archetypeHqUpgrade: promoted });
  const pts = (promoted: boolean, arch = 'Megafauna') => computeUnitPoints(make(promoted), u, arch, 'Tyranids', 4000);
  ok(pts(true) - pts(false) === 36, `the promoted Carnifex costs +36 points (got ${pts(true) - pts(false)})`);
  ok(pts(true, 'Swarming Masses') === pts(false, 'Swarming Masses'), 'the surcharge belongs to Megafauna only');
  const notes = (promoted: boolean) => {
    const item = make(promoted);
    const st: Any = { army: [item], traits: {}, traitPool: [], archetype: 'Megafauna', legacy: null, legacy2: null, hqMark: null, engagement: 'epic', pointLimit: 4000, armyName: 't', alliedFaction: null, alliedArchetype: null, data: d };
    const rp: Any = resolveUnitProfile(item, resolveUnit(item, d)!, st, d);
    return (rp.injectedRuleNotes ?? []) as string[];
  };
  ok(notes(true).includes('Fearless') && notes(true).includes('Synapse'), `the promoted model shows Fearless and Synapse (${notes(true).join(', ')})`);
  ok(!notes(false).includes('Fearless'), 'an unpromoted Carnifex does not');
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
