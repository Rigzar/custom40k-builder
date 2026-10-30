import type { FactionData } from '../types/data';

/**
 * Knight Households: what the unit update (UnwiseGetData) cannot carry.
 *
 * The update rewrites a unit's keywords and abilities from its sheet, so two things that were put in the unit files by hand would be lost
 * with the first run, and are applied here, when the faction loads:
 *
 *  - The update stores a unit's keywords as ONE string ("Armiger, Noble"), and the Pilot check looks for "Knight" and "Noble" by name.
 *    They are split back into one keyword each.
 *  - The Index's special rule "The Peasant's Duty" belongs to every <Feudal Levy> unit but is written once, in the Index, not on the
 *    datasheets; each of those units lists it as an ability.
 */
export const PEASANTS_DUTY = "The Peasant's Duty: Units with the <Feudal Levy> keyword gain a +1 bonus to their Leadership value if at least one <Noble> unit is within 12\" range, as long as that <Noble> unit does not possess 2 Battleshock tokens.";

export function applyKnightHouseholdRules(data: FactionData): void {
  for (const unit of Object.values(data.units)) {
    unit.keywords = (unit.keywords ?? []).flatMap(k => String(k).split(',')).map(k => k.trim()).filter(Boolean);
    if (unit.keywords.includes('Feudal Levy') && !(unit.abilities ?? []).some(a => /^The Peasant/i.test(a))) {
      unit.abilities = [...(unit.abilities ?? []).filter(a => a.trim() !== '-'), PEASANTS_DUTY];
    }
  }
}
