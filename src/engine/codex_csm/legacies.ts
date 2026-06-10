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
 * ARMORY ITEM RESTRICTIONS (grounded in each legacy's HTML source):
 * Items with "Only for X" in their abilities/desc are item-level text restrictions.
 * They are enforced in validators.ts (LEGACY_ITEM_RESTRICTIONS map below + validator).
 *
 * "Unique" items within legacy armories: once per army (Core Rules L868).
 * Already enforced for Skirmish (validators.ts statCaps block).
 * General Unique enforcement for all engagements: see validators.ts.
 *
 * Categories:
 *   mechanic    — engine effect applied automatically (armory access)
 *   restriction — mark/unit constraint validated by the engine
 *   in_game     — informational only (not enforced by builder)
 */

import type { StructuredNote } from '../archetypes/base';

export const CSM_LEGACY_NOTES: Record<string, StructuredNote[]> = {

  // SOURCE — Legacy of the Arch Traitor (Word Bearers Armory):
  // "The army has access to the Word Bearers Armory."
  //
  // ARMORY ITEMS (Source: Word Bearers Armory.html):
  //   WEAPONS: Cursed Croziusᵀ (Only for Dark Apostles, -/5)
  //   EQUIPMENT: Baleful iconᵀ (5/5), Crown of the Blasphemerᵀ (-/5),
  //     Malefic tomeᵀ (-/5), The Scripts of Erebusᵀ (-/10),
  //     The Skull of Monarchiaᵀ (Unique, -/5)
  'Legacy of the Arch Traitor': [
    { category: 'mechanic', text: 'Army gains access to the Word Bearers Armory.' },
    { category: 'restriction', text: 'Cursed Crozius: Only for Dark Apostles.' },
  ],

  // SOURCE — Legacy of the Hydra (Alpha Legion Armory):
  // "The army has access to the Alpha Legion Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  //
  // ARMORY ITEMS (Source: Alpha Legion Armory.html):
  //   WEAPONS: Blade of the Hydraᵀ (Unique, -/10), Viper's Biteᵀ (20/25)
  //   EQUIPMENT: Drakescale Plate (NO ᵀ — available to all, 5/5),
  //     Hydra's Teethᵀ (-/15), Icon of Insurrectionᵀ (10/10),
  //     Mindveilᵀ (-/10)
  //   NOTE: Drakescale Plate has no ᵀ → term_compat:false → non-Terminator models can take it.
  'Legacy of the Hydra': [
    { category: 'mechanic',    text: 'Army gains access to the Alpha Legion Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  // SOURCE — Legacy of the Iron Lord (Iron Warriors Armory):
  // "The army has access to the Iron Warriors Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  //
  // ARMORY ITEMS (Source: Iron Warriors Armory.html):
  //   WEAPONS: Axe of the Forgemasterᵀ (Only for Warpsmiths, -/5),
  //     Nest of Mechaserpentsᵀ (Only for Warpsmiths, -/4),
  //     Servo armᵀ (7/9)
  //   EQUIPMENT: Cranium Malevolusᵀ (10/10), Fleshmetal Exoskeletonᵀ (6/12),
  //     Siege Breakerᵀ (5/5)
  'Legacy of the Iron Lord': [
    { category: 'mechanic',    text: 'Army gains access to the Iron Warriors Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
    { category: 'restriction', text: 'Axe of the Forgemaster and Nest of Mechaserpents: Only for Warpsmiths.' },
  ],

  // SOURCE — Legacy of the Night Haunter (Night Lords Armory):
  // "The army has access to the Night Lords Armory.
  //  Can only select units with no Mark or the Mark of Chaos Undivided."
  //
  // ARMORY ITEMS (Source: Night Lords Armory.html):
  //   WEAPONS: Claws of the Black Huntᵀ (-/10), Talons of the Night Terrorᵀ (-/10)
  //   EQUIPMENT: Curze's Orbᵀ (Unique, -/5), Scourging Chainsᵀ (-/10),
  //     Stormbolt Plateᵀ (-/5), Vox Daemonicusᵀ (5/5)
  'Legacy of the Night Haunter': [
    { category: 'mechanic',    text: 'Army gains access to the Night Lords Armory.' },
    { category: 'restriction', text: 'Only units with no Mark or the Mark of Chaos Undivided may be selected.' },
  ],

  // SOURCE — Legacy of the Warmaster (Black Legion Armory):
  // "The army has access to the Black Legion Armory."
  //
  // ARMORY ITEMS (Source: Black Legion Armory.html):
  //   WEAPONS: Heavy bolterᵀ (Unique. Only for models with the Mark of Khorne, -/23),
  //     The Eye of Nightᵀ (Unique, -/26)
  //   EQUIPMENT: Last Memory of the Yuranthos (-/10), Spineshiver Blade (-/5),
  //     The Crucible of Liesᵀ (Unique, -/10), The Hand of Darknessᵀ (-/5),
  //     The Skull of Ker'ngarᵀ (Unique, -/15)
  'Legacy of the Warmaster': [
    { category: 'mechanic',    text: 'Army gains access to the Black Legion Armory.' },
    { category: 'restriction', text: 'Heavy bolter (Black Legion): Only for models with the Mark of Khorne.' },
  ],

};

/**
 * Per-legacy item restrictions enforced by the validator.
 * Maps legacy armory key → array of { itemName, restriction }.
 * These come directly from the "Only for X" text in each armory's HTML source.
 */
export const CSM_LEGACY_ITEM_RESTRICTIONS: Record<string, { itemName: string; restriction: string; unitFilter: (unitName: string) => boolean }[]> = {

  // SOURCE: Word Bearers Armory.html — Cursed Crozius: "Only for Dark Apostles"
  'Word Bearers': [
    { itemName: 'Cursed Crozius', restriction: 'Only for Dark Apostles', unitFilter: (n) => n === 'Dark Apostle' },
  ],

  // SOURCE: Iron Warriors Armory.html — Axe + Nest: "Only for Warpsmiths"
  'Iron Warriors': [
    { itemName: 'Axe of the Forgemaster', restriction: 'Only for Warpsmiths', unitFilter: (n) => n === 'Warpsmith' },
    { itemName: 'Nest of Mechaserpents',  restriction: 'Only for Warpsmiths', unitFilter: (n) => n === 'Warpsmith' },
  ],

  // SOURCE: Black Legion Armory.html — Heavy bolter: "Only for models with the Mark of Khorne"
  // NOTE: this is a mark-based restriction, not a unit-name restriction.
  // Validated against the unit's mark in the validator.
  'Black Legion': [
    { itemName: 'Heavy bolter', restriction: 'Only for models with the Mark of Khorne', unitFilter: () => false /* mark-based, handled separately */ },
  ],

};
