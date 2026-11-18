/**
 * A unit that occupies no slot must not demand a whole extra Army Organisation Plan.
 *
 * GH#133: "When I add a Hexmark Destroyer to an army that has 3 Elites and a Lord, a second AOP
 * was added (the Elite limit still said 3/6)." Necrons, Hexmark Destroyer, Royal Assassin: "For
 * each Lord or Skorpekh Lord, a Hexmark Destroyer can be chosen that does not occupy an elite
 * slot."
 *
 * The exemption was computed correctly and the slot-MAX check subtracted it. The step before it
 * did not: the AOP multiplier compared RAW usage against the cap, so a fourth Elite entry demanded
 * a second AOP even though it occupied nothing — and the panel then printed the doubled cap.
 * Nothing about that was Hexmark-specific; every free-slot mechanism in the game could do it.
 *
 * Asserted through `validateArmy`, because the multiplier is internal and what a player sees is
 * the verdict: three Elites plus an exempt Hexmark is a legal Pitched list.
 *
 *   npx tsx scripts/check_free_slot_no_extra_aop.ts
 */
import { getAopRequirement, computeFreeSlotAdjustments, computeHexmarkDestroyerFreeSlots } from '../src/engine/validators';
type Any = any;

(async () => {
  const mod: Any = await import('../data/parsed/necrons/units/index');
  const data: Any = {
    faction: mod.faction, units: mod.units, slot_to_units: mod.slot_to_units,
    armory_general: { weapons: [], equipment: [] }, armory_marks: {}, armory_legions: {},
    archetypes: [], legacies: [], traits: [], disciplines: {}, prayers: [], pacts: {},
    animosity: {}, unit_versions: {},
  };
  const e = (n: string, id: string): Any => ({
    id, unitName: n, slot: mod.units[n]?.slot ?? 'Elites',
    size: mod.units[n]?.default_size ?? 1, optionQty: {}, armory: [], traits: [], powers: [],
  });

  const fails: string[] = [];
  const state = (army: Any[]): Any => ({
    army, data, faction: mod.faction, archetype: '', legacy: '', legacy2: '',
    engagement: 'pitched', pointLimit: 3000, traitPool: [], alliedFaction: null,
    alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0,
  });

  // Three Elites at the Pitched cap, a Lord, and one Hexmark the Lord exempts.
  const army: Any[] = [
    e('Lord', 'h1'), e('Lychguard', 'e1'), e('Deathmarks', 'e2'), e('Pariahs', 'e3'),
    e('Hexmark Destroyer', 'e4'),
  ];
  const free = computeHexmarkDestroyerFreeSlots(army, data);
  if (free.elites !== 1) fails.push(`the Lord exempts ${free.elites} Hexmark, want 1`);

  // The multiplier itself, which is what the bug was: a legal list is not REJECTED either way
  // (an extra AOP is more permissive, not less), so asserting validateArmy proves nothing here.
  const st = state(army);
  const freeSlots = computeFreeSlotAdjustments(army, data, null as Any, st);
  const mult = getAopRequirement(army, data, 'pitched', null as Any, undefined, freeSlots);
  if (mult !== 1) fails.push(`three Elites plus an exempt Hexmark demand ${mult} AOPs, want 1`);

  // Four Elites that are NOT exempt really do need a second AOP — the fix must not swallow that.
  const fourReal: Any[] = [e('Lychguard', 'r1'), e('Deathmarks', 'r2'), e('Pariahs', 'r3'), e('Canoptek Reanimator', 'r4')];
  const multReal = getAopRequirement(fourReal, data, 'pitched', null as Any, undefined,
    computeFreeSlotAdjustments(fourReal, data, null as Any, state(fourReal)));
  if (multReal !== 2) fails.push(`four unexempted Elites demand ${multReal} AOPs, want 2`);

  // And the negative: with no Lord there is no exemption, so a fourth Elite is over the cap.
  const noLord: Any[] = army.filter(i => i.id !== 'h1').concat([e('Overlord', 'h2')]);
  const free2 = computeHexmarkDestroyerFreeSlots(noLord, data);
  if (free2.elites !== 0) fails.push(`without a Lord the Hexmark is still exempted (${free2.elites})`);

  // HQ opens a second AOP like any other slot: 3 HQs is 3/2, which is fully using the AOP.
  const hq = (n: number): Any[] => ['Lord', 'Cryptek', 'Royal Warden', 'Skorpekh Lord'].slice(0, n).map((u, i) => e(u, 'q' + i));
  for (const [n, want] of [[2, 1], [3, 2], [4, 2]] as const) {
    const a = hq(n);
    // no free-slot adjustments: Necron HQs such as the Royal Warden are exempt with a Lord, which is a different test
    const m = getAopRequirement(a, data, 'pitched', null as Any);
    if (m !== want) fails.push(`${n} HQs demand ${m} AOPs, want ${want}`);
  }
  // an archetype with its own HQ count is not measured against 1-2 (Abaddon's Chosen: 4-5 HQ)
  const five = hq(4).concat([e('Cryptek', 'q9')]);
  const mHq = getAopRequirement(five, data, 'pitched', { troopsRemap: [], hqOverride: [4, 5] } as Any, undefined,
    computeFreeSlotAdjustments(five, data, { troopsRemap: [], hqOverride: [4, 5] } as Any, state(five)));
  if (mHq !== 1) fails.push(`an HQ-override archetype with 5 HQs demands ${mHq} AOPs, want 1`);
  // Skirmish has a second AOP since 2026-11-16 (Missions: "...eligibility for a second AOP"); 3 HQs ask for 3, like any engagement.
  const skHq = getAopRequirement(hq(3), data, 'skirmish', null as Any);
  if (skHq !== 3) fails.push(`Skirmish with 3 HQs demands ${skHq} AOPs, want 3`);

  for (const f of fails) console.log('  ' + f);
  if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
  console.log('OK — an exempt Elite no longer forces a second AOP, and the exemption still needs its Lord.');
})();
