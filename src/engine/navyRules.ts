/**
 * Imperial Navy (Imperial Navy 1.1) army rules that touch the Army Organisation Plan.
 *
 * Warrant of Trade: "Allied Troop units from 'Allies of Convenience' retain their 'Objective Secured!'
 * ability. Additionally, the army doubles its available slots for allied detachments." The first
 * sentence is a table rule; the second is a cap, applied here so the validator, the slot picker and
 * the Skirmish ally limits all read the same number.
 */
export const WARRANT_ALLY_SLOT_FACTOR = 2;

/** Multiplier on every slot an ALLIED detachment may fill, for the army that is the primary one. */
export function alliedSlotFactor(primaryFaction: string | undefined | null): number {
  return primaryFaction === 'Imperial Navy' ? WARRANT_ALLY_SLOT_FACTOR : 1;
}
