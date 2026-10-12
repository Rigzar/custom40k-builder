/**
 * A squad with ONE sizeable model row and several "Every X is equipped with" clauses (Lootas, Burna Boyz,
 * Dire Avengers, Incubi, Tauros) must count the weapon of that row from the squad size, not from its minimum.
 * Reported: 15 Lootas showed "5x Deffgun". npx tsx scripts/check_sole_row_counts.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { resolveUnit } from '../src/engine/points';
import { resolveUnitProfile, computeWeaponGroups } from '../src/engine/resolver';

(async () => {
  const d: any = await (FACTION_LOADERS as any).orks();
  const S = () => useArmyStore.getState();
  S().clearArmy(); S().setData(d); S().setPointLimit(3000);
  S().addUnit('Lootas', 'Heavy Support');
  const id = S().army[0].id;
  let bad = 0;
  const countOf = () => {
    const e = S().army[0]; const u = resolveUnit(e, S().data!)!;
    const r: any = resolveUnitProfile(e, u, S() as any, S().data!);
    const g: any = computeWeaponGroups(u, e, r).find((x: any) => x.weapons.some((w: any) => w.name.startsWith('Deffgun')));
    return g.countOverrides?.get('Deffgun - Shooty') ?? g.count;
  };
  for (const n of [5, 9, 15]) {
    S().updateUnit(id, { size: n } as any);
    const c = countOf();
    if (c !== n) { bad++; console.log(`FAIL size ${n}: ${c}x Deffgun`); }
  }
  S().updateUnit(id, { size: 9 } as any);
  S().setOptionQty(id, 1, '__inline', 3);
  const c = countOf();
  if (c !== 6) { bad++; console.log(`FAIL 9 with 3 Spannas: ${c}x Deffgun (want 6)`); }
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
