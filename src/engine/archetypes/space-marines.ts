import type { ArchetypeRule } from './base';
import { BASE, fastArchetype, dropPodArchetype } from './base';

export const SM_ARCHETYPES: Record<string, ArchetypeRule> = {

  '1st Company': { ...BASE,
    troopsRemap: ['Honor Guard', 'Terminators', 'Terminator Squad', 'Terminator Assault Squad', 'Deathwing Knights'],
    notes: [
      'Restricted to: 1x Captain Dreadnought or Lieutenant, 1x Chaplain (or Dreadnought), 1x Emperor\'s Champion, 1x Librarian (or Dreadnought), 1x Ancient, 1x Apothecary, Deathwing Knights, Dreadnoughts, Honor Guard, 1x Judiciar, 1x Techmarine, Terminators, Land Raiders, Repulsors, Drop Pods.',
      'Honor Guard and Terminators count as Troops.',
      'Honor Guard units are no longer limited to 1 per HQ selection.',
      'All units gain "Objective secured!".',
      'HQ models must gain their "once per army" upgrade if possible.',
    ],
  },

  'Death from Above': { ...BASE,
    troopsRemap: ['Assault Squad'], troopsCount: 'remap',
    notes: [
      'Assault Squads count as Troops.',
      'Only Assault Squad units count towards the 25% Troops requirement.',
      'At least half of all Assault Squad models must start the game in reserves.',
    ],
  },

  'Drop Pod Assault': dropPodArchetype('Drop Pod'),

  'Forlorn Brothers': { ...BASE,
    troopsRemap: ['Death Company'],
    notes: [
      'Restricted to units with the "Black Rage" equipment, Dreadnoughts, and transports.',
      'Death Company count as Troops and are no longer limited to one unit per army.',
    ],
  },

  'Legion (Space Marines)': { ...BASE,
    troopsRemap: ['Legion Breacher Squad', 'Legion Tactical Squad', 'Legion Tactical Support Squad'],
    troopsCount: 'remap',
    alliedFaction: 'horus_heresy', alliedMarkFilter: 'all',
    notes: [
      'Access to all Horus Heresy Space Marines supplement units.',
      'Only HH supplement Troops count towards the 25%.',
    ],
  },

  'Librarian Conclave': { ...BASE,
    hqOverride: [1, 4], hqAllowed: ['Librarian', 'Librarian Dreadnought'],
    notes: [
      '4 HQ slots (minimum 1, maximum 4). Only Librarians and Librarian Dreadnoughts as HQ.',
      'Librarians gain the "Command Squad" ability.',
      'While a Chief Librarian is within 12" of a Librarian, they can manifest all powers known to the Librarian and receive a +1 bonus.',
      'All models must deploy within 12" of each other.',
    ],
  },

  'Renegades': { ...BASE,
    notes: [
      'Treated as Allies of Convenience for Chaos Space Marines.',
      'May select one Trait from the Chaos Space Marines trait list instead of the normal selection.',
    ],
  },

  'Swift as the Wind': fastArchetype(['Bike Squad', 'Outrider Bikes'], ['Flanking units may deploy on turn 1.']),

};
