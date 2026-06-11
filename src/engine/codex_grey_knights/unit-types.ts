/**
 * codex_grey_knights/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME combined pass as GK_SLOTS (see
 * slots.ts header). Migrated from `rules-model/grey_knights.md` §1.
 *
 * No option-driven `set_unit_type` mutations exist for this faction: digest §1 confirms
 * Interceptor Squad's "Infantry, Jump Pack Infantry" is its STATIC type — the "Personal
 * teleporter"/"Teleporter" armory options are pure ability/stat-mod GRANTS (Jump pack rule +
 * +6" M) on otherwise-static-type units, mirroring the SM "Jump pack RULE vs Jump Pack Infantry
 * TYPE" distinction (see [[project_sm_digest]] §Fase 2). Every entry here IS the unit's only
 * unit_type, static and final.
 */

export interface GkUnitTypeEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Static datasheet unit_type, verbatim (comma-separated where the sheet lists multiple) */
  unit_type: string;
}

// Source: data/parsed/grey_knights/units/<slot>/*.ts `unit_type` field (production, canonical).
export const GK_UNIT_TYPES: GkUnitTypeEntry[] = [
  { name: 'Brotherhood Champion', unit_type: 'Character Model, Infantry' },
  { name: 'Captain', unit_type: 'Character Model, Infantry' },
  { name: 'Captain in Nemesis Armor', unit_type: 'Monstrous Creature' },
  { name: 'Chaplain', unit_type: 'Character Model, Infantry' },
  { name: 'Librarian', unit_type: 'Character Model, Infantry' },
  { name: 'Strike Squad', unit_type: 'Infantry' },
  { name: 'Terminator Squad', unit_type: 'Infantry' },
  { name: 'Ancient', unit_type: 'Character Model, Infantry' },
  { name: 'Apothecary', unit_type: 'Character Model, Infantry' },
  { name: 'Dreadnought', unit_type: 'Walker' },
  { name: 'Ghost Terminator Squad', unit_type: 'Infantry' },
  { name: 'Paladin Squad', unit_type: 'Infantry' },
  { name: 'Purifier Squad', unit_type: 'Infantry' },
  // STATIC type (not option-driven, see header note)
  { name: 'Interceptor Squad', unit_type: 'Infantry, Jump Pack Infantry' },
  { name: 'Land Raider', unit_type: 'Vehicle' },
  { name: 'Land Raider Crusader', unit_type: 'Vehicle' },
  { name: 'Land Raider Redeemer', unit_type: 'Vehicle' },
  { name: 'Nemesis Dreadknight', unit_type: 'Monstrous Creature' },
  { name: 'Purgator Squad', unit_type: 'Infantry' },
  { name: 'Razorback', unit_type: 'Vehicle' },
  { name: 'Rhino', unit_type: 'Vehicle' },
  { name: 'Stormraven Gunship', unit_type: 'Flyer, Vehicle' },
];
