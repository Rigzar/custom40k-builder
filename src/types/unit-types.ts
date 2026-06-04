/**
 * Canonical unit type strings — exactly as defined in core_rules_text.txt L460-541.
 * Use these constants whenever setting or comparing unit_type values to avoid
 * casing inconsistencies. A model may have one or more types (comma-separated).
 *
 * "Jump pack" and "Jump pack infantry" are NOT the same thing:
 *   - UNIT_TYPE.JUMP_PACK_INFANTRY is the unit TYPE (gains Deep Strike, ignores terrain).
 *   - "Jump pack" is an ABILITY (rule) that grants +6" M and move-over-impassable only.
 * See core_rules L503-507 for Jump Pack Infantry, L390/L899 for the Jump pack rule.
 */
export const UNIT_TYPE = {
  INFANTRY:           'Infantry',
  BIKE:               'Bike',
  CHARACTER_MODEL:    'Character Model',
  JET_BIKE:           'Jet Bike',
  JUMP_PACK_INFANTRY: 'Jump Pack Infantry',
  MONSTROUS_CREATURE: 'Monstrous Creature',
  MONSTROUS_INFANTRY: 'Monstrous Infantry',
  WALKER:             'Walker',
  FLYER:              'Flyer',
  VEHICLE:            'Vehicle',
} as const;

export type UnitTypeName = typeof UNIT_TYPE[keyof typeof UNIT_TYPE];

/** All canonical unit type names as an array — useful for validation. */
export const UNIT_TYPE_NAMES = Object.values(UNIT_TYPE);

/** True if the string is a canonical core-rules unit type name. */
export function isCanonicalUnitType(s: string): s is UnitTypeName {
  return (UNIT_TYPE_NAMES as readonly string[]).includes(s);
}
