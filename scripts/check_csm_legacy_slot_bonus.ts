// CSM 1.11: Legacy of the Hydra adds one Elite selection per AOP, Legacy of the Night Haunter one Fast Attack selection per AOP.
// npx tsx scripts/check_csm_legacy_slot_bonus.ts
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { validateArmy } from '../src/engine/validators';
import { engagementFor } from '../src/engine/engagements';
type Any = any;
(async () => {
  const csm: Any = await (FACTION_LOADERS as Any).chaos_space_marines();
  const S = () => useArmyStore.getState();
  let bad = 0;
  const cap = (slot: string) => (engagementFor('pitched') as Any).aop[slot][1] as number;
  const run = (label: string, legacy: string, slot: string, extra: number, expectError: boolean) => {
    const unit = csm.slot_to_units[slot].find((n: string) => !csm.units[n].is_character && !csm.units[n].is_vehicle) as string;
    S().clearArmy(); S().setData(csm); S().setEngagement('pitched'); S().setPointLimit(2500); S().setLegacy(legacy);
    const n = cap(slot) + extra;
    for (let i = 0; i < n; i++) S().addUnit(unit, slot);
    const errs = validateArmy(S() as Any, S().data!, S().alliedData).filter(v => v.type === 'error' && v.text.includes(slot));
    const ok = expectError ? errs.length > 0 : errs.length === 0;
    console.log(ok ? 'OK  ' : 'FAIL', label, '-', n + ' ' + slot + ' (' + unit + ')', errs.length ? 'ERROR: ' + errs[0].text.slice(0, 70) : 'no slot error');
    if (!ok) bad++;
  };
  run('no legacy, at the cap', '', 'Elites', 0, false);
  run('no legacy, one over', '', 'Elites', 1, true);
  run('Hydra, one over is allowed', 'Legacy of the Hydra', 'Elites', 1, false);
  run('Hydra, two over is not', 'Legacy of the Hydra', 'Elites', 2, true);
  run('no legacy, Fast Attack one over', '', 'Fast Attack', 1, true);
  run('Night Haunter, Fast Attack one over is allowed', 'Legacy of the Night Haunter', 'Fast Attack', 1, false);
  run('Hydra does not add Fast Attack', 'Legacy of the Hydra', 'Fast Attack', 1, true);
  process.exit(bad ? 1 : 0);
})();