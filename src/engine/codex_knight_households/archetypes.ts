import type { ArchetypeRule } from '../archetypes/base';
import { BASE } from '../archetypes/base';

/**
 * Knight Households (standalone Imperial codex, 2026-10-30): the two Archetypes of its Army Customisation tab.
 */
export const KNIGHT_HOUSEHOLD_ARCHETYPES: Record<string, ArchetypeRule> = {
  // "- A single <Scion> and <Knight> must be selected as an allied force. - No other unit from the codex "Knight Households" may be selected."
  'Freeblade': { ...BASE,
    allowedUnitsOnly: ['Scion', 'Knight Paladin'],
    notes: [
      'Only a Scion and a Knight Paladin may be selected, as an allied force.',
      'No other unit of the Knight Households codex may be selected.',
    ],
  },

  // "- Chaos Knights are treated like "Chaos Space Marines" in the Ally matrix. - All units can purchase a Mark of Chaos ... - Models with
  //  access to the Armory can also access the Chaos Space Marine Armory ..." Same wording and prices as Dark Mechanicum / Traitor Guard.
  'Chaos Knights': { ...BASE,
    grantsMarkPurchase: true,
    grantsMarkArmory: true,
    armoryOnlyFaction: 'chaos_space_marines',
    alliedMatrixAs: 'chaos_space_marines',
    notes: [
      'Treated as Chaos Space Marines in the Ally matrix.',
      'All units may purchase a Mark of Chaos: +1 pt/model/Wound Khorne or Slaanesh, +2 pts Nurgle or Tzeentch; vehicles +10 pts flat (any mark).',
      'Models with Armory access may also use the Chaos Space Marine Armory (and the Armory of their god, with a Mark).',
      'Unique equipment, or equipment with the same description or effect, cannot be selected twice.',
      'Animosity of the Gods and Summoning apply (see Chaos Space Marines).',
    ],
  },
};
