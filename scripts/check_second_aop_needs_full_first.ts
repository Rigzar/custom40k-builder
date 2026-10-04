/**
 * A second Army Organisation Plan opens only once the WHOLE first one is filled.
 *
 * Core Rules, Exceeding the AOP: "If a player fully utilizes their current AOP, they gain access to a
 * second, identical AOP. Transports, Fortifications and Flyers do not have to be filled out." The
 * rules author, in the Discord: "The whole AOP must be filled before you get a second one ...
 * Simply filling out a single slot type is not enough." The builder used to open one as soon as any
 * slot but HQ went over its cap, and never for HQ (a player with 3 HQs and 4 Troops asked for one).
 *
 *   npx tsx scripts/check_second_aop_needs_full_first.ts
 */
import { getAopState } from '../src/engine/validators';
type Any = any;

(async () => {
  const mod: Any = await import('../data/parsed/necrons/units/index');
  const data: Any = {
    faction: mod.faction, units: mod.units, slot_to_units: mod.slot_to_units,
    armory_general: { weapons: [], equipment: [] }, armory_marks: {}, armory_legions: {},
    archetypes: [], legacies: [], traits: [], disciplines: {}, prayers: [], pacts: {},
    animosity: {}, unit_versions: {},
  };
  // Units that take their slot plainly (no free-slot exemption): checked below, not assumed.
  const PICK: Record<string, string> = {
    HQ: 'Lord', Troops: 'Warriors', Elites: 'Lychguard', 'Fast Attack': 'Canoptek Wraiths', 'Heavy Support': 'Annihilation Barge',
  };
  const e = (slot: string, i: number): Any => ({
    id: `${slot}-${i}`, unitName: PICK[slot], slot, size: mod.units[PICK[slot]]?.default_size ?? 1,
    optionQty: {}, armory: [], traits: [], powers: [],
  });
  const army = (counts: Record<string, number>): Any[] =>
    Object.entries(counts).flatMap(([slot, n]) => Array.from({ length: n }, (_, i) => e(slot, i)));
  const fails: string[] = [];
  const want = (label: string, counts: Record<string, number>, taken: number, unlocked: number) => {
    const a = army(counts);
    const r = getAopState(a, data, 'pitched', null as Any);
    if (r.taken !== taken || r.unlocked !== unlocked) fails.push(`${label}: taken ${r.taken}/unlocked ${r.unlocked}, want ${taken}/${unlocked}`);
  };
  for (const [slot, n] of Object.entries(PICK)) if (!mod.units[n] || mod.units[n].slot !== slot) fails.push(`test unit ${n} is not a ${slot}`);

  // 3 HQs + 4 Troops: HQ is over its cap, but the first AOP is not full, so nothing is earned.
  want('3 HQ, 4 Troops', { HQ: 3, Troops: 4 }, 2, 1);
  // A fourth Elite with the rest empty: no second AOP either (used to be granted).
  want('4 Elites, 3 Troops', { HQ: 1, Troops: 3, Elites: 4 }, 2, 1);
  // The whole first AOP filled: the second is earned, and nothing is using it yet.
  want('first AOP full', { HQ: 2, Troops: 6, Elites: 3, 'Fast Attack': 3, 'Heavy Support': 3 }, 1, 2);
  // One slot short of full: still one.
  want('first AOP, 2 Heavy Support', { HQ: 2, Troops: 6, Elites: 3, 'Fast Attack': 3, 'Heavy Support': 2 }, 1, 1);
  // Full, then a third HQ: now it is legal, and the second AOP is in use.
  want('full + 3rd HQ', { HQ: 3, Troops: 6, Elites: 3, 'Fast Attack': 3, 'Heavy Support': 3 }, 2, 2);
  // Skirmish has no second AOP at all.
  const sk = getAopState(army({ HQ: 3 }), data, 'skirmish', null as Any);
  if (sk.taken !== 1 || sk.unlocked !== 1) fails.push(`skirmish: ${sk.taken}/${sk.unlocked}, want 1/1`);

  for (const f of fails) console.log('  ' + f);
  if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
  console.log('OK — a second AOP needs the whole first one filled; no single slot opens it.');
})();
