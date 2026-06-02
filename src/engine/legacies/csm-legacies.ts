/**
 * Structured legacy notes for Chaos Space Marines.
 *
 * Categories:
 *   mechanic    — engine effect applied automatically (armory access)
 *   restriction — banned mark / unit selection constraint (validated by engine)
 */

import type { StructuredNote } from '../archetypes/base';

export const CSM_LEGACY_NOTES: Record<string, StructuredNote[]> = {

  'Legacy of the Arch Traitor': [
    { category: 'mechanic',    text: 'Army gains access to the Word Bearers Armory.' },
  ],

  'Legacy of the Hydra': [
    { category: 'mechanic',    text: 'Army gains access to the Alpha Legion Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  'Legacy of the Iron Lord': [
    { category: 'mechanic',    text: 'Army gains access to the Iron Warriors Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  'Legacy of the Night Haunter': [
    { category: 'mechanic',    text: 'Army gains access to the Night Lords Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  'Legacy of the Warmaster': [
    { category: 'mechanic',    text: 'Army gains access to the Black Legion Armory.' },
  ],

};
