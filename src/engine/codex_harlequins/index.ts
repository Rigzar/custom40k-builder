/**
 * codex_harlequins — Fase 4 migration target (5-category data model), Harlequins' turn.
 *
 * TWELFTH faction migrated (SMALLEST roster, 9 units), after CSM (pilot) + Chaos Daemons + Space
 * Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas +
 * Adeptus Custodes + Dark Eldar + Eldar. Canonical grounding in `rules-model/harlequins.md` (built
 * from the `.ods` canon 2026-06-11).
 *
 * The simplest faction alongside Inquisition: all keyword axes empty, no veteran tier, and NO Army
 * Customisation (no archetypes/legacies/traits — confirmed absent, like Inquisition). Doubles as a
 * native ally for Eldar + Dark Eldar.
 *
 * Pre-migration: `ki-harlequins-vetvehcategory-01` (6 Vehicle Equipment untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit). `ki-harlequins-psychic-unwired-01` (Shadowseer
 * discipline not loaded) remains KNOWN.
 *
 *   - slots.ts → HARLEQUINS_SLOTS (9 units / 6 slots)                                    ✅ done
 *   - unit-types.ts → HARLEQUINS_UNIT_TYPES (static; no parser artifacts)                 ✅ done
 *   - keywords.ts → HARLEQUINS_KEYWORDS (ALL axes empty)                                  ✅ done
 *   - special-abilities.ts → HARLEQUINS_SPECIAL_ABILITIES (Shuriken + Webway + ally + no-customisation) ✅ done
 *   - weapon-abilities.ts → HARLEQUINS_WEAPON_ABILITIES (no keyword gate + vehicle; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Harlequins migration done (2026-06-11).
 */

export { HARLEQUINS_SLOTS } from './slots';
export { HARLEQUINS_UNIT_TYPES } from './unit-types';
export { HARLEQUINS_KEYWORDS } from './keywords';
export { HARLEQUINS_SPECIAL_ABILITIES } from './special-abilities';
export { HARLEQUINS_WEAPON_ABILITIES } from './weapon-abilities';
