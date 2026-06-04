/**
 * CSM Legacy structured notes.
 *
 * SOURCE: Chaos Space Marines — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────────
 * "Legacies give access to armories and disciplines of legendary factions."
 * You may select: 0-1 Legacy (0-2 if the "Mixed Warband" Trait is active).
 *
 * 5 Legacies total. Three of them (Hydra, Iron Lord, Night Haunter) restrict
 * the army to Undivided or unmarked units — validated by validators.ts.
 *
 * Categories:
 *   mechanic    — engine effect applied automatically (armory access)
 *   restriction — mark/unit constraint validated by the engine
 */

import type { StructuredNote } from '../archetypes/base';

export const CSM_LEGACY_NOTES: Record<string, StructuredNote[]> = {

  // SOURCE — Legacy of the Arch Traitor:
  // "The army has access to the Word Bearers Armory."
  'Legacy of the Arch Traitor': [
    { category: 'mechanic', text: 'Army gains access to the Word Bearers Armory.' },
  ],

  // SOURCE — Legacy of the Hydra:
  // "The army has access to the Alpha Legion Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  'Legacy of the Hydra': [
    { category: 'mechanic',    text: 'Army gains access to the Alpha Legion Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  // SOURCE — Legacy of the Iron Lord:
  // "The army has access to the Iron Warriors Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  'Legacy of the Iron Lord': [
    { category: 'mechanic',    text: 'Army gains access to the Iron Warriors Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  // SOURCE — Legacy of the Night Haunter:
  // "The army has access to the Night Lords Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  'Legacy of the Night Haunter': [
    { category: 'mechanic',    text: 'Army gains access to the Night Lords Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  // SOURCE — Legacy of the Warmaster:
  // "The army has access to the Black Legion Armory."
  'Legacy of the Warmaster': [
    { category: 'mechanic', text: 'Army gains access to the Black Legion Armory.' },
  ],

};
