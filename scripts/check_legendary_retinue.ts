/**
 * Guard for the Legendary Retinue (Imperial Navy 1.1 / Inquisition 1.3, HQ): npx tsx scripts/check_legendary_retinue.ts
 * Builds lists through the real store, injects the member codices the way App.tsx does, and asserts the sheet's rules.
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
let bad = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { validateArmy, computeFreeSlotAdjustments } = await import('../src/engine/validators');
  const { retinueFactionKeys, retinueEligible } = await import('../src/engine/legendaryRetinue');
  const { computeUnitPoints, resolveUnit, effectiveArchetypeFor, factionForEntry } = await import('../src/engine/points');
  const { resolveUnitProfile } = await import('../src/engine/resolver');
  const S = () => useArmyStore.getState();
  const L = (k: string): Promise<Any> => (FACTION_LOADERS as Any)[k]();

  async function setup(primary: string, archetype: string | null) {
    const d = await L(primary);
    S().clearArmy(); S().setData(d); S().setEngagement('pitched'); S().setPointLimit(3000);
    (S() as Any).setArchetype?.(archetype);
    for (const key of retinueFactionKeys(d.faction, archetype)) S().injectArchetypeFaction(key, await L(key));
    return d;
  }
  const hqOf = (key: string): string[] => ((S().data as Any).allied[key].slot_to_units.HQ as string[]).filter(n => retinueEligible((S().data as Any).allied[key].units[n]));
  const addMember = (key: string, name?: string): Any => {
    const n = name ?? hqOf(key)[0]; S().addUnit(n, 'HQ', key, undefined, true); return S().army[S().army.length - 1];
  };
  const errs = () => validateArmy(S() as Any, S().data!, null).filter(v => v.type === 'error').map(v => v.text);

  for (const [primary, home] of [['imperial_navy', 'Imperial Navy'], ['inquisition', 'Inquisition']] as const) {
    console.log('==', home);
    await setup(primary, null);
    check(retinueFactionKeys(home, null).join() === 'adeptus_mechanicus,adeptus_sororitas,imperial_guard,space_marines', home + ': base codices are AdM, AdS, IG, SM');
    check(retinueFactionKeys('Space Marines', null).length === 0, 'other armies have no Retinue');
    for (const k of retinueFactionKeys(home, null)) check(hqOf(k).length > 0, `${k} offers eligible HQ models (${hqOf(k).slice(0, 3).join(', ')}...)`);

    // 4 models, one per codex: legal, share ONE HQ slot, price and resolve like any unit
    S().clearArmy();
    const members = retinueFactionKeys(home, null).map(k => addMember(k));
    check(!errs().some(t => /Retinue/.test(t)), 'one model from each of the four codices is a legal Retinue');
    const st: Any = S();
    const free = computeFreeSlotAdjustments(st.army, st.data, null as Any, st);
    check(free.hq === 3, 'four Retinue models share one HQ slot (3 exempt)');
    let priced = true;
    for (const e of st.army) { const u = resolveUnit(e, st.data); if (!u) { priced = false; continue; } try { resolveUnitProfile(e, u, st, st.data); if (computeUnitPoints(e, u, effectiveArchetypeFor(e, st), factionForEntry(e, st.data), st.pointLimit) <= 0) priced = false; } catch { priced = false; } }
    check(priced, 'every Retinue model resolves and prices through its own codex');

    // two from one codex, and a fifth model
    addMember('space_marines', hqOf('space_marines')[1] ?? hqOf('space_marines')[0]);
    check(errs().some(t => /only one model per codex/.test(t)), 'two models of one codex are refused');
    check(errs().some(t => /up to 4 models/.test(t)), 'a fifth model is refused');

    // a codex the army cannot draw from
    S().clearArmy(); addMember('space_marines');
    S().addUnit(Object.keys((S().data as Any).allied.imperial_guard.units)[0], 'HQ', 'imperial_guard', undefined, true);
    // retinue member whose codex is not allowed for this army (Tau needs Iconoclast)
    (S().data as Any).allied.tau_empire = await L('tau_empire');
    S().clearArmy(); S().addUnit((await L('tau_empire')).slot_to_units.HQ[0], 'HQ', 'tau_empire', undefined, true);
    check(errs().some(t => /cannot take Retinue models from/.test(t)), 'Tau models need the Iconoclast archetype');

    // unique equipment
    S().clearArmy(); const m = addMember('space_marines');
    const smA = (S().data as Any).allied.space_marines.armory_general;
    const uniq = [...smA.equipment, ...smA.weapons].find((x: Any) => /\bunique\b/i.test(x.desc ?? '') || /\bunique\b/i.test(x.abilities ?? ''));
    if (uniq) {
      S().updateUnit(m.id, { armory: [{ id: 'a1', itemName: uniq.name, source: 'Armory', section: 'equipment', points: 0 } as Any] });
      check(errs().some(t => /unique equipment/.test(t)), `unique equipment (${uniq.name}) is refused on a Retinue model`);
    }
  }

  // archetype extras
  await setup('imperial_navy', 'Heretic');
  check(retinueFactionKeys('Imperial Navy', 'Heretic').includes('chaos_space_marines') && !retinueFactionKeys('Imperial Navy', 'Heretic').includes('tau_empire'), 'Heretic adds the Chaos codices only');
  addMember('chaos_space_marines');
  check(!errs().some(t => /cannot take Retinue models from/.test(t)), 'Heretic lets a Chaos Space Marines model in');
  await setup('imperial_navy', 'Iconoclast');
  check(retinueFactionKeys('Imperial Navy', 'Iconoclast').includes('tau_empire'), 'Iconoclast adds T\'au Empire');

  console.log(bad ? `${bad} failure(s)` : 'ok: Legendary Retinue guard passed');
  process.exit(bad ? 1 : 0);
})();
