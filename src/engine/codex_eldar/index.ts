/**
 * codex_eldar — Fase 4 migration target (5-category data model), Eldar's turn.
 *
 * ELEVENTH faction migrated (LARGEST roster, 38 units), after CSM (pilot) + Chaos Daemons + Space
 * Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas +
 * Adeptus Custodes + Dark Eldar. Mirrors the PLAN_PROYECTO.md §2 recipe. Canonical grounding in
 * `rules-model/eldar.md` (built from the `.ods` canon 2026-06-11).
 *
 * Pre-migration: `ki-eldar-vetvehcategory-01` (8 Vehicle Equipment untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit). NO veteran tier (like CD/Sororitas/Dark Eldar).
 * Two KNOWN gaps logged: `ki-eldar-aspect-wraith-keyword-01` (Aspect/Wraith sub-types referenced in
 * archetypes but not in production keywords[]) + `ki-eldar-psychic-unwired-01` (Eldar discipline +
 * Revenant not loaded — same class as IG).
 *
 *   - slots.ts → ELDAR_SLOTS (38 units / 7 slots)                                       ✅ done
 *   - unit-types.ts → ELDAR_UNIT_TYPES (static; 1 parser artifact: Swooping Hawks "Jump pack") ✅ done
 *   - keywords.ts → ELDAR_KEYWORDS (ALL axes empty; Aspect/Wraith not modelled)          ✅ done
 *   - special-abilities.ts → ELDAR_SPECIAL_ABILITIES (Battle Focus + Shuriken + 6/5/15 + gaps) ✅ done
 *   - weapon-abilities.ts → ELDAR_WEAPON_ABILITIES (no keyword gate + vehicle; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Eldar migration done (2026-06-11).
 */

export { ELDAR_SLOTS } from './slots';
export { ELDAR_UNIT_TYPES } from './unit-types';
export { ELDAR_KEYWORDS } from './keywords';
export { ELDAR_SPECIAL_ABILITIES } from './special-abilities';
export { ELDAR_WEAPON_ABILITIES } from './weapon-abilities';
export { ELDAR_TRAIT_EFFECTS } from './traits';
