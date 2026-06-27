/**
 * Chaos Daemons Archetype engine rules.
 *
 * SOURCE: Chaos Daemons — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────
 * "Army Customisation allows you to further individualise your force."
 * You may select: 0-1 Archetype. (No Legacies or Traits for Chaos Daemons.)
 *
 * 6 Archetypes. Four are mark-restricted (glyph suffix = required mark):
 *   ᴷ = Only for models with Mark of Khorne
 *   ᴺ = Only for models with Mark of Nurgle
 *   ˢ = Only for models with Mark of Slaanesh
 *   ᵀ = Only for models with Mark of Tzeentch
 *
 * ENGINE NOTE: archetype names with superscripts match the JSON data exactly.
 * forcedMark + requireForcedMarkOnly enforce the mark restriction army-wide.
 * The in-game effects (Meteor, Goretide trigger, etc.) are informational only —
 * the builder cannot enforce them during play, only during list building.
 */

import type { ArchetypeRule } from '../../archetypes/base';
import { BASE } from '../../archetypes/base';

export const CD_ARCHETYPES: Record<string, ArchetypeRule> = {

  // SOURCE — Assault on Realspace:
  // "- Units reduce their scatter distance by one D6."
  // (In-game effect: Deep Strike scatter = 1D6" instead of 2D6". Informational only.)
  'Assault on Realspace': { ...BASE,
    notes: ['Units reduce their scatter distance by one D6.'],
  },

  // SOURCE — Calamitous Invasion:
  // "- Roll 1D6 during each Reinforcement phase. On a 5+ a Meteor appears. The Meteor must be
  //    activated like a unit during the same turn it appears. Once you activate the Meteor, place
  //    it like a unit arriving from Deep Strike. The scatter roll is always 2D6" and can never be
  //    changed. Instead of placing a model, all units within 6" of the final position receive one
  //    automatic hit with Strength: 10, AP: -1, Damage: 1; AT(2), Barrage, Seeking, Suppression."
  // (In-game effect only — not enforced by the builder.)
  'Calamitous Invasion': { ...BASE,
    notes: [
      'Roll 1D6 during each Reinforcement phase — on a 5+ a Meteor appears and must be activated like a unit that same turn.',
      'Scatter roll is always 2D6" and cannot be changed.',
      'Instead of placing a model, all units within 6" suffer 1 automatic hit: S10 AP-1 D1, AT(2), Barrage, Seeking, Suppression.',
    ],
  },

  // SOURCE — Figureheads of The Dark Princeˢ:
  // "- Your HQ models gain +1 Attack while not within 12" of another friendly HQ model."
  // ˢ = Only for models with Mark of Slaanesh
  // (In-game effect. forcedMark enforces Slaanesh-only army.)
  'Figureheads of The Dark Princeˢ': { ...BASE,
    forcedMark: 'Slaanesh', requireForcedMarkOnly: true,
    notes: ['HQ models gain +1 Attack while not within 12" of another friendly HQ model.'],
  },

  // SOURCE — Goretideᴷ:
  // "- Roll 1D6 for each model with the Mark of Khorne that loses its last Wound in melee.
  //    On a 5+ they cause an automatic Wound with one of their weapons against an enemy unit
  //    in base contact."
  // ᴷ = Only for models with Mark of Khorne
  'Goretideᴷ': { ...BASE,
    forcedMark: 'Khorne', requireForcedMarkOnly: true,
    notes: ['When a Khorne model loses its last Wound in melee, roll 1D6 — on a 5+ it causes 1 automatic Wound against an enemy unit in base contact.'],
  },

  // SOURCE — Host Duplicitousᵀ:
  // "- Psychic powers do not increase their casting values for manifesting them multiple times
  //    per round."
  // ᵀ = Only for models with Mark of Tzeentch
  // NOTE: ᵀ here = Tzeentch mark (CD context), NOT Terminator-compat. The resolver
  // enforces this correctly via effectivePsyker check (resolver-chaos-daemons.ts).
  'Host Duplicitousᵀ': { ...BASE,
    forcedMark: 'Tzeentch', requireForcedMarkOnly: true,
    notes: ['Psychic powers do not increase their casting values for manifesting them multiple times per round.'],
  },

  // SOURCE — Popping Plagueᴺ:
  // "- Your units explode like a vehicle upon losing their last Wound."
  // ᴺ = Only for models with Mark of Nurgle
  // (In-game effect only — not enforced by the builder.)
  'Popping Plagueᴺ': { ...BASE,
    forcedMark: 'Nurgle', requireForcedMarkOnly: true,
    notes: ['Units explode like a vehicle when they lose their last Wound.'],
  },

};
