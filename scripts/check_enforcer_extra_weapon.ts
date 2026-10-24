/**
 * T'au XV85 Enforcer: "it may select one more weapon or support system" (Crisis Honor Guard upgrade, Crisis Battlesuits armory item).
 * MightyBull, 2026-10-24: "Enforcer suits don't get their extra weapon option". The cap was only ever raised for SUPPORT SYSTEMS, and
 * only for the Armory item; the Honor Guard's own upgrade raised nothing.
 *
 *   npx tsx scripts/check_enforcer_extra_weapon.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { validateArmy } from '../src/engine/validators';
import { resolveUnit } from '../src/engine/points';
import { enforcerWeaponBonus, supportSystemCap } from '../src/lib/supportSystems';

type Any = any;
let ok = true;
const check = (label: string, got: Any, want: Any) => {
  const good = JSON.stringify(got) === JSON.stringify(want);
  ok = ok && good;
  console.log(`  ${good ? 'ok   ' : 'WRONG'} ${label.padEnd(66)} ${JSON.stringify(got)}` + (good ? '' : `  (expected ${JSON.stringify(want)})`));
};

(async () => {
  const data: Any = await (FACTION_LOADERS as Any).tau_empire();
  const S = () => useArmyStore.getState();
  S().clearArmy(); S().setData(data); S().setEngagement('pitched'); S().setPointLimit(3000);
  S().addUnit('Crisis Honor Guard', 'Elites');
  let e: Any = S().army[0];
  S().updateModelSize?.(e.id, "Crisis Shas'ui", 2);
  e = S().army[0];
  const u: Any = resolveUnit(e, data);
  const enfGi = u.option_groups.findIndex((g: Any) => g.choices?.some((c: Any) => c.name === 'XV85-2 Enforcer'));
  const enfCi = u.option_groups[enfGi].choices.findIndex((c: Any) => c.name === 'XV85-2 Enforcer');
  const wGi = u.option_groups.findIndex((g: Any) => g.choices?.some((c: Any) => c.name === 'Burst cannon'));
  const count = () => validateArmy(S() as Any, data, null).filter((v: Any) => v.type === 'error').map((v: Any) => String(v.text));
  const over = () => count().filter(t => /weapon|more than|exceed|max/i.test(t) && !/HQ|Troops/.test(t));

  console.log(`Crisis Honor Guard, ${S().army[0].size} models`);
  const size = S().army[0].size;
  const set = (gi: number, ci: number, q: number) => S().setOptionQty(e.id, gi, String(ci), q);
  check('no Enforcer: the bonus is 0', enforcerWeaponBonus(u, S().army[0], u.option_groups[wGi]), 0);
  set(enfGi, enfCi, 1);
  const withEnf = S().army[0];
  check('one model takes the Enforcer upgrade: one more weapon allowed', enforcerWeaponBonus(u, withEnf, u.option_groups[wGi]), 1);
  check('and one more support system (3 instead of 2 per model)', supportSystemCap(u, withEnf, data, []) as number - 2 * size, 1);

  set(wGi, 0, 3 * size + 1);
  const gotQty = S().army[0].optionQty?.[wGi]?.[0] ?? 0;
  check(`the weapon counter accepts ${3 * size + 1} weapons (3 per model + the Enforcer's)`, gotQty, 3 * size + 1);
  check('no over-limit error for it', over().filter(t => /Flamer|weapon|up to/i.test(t)), []);
  const before = count();
  set(wGi, 0, 3 * size + 2);
  const after = count();
  check('one more than that is reported by the validator', after.length > before.length, true);
  set(wGi, 0, 3 * size + 1);
  set(enfGi, enfCi, 0);
  check('without the Enforcer the same 7 weapons are over the limit', count().length > before.length, true);

  console.log(ok ? '\nAll checks passed.' : '\nSOME CHECKS FAILED.');
  process.exit(ok ? 0 : 1);
})();
