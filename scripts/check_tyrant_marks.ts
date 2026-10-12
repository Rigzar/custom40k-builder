/**
 * Legacy of the Tyrant (Red Corsairs, codex 1.03) says, like Hydra / Iron Lord / Night Haunter: "Can only select Chaos Space
 * Marine units with no Mark or the Mark of Chaos Undivided." The Tyrant was missing from both validator lists, so a Khorne
 * unit passed. npx tsx scripts/check_tyrant_marks.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { validateArmy } = await import('../src/engine/validators');
  const csm: Any = await (FACTION_LOADERS as Any).chaos_space_marines();
  const S = () => useArmyStore.getState();
  let bad = 0;
  const errorsFor = (legacy: string, mark: string | null) => {
    S().clearArmy(); S().setData(csm); S().setEngagement('pitched'); S().setPointLimit(2500); S().setLegacy(legacy);
    S().addUnit('Chaos Space Marines', 'Troops');
    const e = S().army[0];
    if (mark) S().updateUnit(e.id, { mark: mark as Any });
    return validateArmy(S() as Any, S().data!, S().alliedData).filter((v: Any) => v.type === 'error' && /Mark of|Legacy of/i.test(v.text));
  };
  const withMark = errorsFor('Legacy of the Tyrant', 'Khorne');
  if (!withMark.length) { bad++; console.log('FAIL a Khorne squad passes under the Legacy of the Tyrant'); } else console.log('ok   Khorne squad is flagged:', withMark[0].text);
  const plain = errorsFor('Legacy of the Tyrant', null);
  if (plain.length) { bad++; console.log('FAIL an unmarked squad is flagged:', plain[0].text); } else console.log('ok   an unmarked squad is fine');
  const undiv = errorsFor('Legacy of the Tyrant', 'Undivided');
  if (undiv.length) { bad++; console.log('FAIL an Undivided squad is flagged:', undiv[0].text); } else console.log('ok   an Undivided squad is fine');
  const warm = errorsFor('Legacy of the Warmaster', 'Khorne');
  if (warm.length) { bad++; console.log('FAIL the Warmaster must still allow marks:', warm[0].text); } else console.log('ok   Legacy of the Warmaster still allows marks');
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
