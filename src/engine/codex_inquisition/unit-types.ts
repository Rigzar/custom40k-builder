/**
 * codex_inquisition/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME combined pass as INQ_SLOTS
 * (name+unit_type co-locate in the production files — see slots.ts header). Migrated from
 * `rules-model/inquisition.md` §1 — VALIDATED, digest fully audited+fixed v0.56.
 *
 * No option-driven `set_unit_type` mutations exist for this faction (digest §5 confirms: "No
 * archetypes/legacies/traits" and no jump-pack-style type-replacement options on any of the 13
 * units) — unlike SM (Blood Claws/Assault Squad/Inceptor/Suppressor), every entry here IS the
 * unit's only unit_type, static and final. Nothing to disambiguate.
 */

export interface InqUnitTypeEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Static datasheet unit_type, verbatim (comma-separated where the sheet lists multiple) */
  unit_type: string;
}

// Source: data/parsed/inquisition/units/<slot>/*.ts `unit_type` field (production, canonical).
export const INQ_UNIT_TYPES: InqUnitTypeEntry[] = [
  { name: 'Inquisitor', unit_type: 'Character Model, Infantry' },
  { name: 'Arbites', unit_type: 'Infantry' },
  { name: 'Ordo Hereticus Warband', unit_type: 'Infantry' },
  { name: 'Ordo Malleus Warband', unit_type: 'Infantry' },
  { name: 'Ordo Xenos Warband', unit_type: 'Infantry' },
  { name: 'Stormtroopers', unit_type: 'Infantry' },
  { name: 'Deathcult Assassins', unit_type: 'Infantry' },
  { name: 'Land Raider Prometheus', unit_type: 'Vehicle' },
  { name: 'Chimera', unit_type: 'Vehicle' },
  // carries `unit_type: "Flyer, Vehicle"` — gates the Jump-pack-equivalent Flyer rules; lives
  // under Dedicated Transport (its actual slot, see INQ_SLOTS), not a dedicated Flyers slot
  { name: 'Corvus Blackstar', unit_type: 'Flyer, Vehicle' },
  { name: 'Rhino', unit_type: 'Vehicle' },
  { name: 'Taurox', unit_type: 'Vehicle' },
  { name: 'Valkyrie', unit_type: 'Flyer, Vehicle' },
];
