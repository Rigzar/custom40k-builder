/**
 * Guard for the Imperial Navy faction (Imperial Navy 1.0.ods): npx tsx scripts/check_imperial_navy.ts
 * Builds lists through the real store and asserts the sheet's own rules reach the validator.
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
let bad = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { bad++; console.log('FAIL', msg); } };
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { validateArmy } = await import('../src/engine/validators');
  const { computeUnitPoints, resolveUnit, effectiveArchetypeFor, factionForEntry } = await import('../src/engine/points');
  const { getRelationship } = await import('../src/data/alliedMatrix');
  const navy: Any = await (FACTION_LOADERS as Any).imperial_navy();
  const S = () => useArmyStore.getState();

  // every slot_to_units entry resolves, and every unit prices and has a slot
  const names = Object.values(navy.slot_to_units).flat() as string[];
  check(names.length === 34, `expected 34 units, got ${names.length}`);
  for (const n of names) check(!!navy.units[n], `slot_to_units names ${n} but units{} has none`);
  check(navy.archetypes.map((a: Any) => a.name).join() === 'Heretic,Iconoclast' && navy.archetypes.every((a: Any) => a.skirmish === true), 'Heretic/Iconoclast must both be skirmish-legal');

  S().clearArmy(); S().setData(navy); S().setEngagement('pitched'); S().setPointLimit(2500);
  const add = (n: string, size?: number): Any => {
    const slot = Object.entries(navy.slot_to_units).find(([, v]: Any) => v.includes(n))![0] as string;
    S().addUnit(n, slot); const e: Any = S().army[S().army.length - 1]; if (size) S().updateUnit(e.id, { size }); return e;
  };
  const price = (e: Any) => { const st: Any = S(); const cur = st.army.find((x: Any) => x.id === e.id); const u = resolveUnit(cur, st.data)!; return computeUnitPoints(cur, u, effectiveArchetypeFor(cur, st), factionForEntry(cur, st.data), st.pointLimit); };
  const errs = () => validateArmy(S() as Any, S().data!, null).filter(v => v.type === 'error').map(v => v.text);

  // sheet prices
  const rt = add('Rogue Trader'); check(price(rt) === 36, 'Rogue Trader 36');
  S().setOptionQty(rt.id, 0, '__inline', 1); check(price(rt) === 51, 'Rogue Trader Majoris 51');
  check(price(add('Vendetta')) === 471, 'Vendetta 471');
  check(price(add('Valkyrie')) === 175, 'Valkyrie 175');
  check(price(add('Ratings', 10)) === 60, 'Ratings x10 = 60');

  // Skyhammer Doctrine: Pitched allows 2 Flyers, doubled to 4
  S().clearArmy();
  for (let i = 0; i < 4; i++) add('Lightning');
  check(!errs().some(t => /Flyers over maximum/.test(t)), 'four Flyers are legal for the Navy (Skyhammer Doctrine)');
  check(!validateArmy(S() as Any, S().data!, null).some(v => /second AOP/.test(v.text)), 'four Flyers do not open a second AOP');
  add('Lightning');
  check(errs().some(t => /Flyers over maximum/.test(t)), 'a fifth Flyer is over the doubled cap');
  check(validateArmy(S() as Any, S().data!, null).some(v => /second AOP/.test(v.text)), 'a fifth Flyer needs a second AOP');

  // Voidmaster / Explorator are free per Rogue Trader, not beyond
  S().clearArmy();
  add('Rogue Trader'); add('Voidmaster'); add('Voidmaster'); add('Explorator'); add('Explorator');
  const notes = validateArmy(S() as Any, S().data!, null).map(v => v.text).join('\n');
  check(/Voidmaster: 1 of 2 units exempted/.test(notes), 'one Voidmaster per Rogue Trader exempt');
  check(/Explorator: 1 of 2 units exempted/.test(notes), 'one Explorator per Rogue Trader exempt');

  // Henchman Warband: one per Rogue Trader, 6 models (12 with a Majoris)
  S().clearArmy();
  const t1 = add('Rogue Trader'); const w1 = add('Henchman Warband', 7);
  check(errs().some(t => /up to 6 specialist/.test(t)), 'Warband of 7 over the Rogue Trader cap of 6');
  S().setOptionQty(t1.id, 0, '__inline', 1);
  check(!errs().some(t => /specialist models/.test(t)), 'Warband of 7 fine with a Majoris');
  S().updateUnit(w1.id, { size: 13 });
  check(errs().some(t => /up to 12 specialist/.test(t)), 'Warband of 13 over the Majoris cap of 12');
  add('Henchman Warband', 3);
  check(errs().some(t => /each Rogue Trader may select a single Warband/.test(t)), 'two Warbands for one Rogue Trader');

  // ally chart (Core Rules 1.279): IN row GGGYYYYYYGYYYYYGYR over AdC..Tyr
  const rel = (a: string, b: string) => getRelationship(a, b);
  check(rel('imperial_navy', 'imperial_guard') === 'G', 'Navy–Imperial Guard is green');
  check(rel('imperial_navy', 'tyranids') === 'R', 'Navy–Tyranids is red');
  check(rel('imperial_navy', 'orks') === 'Y', 'Navy–Orks is yellow');
  check(rel('imperial_guard', 'imperial_navy') === 'G', 'chart is symmetric for Navy–Guard');

  // upgrade ability lines hide until bought (Flak Armor, Carapace Armor, Boarding shield bundled in a choice)
  const { resolveUnitProfile } = await import('../src/engine/resolver');
  const hidden = (unit: string, optionQty: Any): string[] => { const u = navy.units[unit]; const item: Any = { id: 'x', unitName: unit, slot: u.slot, size: 10, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] }; const st: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2500, alliedFaction: null, alliedArchetype: null }; return (resolveUnitProfile(item, u, st, navy) as Any).hiddenUpgradeAbilityLabels; };
  check(hidden('Ratings', {}).includes('Flak Armor') && !hidden('Ratings', { 1: { 0: 1 } }).includes('Flak Armor'), 'Flak Armor line hides until bought');
  check(hidden('Voidsmen', {}).includes('Boarding shield') && !hidden('Voidsmen', { 1: { 3: 1 } }).includes('Boarding shield'), 'Boarding shield line hides until the bundle is bought');
  console.log(bad ? `${bad} failure(s)` : 'ok: Imperial Navy guard passed');
  process.exit(bad ? 1 : 0);
})();
