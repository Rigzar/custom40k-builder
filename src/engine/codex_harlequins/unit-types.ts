/**
 * codex_harlequins/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as HARLEQUINS_SLOTS. Migrated
 * from `rules-model/harlequins.md` §1. No parser artifacts. No option-driven `set_unit_type` (the
 * "Eldar jetbike" armory option grants the Jet bike type as a stat grant on infantry).
 */

export interface HarlequinsUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/harlequins/units.json `units[name].unit_type` (production canonical).
export const HARLEQUINS_UNIT_TYPES: HarlequinsUnitTypeEntry[] = [
  { name: 'Great Harlequin', unit_type: 'Character Model, Infantry' },
  { name: 'Troupe', unit_type: 'Infantry' },
  { name: 'Death Jester', unit_type: 'Character Model, Infantry' },
  { name: 'Shadowseer', unit_type: 'Character Model, Infantry' },
  { name: 'Solitaire', unit_type: 'Infantry' },
  { name: 'Skyweavers', unit_type: 'Jetbike' },
  { name: 'Harlequin Wraithlord', unit_type: 'Monstrous Creature' },
  { name: 'Voidweaver', unit_type: 'Vehicle' },
  { name: 'Starweaver', unit_type: 'Vehicle' },
];
