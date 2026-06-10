/**
 * codex_csm/slots — category 5 of 5 in the codex.ts data model (Slot).
 *
 * Maps each army-list slot (HQ / Troops / Elites / Fast Attack / Heavy Support /
 * Dedicated Transport / Fortifications / Flyers) to its CSM roster.
 *
 * Roster migrated from `digest.md` §4c (line ~199, VALIDATED 2026-06-03 — re-read from disk
 * Index.html roster sheet, no corrections). Counts: 8 HQ / 8 Troops / 22 Elites / 9 Fast
 * Attack / 9 Heavy Support / 2 Dedicated Transport / 2 Fortifications / 1 Flyer.
 *
 * `notes` is left for CSM-specific slot rules surfaced later in §4d–§4i (none found yet beyond
 * the roster itself — most slot-level rules are general AOP/cap rules that apply to all
 * factions and live in core rules (`coreRules.ts` / `_engine.md`), not here).
 *
 * Cross-reference: unit-level details (type, keywords, abilities) live in unit-types.ts /
 * keywords.ts / special-abilities.ts — this file is purely the slot→roster index.
 */

export interface CsmSlotEntry {
  /** Slot name, e.g. "HQ", "Troops", "Elites" */
  slot: string;
  /** Unit names in this slot's roster, verbatim from Index.html roster sheet */
  units: string[];
  /** CSM-specific notes for this slot (if any), verbatim from canonical text */
  notes?: string;
}

// Source: digest.md §4c (VALIDATED 2026-06-03, re-read from disk Index.html roster sheet).
// Counts confirmed: 8 HQ / 8 Troops / 22 Elites / 9 Fast Attack / 9 Heavy Support /
// 2 Dedicated Transport / 2 Fortifications / 1 Flyer.
export const CSM_SLOTS: CsmSlotEntry[] = [
  {
    slot: 'HQ',
    units: [
      'Adept of Possession', 'Chaos Lieutenant', 'Chaos Sorcerer', 'Dark Apostle',
      'Daemon Prince', 'Infernal Acolyte', 'Lord Discordant', 'Warpsmith',
    ],
  },
  {
    slot: 'Troops',
    units: [
      'Accursed Cultists', 'Chaos Space Marines', 'Cultists', 'Jakhals', 'Mutants',
      'Poxwalkers', 'Traitor Guard', 'Tzaangors',
    ],
  },
  {
    slot: 'Elites',
    units: [
      'Big Mutants', 'Blightlord Terminators', 'Chaos Terminators', 'Chosen',
      'Cultist Firebrand', 'Dark Commune', 'Deathshroud Terminators', 'Eightbound',
      'Exalted Plague Champion', 'Flawless Blades', 'Helbrute', 'Khorne Berzerkers',
      'Legionnaires', 'Master of Execution', 'Noise Marines', 'Plague Marines', 'Possessed',
      'Red Butcher Terminators', 'Rubric Marines', 'Scarab Occult Terminators',
      'Sekhetar Robots', 'Tzaangor Shaman',
    ],
  },
  {
    slot: 'Fast Attack',
    units: [
      'Chaos Bikers', 'Chaos Spawn', 'Foetid Bloat-Drone', 'Juggernaut Hellriders',
      'Myphitic Blight-Hauler', 'Raptors', 'Tzaangor Enlightened', 'Venomcrawler',
      'Warptalons',
    ],
  },
  {
    slot: 'Heavy Support',
    units: [
      'Chaos Land Raider', 'Chaos Predator', 'Chaos Vindicator', 'Defiler', 'Forgefiend',
      'Havocs', 'Maulerfiend', 'Obliterator', 'Plagueburst Crawler',
    ],
  },
  {
    slot: 'Dedicated Transport',
    units: ['Chaos Rhino', 'Dreadclaw Drop Pod'],
  },
  {
    slot: 'Fortifications',
    units: ['Miasmic Malignifier', 'Noctilith Crown'],
  },
  {
    slot: 'Flyers',
    units: ['Heldrake'],
  },
];
