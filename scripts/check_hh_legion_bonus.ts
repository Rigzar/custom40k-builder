/**
 * Horus Heresy books: the mark of the Legion is automatic. For every Legacy that has a Legion, a squad, a character and a vehicle must cost exactly what the Index of the sheet says
 * (per model / character model / vehicle) more than without the Legacy, and carry the mark's stats. Run: npx tsx scripts/check_hh_legion_bonus.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
(globalThis as any).document = { documentElement: {}, addEventListener() {} }; (globalThis as any).window = { addEventListener() {} };
console.warn = () => {}; console.error = () => {};
import fs from 'node:fs';
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor, factionForEntry, effectiveLegacyFor } from '../src/engine/points';
import { resolveUnitProfile } from '../src/engine/resolver';
type Any = any;
(async () => {
  const bad: string[] = [];
  for (const [k, book] of [['horus_heresy_loyal', 'loyal'], ['horus_heresy_traitor', 'traitor']] as const) {
    const d: Any = await (FACTION_LOADERS as Any)[k]();
    const idx: any[][] = JSON.parse(fs.readFileSync(`scratch_cx/hh_codex/_books/${book}/Index.json`, 'utf8'));
    const cost: Record<string, number[]> = {};
    for (const r of idx) for (const c of r) { const m = String(c).match(/^(.+?) Legion\*:.*Cost: \+(\d+) points? per model, \+(\d+) points? for a character model(?: or a squad leader)?, \+(\d+) points? for a vehicle/s); if (m && m[1] !== 'Legions') cost[m[1]] = [+m[2], +m[3], +m[4]]; }
    const S = () => useArmyStore.getState();
    const price = (unitName: string, slot: string, legacy: string) => {
      S().clearArmy(); S().setData(d); S().setEngagement('pitched'); S().setPointLimit(2500); S().setLegacy(legacy); S().addUnit(unitName, slot);
      const st = S(); const e = st.army[0]; const u = resolveUnit(e, st.data!)!;
      return { pts: computeUnitPoints(e, u, effectiveArchetypeFor(e, st), factionForEntry(e, st.data!), st.pointLimit, effectiveLegacyFor(e, st as Any)), size: e.size, prof: resolveUnitProfile(e, u, st as Any, st.data!) as Any };
    };
    let n = 0;
    for (const l of d.legacies) {
      if (!l.armory_key || !cost[l.armory_key]) continue;
      for (const [name, slot, which] of [['Legion Tactical Squad', 'Troops', 0], ['Centurion', 'HQ', 1], ['Legion Rhino', 'Dedicated Transport', 2]] as const) {
        const a = price(name, slot, ''); const b = price(name, slot, l.name);
        const want = cost[l.armory_key][which] * (which === 2 ? 1 : b.size);
        n++;
        if (b.pts - a.pts !== want) bad.push(`${k} ${l.name} ${name}: +${b.pts - a.pts} points, Index says +${want}`);
        if (!b.prof.injectedRuleNotes?.some((t: string) => new RegExp(`Mark of ${l.armory_key}`).test(t))) bad.push(`${k} ${l.name} ${name}: the mark is not shown on the card`);
      }
    }
    console.log(k, 'Legions in the Index:', Object.keys(cost).length, '| price checks:', n);
  }
  if (bad.length) { console.log('PROBLEMS\n' + bad.join('\n')); process.exit(1); }
  console.log('OK  the mark of every Legion costs what the Index says and shows on the card');
})();
