/**
 * codex_adeptus_sororitas/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as SORORITAS_SLOTS. Migrated
 * from `rules-model/adeptus_sororitas.md` §1. No parser artifacts. No option-driven
 * `set_unit_type`: Seraphim/Zephyrim/Geminae/Living Saint are STATICALLY Jump Pack Infantry; the
 * "Jump pack" armory option grants the Jump-pack RULE (+6" M) on other infantry as a stat/ability
 * grant (same RULE-vs-TYPE distinction as [[project_sm_digest]]).
 */

export interface SororitasUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/adeptus_sororitas/units.json `units[name].unit_type` (production canonical).
export const SORORITAS_UNIT_TYPES: SororitasUnitTypeEntry[] = [
  // HQ
  { name: 'Canoness in Paragon Warsuit', unit_type: 'Monstrous Infantry' },
  { name: 'Geminae Superia', unit_type: 'Infantry, Jump Pack Infantry' },
  { name: 'Living Saint', unit_type: 'Character Model, Jump Pack Infantry' },
  { name: 'Missionary', unit_type: 'Character Model, Infantry' },
  { name: 'Palatine', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Battle Sisters Squad', unit_type: 'Infantry' },
  { name: 'Sisters Novitiate', unit_type: 'Infantry' },
  // Elites
  { name: 'Arco-flagellants', unit_type: 'Infantry' },
  { name: 'Celestian Insidiants', unit_type: 'Infantry' },
  { name: 'Celestian Sacresants', unit_type: 'Infantry' },
  { name: 'Celestian Squad', unit_type: 'Infantry' },
  { name: 'Crusaders', unit_type: 'Character Model, Infantry, Squadron' },
  { name: 'Dogmata', unit_type: 'Character Model, Infantry' },
  { name: 'Hospitaller', unit_type: 'Character Model, Infantry' },
  { name: 'Imagifier', unit_type: 'Character Model, Infantry' },
  { name: 'Paragon Warsuits', unit_type: 'Monstrous Infantry' },
  { name: 'Preacher', unit_type: 'Character Model, Infantry' },
  { name: 'Repentia Squad', unit_type: 'Infantry' },
  // Fast Attack
  { name: 'Dominion Squad', unit_type: 'Infantry' },
  { name: 'Seraphim Squad', unit_type: 'Infantry, Jump Pack Infantry' },
  { name: 'Zephyrim Squad', unit_type: 'Infantry, Jump Pack Infantry' },
  // Heavy Support
  { name: 'Castigator', unit_type: 'Vehicle' },
  { name: 'Exorcist', unit_type: 'Vehicle' },
  { name: 'Penitent Engines', unit_type: 'Monstrous Infantry' },
  { name: 'Retributor Squad', unit_type: 'Infantry' },
  // Dedicated Transport
  { name: 'Immolator', unit_type: 'Vehicle' },
  { name: 'Rhino', unit_type: 'Vehicle' },
];
