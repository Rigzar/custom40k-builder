/**
 * Legendary Retinue: "You may select up to 4 MODELS" - each member is one model, never a squad (GitHub, DemonGyro 2026-11-24: a T'au
 * Sub-commander could be taken as 2). npx tsx scripts/check_retinue_one_model.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
let bad = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { useArmyStore } = await import('../src/store/army');
  const { validateArmy } = await import('../src/engine/validators');
  const { retinueFactionKeys } = await import('../src/engine/legendaryRetinue');
  const S = () => useArmyStore.getState();
  const L = (k: string): Promise<Any> => (FACTION_LOADERS as Any)[k]();
  const d = await L('inquisition');
  S().clearArmy(); S().setData(d); S().setEngagement('pitched'); S().setPointLimit(3000);
  (S() as Any).setArchetype?.('Iconoclast');
  for (const key of retinueFactionKeys(d.faction, 'Iconoclast')) S().injectArchetypeFaction(key, await L(key));
  const errs = () => validateArmy(S() as Any, S().data!, null).filter(v => v.type === 'error').map(v => v.text);
  const oneModel = (t: string) => /counts as ONE model|zählt als EIN|cuenta como UN|считается ОДНОЙ|1モデルとして/.test(t);

  S().addUnit('Sub-Commander', 'HQ', 'tau_empire', undefined, true);
  const sc = S().army[S().army.length - 1];
  check(sc.size === 1, `a Sub-Commander enters the Retinue as 1 model (size ${sc.size})`);
  check(!errs().some(oneModel), 'one Sub-Commander: no "one model" error');
  S().updateUnit(sc.id, { size: 2 });
  check(errs().some(oneModel), 'a Sub-Commander saved with size 2 is flagged');
  S().updateUnit(sc.id, { size: 1 });
  check(!errs().some(oneModel), 'back to 1: the error is gone');
  console.log(bad ? `\n${bad} failure(s)` : '\nall ok');
  process.exit(bad ? 1 : 0);
})();
