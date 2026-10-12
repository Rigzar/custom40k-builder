/**
 * Custom40k Missions (Skirmish), 2026-10: "Only Archetypes that are available in Skirmish may be selected" (the codex's
 * AVAILABLE IN SKIRMISH? column) and Allies: "Allies do not use their own AOP... Must include 1 Troops unit. May include up
 * to one of: 1 Elite / 1 Fast Attack / 1 Heavy Support."      npx tsx scripts/check_skirmish_allies.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { validateArmy } = await import('../src/engine/validators');
  const S = () => useArmyStore.getState();
  const ig: Any = await (FACTION_LOADERS as Any).imperial_guard();
  const sm: Any = await (FACTION_LOADERS as Any).space_marines();
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const errors = () => validateArmy(S() as Any, S().data!, S().alliedData).filter((v: Any) => v.type === 'error').map((v: Any) => v.text as string);
  const fresh = (archetype = '') => {
    S().clearArmy(); S().setData(ig); S().setEngagement('skirmish'); S().setPointLimit(1500);
    if (archetype) S().setArchetype(archetype);
  };
  const addAlly = async () => { S().setAlliedFaction('space_marines'); S().setAlliedData(sm); };
  const add = (unit: string, slot: string, allied = false) => S().addUnit(unit, slot, allied ? 'space_marines' : undefined);

  // archetypes
  fresh("Traitor Guard");
  ok(!errors().some(e => /archetype/i.test(e) && /not available in Skirmish/i.test(e)), 'Traitor Guard is marked YES for Skirmish and is accepted');
  fresh('Veteran Company');
  ok(errors().some(e => /Veteran Company/.test(e) && /not available in Skirmish/i.test(e)), 'Veteran Company is not available in Skirmish and is refused');

  // allies: one Troops + one Elite is the legal shape
  fresh(); await addAlly();
  add('Tactical Squad', 'Troops', true); add('Terminator Squad', 'Elites', true);
  let e = errors();
  ok(!e.some(x => /Skirmish allies/.test(x)), 'one allied Troops + one allied Elite is legal');
  ok(!e.some(x => /Allied Detachments are not allowed/i.test(x)), 'an allied detachment is no longer refused in Skirmish');
  // a second allied Troops
  add('Tactical Squad', 'Troops', true);
  ok(errors().some(x => /exactly 1 Troops/.test(x)), 'a second allied Troops unit is refused');
  // no allied Troops at all
  fresh(); await addAlly(); add('Terminator Squad', 'Elites', true);
  ok(errors().some(x => /exactly 1 Troops/.test(x)), 'an ally without a Troops unit is refused');
  // two extras
  fresh(); await addAlly(); add('Tactical Squad', 'Troops', true); add('Terminator Squad', 'Elites', true); add('Devastator Squad', 'Heavy Support', true);
  ok(errors().some(x => /at most 1 Elite, Fast Attack or Heavy Support/.test(x)), 'two allied extras (Elite + Heavy Support) are refused');
  // allied HQ
  fresh(); await addAlly(); add('Tactical Squad', 'Troops', true); add('Lieutenant', 'HQ', true);
  ok(errors().some(x => /HQ/.test(x) && /not allowed/i.test(x)), 'an allied HQ is not allowed');
  // the allies share the regular AOP: main Troops 3 + allied Troops 1 = 4 > 1-3
  fresh(); await addAlly();
  add('Infantry Squad', 'Troops'); add('Infantry Squad', 'Troops'); add('Infantry Squad', 'Troops'); add('Tactical Squad', 'Troops', true);
  ok(errors().some(x => /Troops/.test(x) && /(max|over)/i.test(x)), 'allied Troops count against the army\'s regular 1-3 Troops');
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
