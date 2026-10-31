// Legacy of the Iron Lord (CSM 1.11): "The army may include a single vehicle Heavy Support choice from codex Imperial Guard per AOP."
// npx tsx scripts/check_iron_lord_guard_vehicle.ts
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { validateArmy } from '../src/engine/validators';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor, factionForEntry } from '../src/engine/points';
type Any = any;
(async () => {
  const csm: Any = await (FACTION_LOADERS as Any).chaos_space_marines();
  const ig: Any = await (FACTION_LOADERS as Any).imperial_guard();
  csm.allied = { ...(csm.allied ?? {}), imperial_guard: ig };
  const S = () => useArmyStore.getState();
  const vehicle = (ig.slot_to_units['Heavy Support'] as string[]).find(n => ig.units[n].is_vehicle)!;
  const infantry = (ig.slot_to_units['Heavy Support'] as string[]).find(n => !ig.units[n].is_vehicle);
  let bad = 0;
  const run = (label: string, legacy: string, n: number, expectErrors: RegExp | null) => {
    S().clearArmy(); S().setData(csm); S().setEngagement('pitched'); S().setPointLimit(2500); S().setLegacy(legacy);
    for (let i = 0; i < n; i++) S().addUnit(vehicle, 'Heavy Support', 'imperial_guard', undefined, undefined, true);
    const errs = validateArmy(S() as Any, S().data!, S().alliedData).filter(v => v.type === 'error').map(v => v.text);
    const hit = expectErrors ? errs.some(t => expectErrors.test(t)) : !errs.some(t => /Iron Lord|Heavy Support/.test(t));
    console.log(hit ? 'OK  ' : 'FAIL', label, '-', vehicle, 'x' + n, errs.filter(t => /Iron Lord|Heavy Support/.test(t))[0] ?? 'no Iron Lord error');
    if (!hit) bad++;
  };
  run('Iron Lord, one vehicle', 'Legacy of the Iron Lord', 1, null);
  run('Iron Lord, two vehicles in one AOP', 'Legacy of the Iron Lord', 2, /Iron Lord/);
  run('no Legacy, one vehicle', '', 1, /Iron Lord/);
  run('Hydra, one vehicle', 'Legacy of the Hydra', 1, /Iron Lord/);
  // it is priced from the Imperial Guard datasheet
  S().clearArmy(); S().setData(csm); S().setLegacy('Legacy of the Iron Lord');
  S().addUnit(vehicle, 'Heavy Support', 'imperial_guard', undefined, undefined, true);
  const e = S().army[0]; const u = resolveUnit(e, S().data!);
  const pts = u ? computeUnitPoints(e, u, effectiveArchetypeFor(e, S() as Any), factionForEntry(e, S().data!), S().pointLimit) : 0;
  console.log(pts > 0 ? 'OK  ' : 'FAIL', 'priced from the Imperial Guard sheet:', pts, 'points'); if (!(pts > 0)) bad++;
  if (infantry) console.log('info: an infantry Heavy Support unit exists in IG (' + infantry + ') and is not offered (vehicle only).');
  process.exit(bad ? 1 : 0);
})();