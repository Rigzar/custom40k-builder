/**
 * A weapon-target Armory item ("One ranged weapon of the model gains +1 Strength", Reaver Weapon, relics...) must only be
 * offered the weapons the buying model carries. The picker listed the whole datasheet, so an Aspiring Champion could be
 * pointed at the squad's Flamer or Plasma gun (Discord, 2026-10-11). npx tsx scripts/check_armory_weapon_targets.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { resolveUnit } = await import('../src/engine/points');
  const { resolveUnitProfile, armoryWeaponTargets } = await import('../src/engine/resolver');
  const { weaponTargetKind } = await import('../src/engine/equipMods');
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const names = (fk: string, build: (d: Any) => { unit: string; slot: string; sizes?: Record<string, number>; opts?: Any; armory?: Any[] }) => (async () => {
    const d: Any = await (FACTION_LOADERS as Any)[fk]();
    const b = build(d);
    const S = () => useArmyStore.getState();
    S().clearArmy(); S().setData(d); S().setPointLimit(3000);
    S().addUnit(b.unit, b.slot);
    const id = S().army[0].id;
    for (const [m, n] of Object.entries(b.sizes ?? {})) S().updateModelSize(id, m, n);
    for (const [gi, ch] of Object.entries(b.opts ?? {})) for (const [ci, q] of Object.entries(ch as Any)) S().setOptionQty(id, Number(gi), ci, q as number);
    for (const a of b.armory ?? []) S().addArmoryItem(id, a);
    const e = S().army[0]; const u = resolveUnit(e, S().data!)!;
    const rp: Any = resolveUnitProfile(e, u, S() as Any, S().data!);
    return armoryWeaponTargets(u, e, rp).map((w: Any) => w.name);
  })();

  // CSM squad: one Flamer, one Plasma gun, a Power fist, and the Champion promoted (the one with Armory access)
  const csm = await names('chaos_space_marines', () => ({
    unit: 'Chaos Space Marines', slot: 'Troops',
    sizes: { 'Chaos Space Marine': 9, 'Chaos Space Marine Champion': 1 },
    opts: { 1: { 0: 1, 3: 1 }, 2: { 1: 1 }, 3: { __inline: 1 } },
  }));
  console.log('   aspiring champion can target:', csm.join(', '));
  ok(csm.includes('Bolter') && csm.includes('Astartes Chainsword'), 'the Champion is offered his own Bolter and Chainsword');
  ok(!csm.some(n => /Flamer|Plasma gun|Heavy bolter|Power fist/.test(n)), 'and none of the squad\'s Flamer / Plasma gun / Power fist');
  ok(weaponTargetKind('One ranged weapon of the model gains +1 Strength for all of its profiles.') === 'ranged', 'Maelstrom Weapon reads as a ranged-weapon item');
  ok(weaponTargetKind('One melee weapon of the model gains +1 Strength for all of its profiles.') === 'melee', 'Reaver Weapon reads as a melee-weapon item');
  ok(weaponTargetKind('One weapon of the model gains +1 Damage.') === 'any', 'a plain "weapon of the model" item takes any');

  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
