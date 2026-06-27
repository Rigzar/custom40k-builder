/**
 * Structured archetype rules for Space Marines.
 *
 * SOURCE: Space Marines — Army Customisation sheet (canonical)
 *
 * Each entry is a StructuredNote with a category:
 *   troops       — unit slot remapping
 *   requirement  — mandatory rule (validated by engine)
 *   restriction  — something banned/blocked (validated by engine)
 *   mechanic     — special effect applied automatically by the engine
 *   in_game      — pure gameplay rule, informational only (not enforced by builder)
 *
 * To modify a rule: find the archetype by name, edit the relevant note.
 * To add a rule: push a new StructuredNote with the appropriate category.
 */

import type { StructuredNote } from '../../archetypes/base';

export const SM_STRUCTURED_NOTES: Record<string, StructuredNote[]> = {

  '1st Company': [
    { category: 'restriction',  text: 'Restricted unit list: 1x Captain Dreadnought OR Lieutenant; 1x Chaplain OR Chaplain Dreadnought; 1x Emperor\'s Champion; 1x Librarian OR Librarian Dreadnought; 1x Ancient; 1x Apothecary; Deathwing Knights; Dreadnoughts (including variants); Honor Guard; 1x Judicar; 1x Company Champion; Terminator Squads; Land Raiders (including variants); Repulsors (including variants); Drop Pods.' },
    { category: 'troops',       text: 'Honor Guard and Terminator Squads count as Troops.' },
    { category: 'mechanic',     text: 'Honor Guard units are no longer limited to 1 per HQ selection.' },
    { category: 'requirement',  text: 'HQ models must gain their "once per army" upgrade, if possible.' },
    { category: 'mechanic',     text: 'All units gain the special rule "Objective secured!".' },
  ],

  'Death from Above': [
    { category: 'troops',       text: 'Assault Squad units count as Troops.' },
    { category: 'restriction',  text: 'Only Assault Squad units count towards the 25% Troops requirement.' },
    { category: 'in_game',      text: 'At least half of all Assault Squad models must start the game in reserves, even if the mission does not allow reserves.' },
  ],

  'Drop Pod Assault': [
    { category: 'requirement',  text: 'All units must start the game as passengers inside a Drop Pod.' },
    { category: 'in_game',      text: 'Half of all Drop Pods in the army (round up) arrive automatically in the first battle round as reinforcements. The other half arrives automatically in the second battle round.' },
  ],

  'Forlorn Brothers': [
    { category: 'restriction',  text: 'Restricted to: creature units with the "Black Rage" equipment (see Blood Angels Armory); Dreadnoughts; Redemptor Dreadnoughts; Drop Pods; Impulsors; Razorbacks; Rhinos.' },
    { category: 'troops',       text: 'Death Company units count as Troops.' },
    { category: 'mechanic',     text: 'Death Company units are no longer limited to one per army.' },
  ],

  'Legion (Space Marines)': [
    { category: 'mechanic',     text: 'Access to all Horus Heresy Space Marines supplement units.' },
    { category: 'restriction',  text: 'Only Troops from the Horus Heresy Space Marine Supplement count towards the 25% Troops requirement.' },
  ],

  'Librarian Conclave': [
    { category: 'mechanic',     text: '4 HQ slots total (minimum 1). Only Librarians, Chief Librarians and Librarian Dreadnoughts may be taken as HQ.' },
    { category: 'mechanic',     text: 'Librarians gain the "Command Squad" ability.' },
    { category: 'in_game',      text: 'All models must be set up within 12" of each other.' },
    { category: 'in_game',      text: 'While a Chief Librarian is within 12" of a Librarian, they can manifest all powers known to the Librarian and receive a +1 bonus to manifesting and dispelling psychic powers.' },
  ],

  'Renegades': [
    { category: 'mechanic',     text: 'Renegades are treated as Allies of Convenience for Chaos Space Marines in the Ally matrix.' },
    { category: 'mechanic',     text: 'May select one Trait from the Chaos Space Marines trait list instead of the normal Space Marine selection.' },
  ],

  'Swift as the Wind': [
    { category: 'troops',       text: 'Bikes and Outrider Bikes count as Troops.' },
    { category: 'mechanic',     text: 'Outflanking units may be deployed on turn 1.' },
    { category: 'in_game',      text: 'All units with less than 12" Movement must start the game as passengers inside a transport.' },
    { category: 'restriction',  text: 'Units with less than 12" Movement that have no transport option cannot be selected.' },
  ],

};
