/**
 * A variant upgrade that "counts as a HQ selection" fills an HQ slot, not the Elite one.
 *
 * GH#210: "The Master of the Forge upgrade does not make the Techmarine an HQ choice or use an HQ
 * slot." Space Marines' Master of the Forge and Chief Apothecary both read "he counts as a HQ
 * selections and fills up a slot"; only the Ascended Daemon Prince was wired. Asserted through the
 * slot count the validator and the slot panel share.
 *
 *   npx tsx scripts/check_variant_hq_slot.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { getSlotUsage } from '../src/engine/validators';
type Any = any;

(async () => {
  const d: Any = await (FACTION_LOADERS as Any).space_marines();
  const fails: string[] = [];
  const entry = (unitName: string, id: string, upgraded: string | null): Any => {
    const u = d.units[unitName];
    const optionQty: Record<number, Record<string, number>> = {};
    if (upgraded) {
      const gi = u.option_groups.findIndex((g: Any) => g.variant_link === upgraded);
      if (gi < 0) throw new Error(`${unitName} has no ${upgraded} group`);
      optionQty[gi] = { __inline: 1 };
    }
    return { id, unitName, slot: u.slot, size: 1, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
  };
  const use = (army: Any[], slot: string) => getSlotUsage(army, d, slot, null as Any, undefined, false, 'pitched');

  const captain = entry('Lieutenant', 'c', null);
  // plain Techmarine: an Advisor, free beside an HQ
  let a = [captain, entry('Techmarine', 't', null)];
  if (use(a, 'HQ') !== 1 || use(a, 'Elites') !== 0) fails.push(`plain Techmarine: HQ ${use(a, 'HQ')} Elites ${use(a, 'Elites')}, want 1 and 0`);

  // Master of the Forge: an HQ selection, and no longer free
  a = [captain, entry('Techmarine', 't', 'Master of the Forge')];
  if (use(a, 'HQ') !== 2) fails.push(`Master of the Forge: HQ ${use(a, 'HQ')}, want 2`);
  if (use(a, 'Elites') !== 0) fails.push(`Master of the Forge still takes an Elite slot (${use(a, 'Elites')})`);

  // alone, with no other HQ, it IS the HQ
  a = [entry('Techmarine', 't', 'Master of the Forge')];
  if (use(a, 'HQ') !== 1) fails.push(`lone Master of the Forge: HQ ${use(a, 'HQ')}, want 1`);

  // and it counts as an HQ selection for the Advisor allowance: a plain Techmarine beside it is free
  a = [entry('Techmarine', 'm', 'Master of the Forge'), entry('Techmarine', 'p', null)];
  if (use(a, 'Elites') !== 0) fails.push(`a Techmarine beside a Master of the Forge takes an Elite slot (${use(a, 'Elites')})`);

  // Chief Apothecary: same shape
  a = [captain, entry('Apothecary', 'a', 'Chief Apothecary')];
  if (use(a, 'HQ') !== 2 || use(a, 'Elites') !== 0) fails.push(`Chief Apothecary: HQ ${use(a, 'HQ')} Elites ${use(a, 'Elites')}, want 2 and 0`);

  for (const f of fails) console.log('  ' + f);
  if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
  console.log('OK — Master of the Forge and Chief Apothecary fill an HQ slot.');
})();
