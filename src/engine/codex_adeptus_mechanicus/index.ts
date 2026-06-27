/**
 * codex_adeptus_mechanicus — Fase 4 migration target (5-category data model), AdMech's turn.
 *
 * SEVENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard. Mirrors `engine/codex_imperial_guard/` and the PLAN_PROYECTO.md
 * §2 recipe. Canonical grounding in `rules-model/adeptus_mechanicus.md` (built from the `.ods`
 * canon 2026-06-11).
 *
 * Pre-migration: `ki-admech-vetvehcategory-01` (9 Vehicle Equipment items untagged) fixed FIRST
 * (pure `category: 'vehicle'` tagging — POINTS already in `p_unit`, no value-move unlike IG).
 * `ki-admech-doctrina-gating-01` (Doctrina Imperatives gated per-datasheet, not modelled) remains
 * KNOWN, scoped separately (multi-unit data pass).
 *
 * Structurally an IG sibling: ALL keyword axes empty (no armour gate), rich customisation
 * (5 archetypes / 7 legacies / 16 traits) + a signature mechanic (Canticles of the Omnissiah,
 * AdMech's analogue of IG's Orders).
 *
 *   - slots.ts → ADMECH_SLOTS (29 units / 7 slots)                                    ✅ done
 *   - unit-types.ts → ADMECH_UNIT_TYPES (static; no parser artifacts)                  ✅ done
 *   - keywords.ts → ADMECH_KEYWORDS (ALL axes empty — documented absence)              ✅ done
 *   - special-abilities.ts → ADMECH_SPECIAL_ABILITIES (Canticles + 5/7/16 + gap-note)  ✅ done
 *   - weapon-abilities.ts → ADMECH_WEAPON_ABILITIES (no keyword gate + prose + points) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Adeptus Mechanicus migration done (2026-06-11).
 */

export { ADMECH_SLOTS } from './slots';
export { ADMECH_UNIT_TYPES } from './unit-types';
export { ADMECH_KEYWORDS } from './keywords';
export { ADMECH_SPECIAL_ABILITIES } from './special-abilities';
export { ADMECH_WEAPON_ABILITIES } from './weapon-abilities';
export { ADMECH_TRAIT_EFFECTS } from './traits';
export { admechResolve } from './resolver';
