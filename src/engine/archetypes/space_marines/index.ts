/**
 * Space Marines Archetype engine rules.
 *
 * SOURCE: Space Marines — Army Customisation sheet (canonical)
 * ──────────────────────────────────────────────────────────────
 * "Army Customisation allows you to further individualise your force."
 * You may select: 0-1 Archetype, 0-1 Legacy, 0-2 Traits.
 *
 * ENGINE NOTE: each archetype has its canonical rule text as a comment above the object.
 * The engine flags must stay faithful to that text.
 * When the canonical text and the flags diverge, fix the flags — not the text.
 */

import type { ArchetypeRule } from '../base';
import { BASE, fastArchetype, dropPodArchetype } from '../base';

export const SM_ARCHETYPES: Record<string, ArchetypeRule> = {

  // SOURCE — 1st Company:
  // "The army may only consist of the following units:
  //  - 1x Captain Dreadnought OR 1x Lieutenant, 1x Chaplain OR 1x Chaplain Dreadnought,
  //    1x Emperor's Champion, 1x Librarian OR 1x Librarian Dreadnought
  //  - 1x Ancient, 1x Apothecary, Deathwing Knights, Dreadnoughts (including variants),
  //    Honor Guard, 1x Judiciar, 1x Company Champion, Terminators, 1x Techmarine
  //  - Land Raider (including variants), Repulsor (including variants)
  //  - Drop Pods
  //  - HQ models must gain their 'once per army' upgrade, if possible.
  //  - Honor Guard and Terminators can be taken as Troops.
  //  - Honor Guard units are not limited to 1x per HQ selection anymore.
  //  - All units gain the special rule 'Objective secured!'."
  //
  // ENGINE STATUS: troopsRemap correct. Restricted unit list validated by
  // validators/space_marines.ts (ALLOWED_1ST set). 'Objective secured!' informational —
  // not separately computed (it's the default Troops rule; 1st Company grants it army-wide).
  '1st Company': { ...BASE,
    troopsRemap: ['Honor Guard', 'Terminator Squad'],
    notes: [
      'Restricted to: 1x Captain Dreadnought or Lieutenant, 1x Chaplain (or Dreadnought), 1x Emperor\'s Champion, 1x Librarian (or Dreadnought), 1x Ancient, 1x Apothecary, 1x Company Champion, Deathwing Knights, Dreadnoughts, Honor Guard, 1x Judicar, 1x Techmarine, Terminator Squads, Land Raiders, Repulsors, Drop Pods.',
      'Honor Guard and Terminator Squads count as Troops.',
      'Honor Guard units are no longer limited to 1 per HQ selection.',
      'All units gain "Objective secured!".',
      'HQ models must gain their "once per army" upgrade if possible.',
    ],
  },

  // SOURCE — Death from Above:
  // "- Assault Squad units can be taken as Troops.
  //  - Only Assault Squad units count towards the 25% Troops limitation.
  //  - At least half of all Assault Squad models must start the game in reserves,
  //    even if the mission does not allow reserves."
  'Death from Above': { ...BASE,
    troopsRemap: ['Assault Squad'], troopsCount: 'remap',
    notes: [
      'Assault Squads count as Troops.',
      'Only Assault Squad units count towards the 25% Troops requirement.',
      'At least half of all Assault Squad models must start the game in reserves.',
    ],
  },

  // SOURCE — Drop Pod Assault:
  // "- All units must start the game as passengers inside a Drop Pod.
  //  - Half of all Drop Pods in the army (round up) arrive automatically in the first battle
  //    round as reinforcements. The other half arrives automatically in the second battle round."
  'Drop Pod Assault': dropPodArchetype('Drop Pod'),

  // SOURCE — Forlorn Brothers:
  // "The army may only consist of the following units:
  //  - Creature units with the 'Black Rage' equipment (see Blood Angels Armory).
  //  - Dreadnoughts, Redemptor Dreadnoughts.
  //  - Drop Pods, Impulsors, Razorbacks, Rhinos.
  //  - Death Company units can be taken as Troops and are not limited to one per army anymore."
  //
  // ENGINE STATUS: troopsRemap + Forlorn Brothers composition validated by
  // validators/space-marines.ts (FORLORN_ALLOWED set + Black Rage check).
  'Forlorn Brothers': { ...BASE,
    troopsRemap: ['Death Company'],
    notes: [
      'Restricted to units with the "Black Rage" equipment, Dreadnoughts, and transports.',
      'Death Company count as Troops and are no longer limited to one unit per army.',
    ],
  },

  // SOURCE — Legion:
  // "- The army has access to everything from the Horus Heresy Space Marines supplement.
  //  - Only Troops from the Horus Heresy Space Marine Supplement count towards the 25%."
  'Legion (Space Marines)': { ...BASE,
    troopsRemap: ['Legion Breacher Squad', 'Legion Tactical Squad', 'Legion Tactical Support Squad'],
    troopsCount: 'remap',
    alliedFaction: 'horus_heresy', alliedMarkFilter: 'all',
    notes: [
      'Access to all Horus Heresy Space Marines supplement units.',
      'Only HH supplement Troops count towards the 25%.',
    ],
  },

  // SOURCE — Librarian Conclave:
  // "- The army gets 4 HQ slots in total and has only access to Librarians, Chief Librarians
  //    and Librarian Dreadnoughts as HQ models. Librarians gain the 'Command Squad' ability.
  //  - All of these models must be set up within 12" of each other.
  //  - While a Chief Librarian is within 12" of a Librarian, they can manifest all powers
  //    known to the Librarian and receive a +1 bonus to manifesting and dispelling."
  //
  // NOTE: source says "Librarians, Chief Librarians AND Librarian Dreadnoughts" — three valid
  // HQ types. Chief Librarian is the upgraded variant of Librarian (same unit, variant_link).
  // hqAllowed covers the base unit names; the validator checks variant links for Chief/Dreadnought.
  'Librarian Conclave': { ...BASE,
    hqOverride: [1, 4],
    hqAllowed: ['Librarian', 'Chief Librarian', 'Librarian Dreadnought'],
    grantsCommandSquad: ['Librarian', 'Chief Librarian'],
    notes: [
      '4 HQ slots (minimum 1, maximum 4). Only Librarians, Chief Librarians and Librarian Dreadnoughts as HQ.',
      'Librarians gain the "Command Squad" ability.',
      'While a Chief Librarian is within 12" of a Librarian, they can manifest all powers known to the Librarian and receive a +1 bonus.',
      'All models must deploy within 12" of each other.',
    ],
  },

  // SOURCE — Renegades:
  // "- Renegades are treated like 'Chaos Space Marines' in the Ally matrix.
  //  - May select one Trait from the 'Chaos Space Marines' list instead of the normal selection."
  'Renegades': { ...BASE,
    notes: [
      'Treated as Allies of Convenience for Chaos Space Marines.',
      'May select one Trait from the Chaos Space Marines trait list instead of the normal selection.',
    ],
  },

  // SOURCE — Swift as the Wind:
  // "- Bikes and Outriders can be taken as Troops.
  //  - Outflanking units may be deployed on turn 1.
  //  - All units with less than 12" Movement must start the game as passengers inside a transport.
  //  - Units that have no transport option and less than 12" Movement cannot be taken at all."
  'Swift as the Wind': fastArchetype(
    ['Bike Squad', 'Outrider Bikes'],
    ['Outflanking units may deploy on turn 1.'],
  ),

};
