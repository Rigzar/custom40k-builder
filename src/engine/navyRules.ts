/**
 * Imperial Navy (Imperial Navy 1.0.ods) army rules that touch the Army Organisation Plan.
 *
 * Skyhammer Doctrine: "The army doubles its available AOP slots for Flyers. Additionally, Flyers
 * arrive on turn 1 already." The second sentence is a table rule; the first is a cap, applied here
 * so the validator, the slot picker and the printed radar all read the same number.
 */
export const SKYHAMMER_FLYER_FACTOR = 2;

/** Multiplier on a slot's AOP cap for this faction (1 for every slot the faction does not change). */
export function slotCapFactor(faction: string | undefined | null, slot: string): number {
  return faction === 'Imperial Navy' && slot === 'Flyers' ? SKYHAMMER_FLYER_FACTOR : 1;
}
