import type { ArchetypeRule } from './base';
import { BASE } from './base';

/**
 * Chaos Daemons archetype rules.
 *
 * Archetype names with superscripts match the JSON data exactly:
 *   ˢ = Slaanesh restriction
 *   ᴷ = Khorne restriction
 *   ᵀ = Tzeentch restriction
 *   ᴺ = Nurgle restriction
 */
export const CD_ARCHETYPES: Record<string, ArchetypeRule> = {

  'Assault on Realspace': { ...BASE,
    notes: ['Units reduce their scatter distance by one D6.'],
  },

  'Calamitous Invasion': { ...BASE,
    notes: [
      'Roll 1D6 during each Reinforcement phase — on a 5+ a Meteor appears and must be activated like a unit that same turn.',
      'Scatter roll is always 2D6" and cannot be changed.',
      'Instead of placing a model, all units within 6" suffer 1 automatic hit: S10 AP-1 D1, AT(2), Barrage, Seeking, Suppression.',
    ],
  },

  "Figureheads of The Dark Princeˢ": { ...BASE, forcedMark: 'Slaanesh', requireForcedMarkOnly: true,
    notes: ['HQ models gain +1 Attack while not within 12" of another friendly HQ model.'],
  },

  'Goretideᴷ': { ...BASE, forcedMark: 'Khorne', requireForcedMarkOnly: true,
    notes: ['When a Khorne model loses its last Wound in melee, roll 1D6 — on a 5+ it causes 1 automatic Wound against an enemy unit in base contact.'],
  },

  'Host Duplicitousᵀ': { ...BASE, forcedMark: 'Tzeentch', requireForcedMarkOnly: true,
    notes: ['Psychic powers do not increase their casting values for manifesting them multiple times per round.'],
  },

  'Popping Plagueᴺ': { ...BASE, forcedMark: 'Nurgle', requireForcedMarkOnly: true,
    notes: ['Units explode like a vehicle when they lose their last Wound.'],
  },
};
