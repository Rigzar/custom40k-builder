/**
 * codex_chaos_daemons/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Maps each army-list slot to its Chaos Daemons roster. Migrated from
 * `rules-model/chaos_daemons.md` §4a, cross-checked against the live per-unit files in
 * `data/parsed/chaos_daemons/units/<slot>/` (37/37 match) AND the canonical HTML source —
 * ONE correction made: the digest's "Feculant Gnarlmaw" is a typo (missing from canon); the
 * real name, verbatim in `data/source/Chaos Daemons ENG/Feculent Gnarlmaw.html` and matching
 * production, is "Feculent Gnarlmaw" (used below — GOLDEN RULE: landed in canon, not memory).
 *
 * Counts: 12 HQ / 6 Troops / 5 Elites / 8 Fast Attack / 5 Heavy Support / 0 Dedicated
 * Transport / 1 Fortifications / 0 Flyers — total 37 units. Empty slots (Dedicated
 * Transport, Flyers) are omitted, mirroring how CSM_SLOTS only lists populated slots.
 *
 * Cross-reference: unit-level details live in unit-types.ts / keywords.ts /
 * special-abilities.ts (filled in later steps of this faction's migration, per the
 * Fase-4 recipe in PLAN_PROYECTO.md §2 — Slot first, cheapest/most mechanical).
 */

export interface CdSlotEntry {
  /** Slot name, e.g. "HQ", "Troops", "Elites" */
  slot: string;
  /** Unit names in this slot's roster, verbatim from Index.html roster sheet */
  units: string[];
  /** CD-specific notes for this slot (if any), verbatim from canonical text */
  notes?: string;
}

// Source: rules-model/chaos_daemons.md §4a (VALIDATED 2026-06-03, re-read from disk Index.html
// roster sheet, matches production `slot_to_units` exactly).
export const CD_SLOTS: CdSlotEntry[] = [
  {
    slot: 'HQ',
    units: [
      'Bloodmaster', 'Bloodthirster', 'Changecaster', 'Contorted Epitome',
      'Great Unclean One', 'Infernal Enrapturess', 'Keeper of Secrets', 'Lord of Change',
      'Poxbringer', 'Sloppity Bilepiper', 'Spoilpox Scrivener', 'Tranceweaver',
    ],
  },
  {
    slot: 'Troops',
    units: [
      'Bloodletters', 'Blue Horrors', 'Daemonettes', 'Nurglings', 'Plaguebearers',
      'Pink Horrors',
    ],
  },
  {
    slot: 'Elites',
    units: ['Beasts of Nurgle', 'Bloodcrushers', 'Daemon Brutes', 'Fiends', 'Flamers'],
  },
  {
    slot: 'Fast Attack',
    units: [
      'Flesh Hounds', 'Furies', 'Hellflayer', 'Plague Drones', 'Screamers',
      'Seeker Chariot', 'Seekers', 'Slaughterbrute',
    ],
  },
  {
    slot: 'Heavy Support',
    units: [
      'Burning Chariot', 'Daemon prince', 'Mutalith Vortex Beast', 'Skull Cannon',
      'Soul Grinder',
    ],
  },
  {
    slot: 'Fortifications',
    units: ['Feculent Gnarlmaw'],
  },
];
