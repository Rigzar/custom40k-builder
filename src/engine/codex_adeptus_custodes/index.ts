/**
 * codex_adeptus_custodes — Fase 4 migration target (5-category data model), Custodes' turn.
 *
 * NINTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey
 * Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas. Mirrors
 * `engine/codex_grey_knights/` and the PLAN_PROYECTO.md §2 recipe. Canonical grounding in
 * `rules-model/adeptus_custodes.md` (built from the `.ods` canon 2026-06-11).
 *
 * Pre-migration: `ki-custodes-vetvehcategory-01` (8 Veteran Abilities + 6 Vehicle Equipment
 * untagged) fixed FIRST — veteran got `category:'veteran'` + `p_veh` (M&V column), vehicle got
 * `category:'vehicle'` (POINTS already in p_unit). `ki-custodes-vigilators-phantom-01` (slot
 * references a unit with no datasheet) remains KNOWN.
 *
 * Structurally a GK/Inquisition sibling: single binary ᵀ-gate armour axis + a veteran-ability
 * tier (17/19 units) — NOT the IG/AdMech/Sororitas all-empty group. Signature mechanic = Shield
 * Host (objective/Battleshock/Precision army-wide rule).
 *
 *   - slots.ts → CUSTODES_SLOTS (19 units / 6 slots; Vigilators phantom excluded)       ✅ done
 *   - unit-types.ts → CUSTODES_UNIT_TYPES (static; no parser artifacts)                  ✅ done
 *   - keywords.ts → CUSTODES_KEYWORDS (armour: Terminator ᵀ-gate; mark/faction/datasheet empty) ✅ done
 *   - special-abilities.ts → CUSTODES_SPECIAL_ABILITIES (Shield Host + Lightning strike + 2/5/0) ✅ done
 *   - weapon-abilities.ts → CUSTODES_WEAPON_ABILITIES (ᵀ-gate + veteran + vehicle + points)  ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Adeptus Custodes migration done (2026-06-11).
 */

export { CUSTODES_SLOTS } from './slots';
export { CUSTODES_UNIT_TYPES } from './unit-types';
export { CUSTODES_KEYWORDS } from './keywords';
export { CUSTODES_SPECIAL_ABILITIES } from './special-abilities';
export { CUSTODES_WEAPON_ABILITIES } from './weapon-abilities';
