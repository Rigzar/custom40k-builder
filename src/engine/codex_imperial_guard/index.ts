/**
 * codex_imperial_guard — Fase 4 migration target (5-category data model), Imperial Guard's turn.
 *
 * SIXTH faction migrated, after [[project_codex_csm_pilot]] (pilot), Chaos Daemons, Space Marines,
 * Inquisition, and Grey Knights (all complete). Mirrors `engine/codex_grey_knights/` structure and
 * the recipe in PLAN_PROYECTO.md §2 (Fase 4): reuse the digest, extract programmatically, fill in
 * cost order Slot→Unit type→Keyword→Special ability→Weapon ability, anti-duplication, build at
 * checkpoints. Canonical grounding lives in `rules-model/imperial_guard.md` (built from the `.ods`
 * canon 2026-06-11).
 *
 * Pre-migration blocker `ki-ig-vetvehcategory-01` (8 Veteran Abilities + 16 Vehicle Upgrades
 * missing `category`/`p_veh`; vehicle POINTS in the wrong column) was fixed FIRST, mirroring the
 * GK order. `ki-ig-psychic-unwired-01` (Psikana + Hymns in canon but not loaded) remains KNOWN,
 * scoped separately.
 *
 * IG is the most lopsided faction migrated: the SIMPLEST keyword vocabulary (all 4 axes empty —
 * no armour gate at all) but the RICHEST customisation (11 archetypes / 7 legacies / 16 traits)
 * plus a signature Orders mechanic.
 *
 *   - slots.ts → IG_SLOTS (60 units / 7 slots, from units.json slot_to_units)          ✅ done
 *   - unit-types.ts → IG_UNIT_TYPES (static; 2 parser-artifact values documented)       ✅ done
 *   - keywords.ts → IG_KEYWORDS (ALL axes empty — documented absence)                    ✅ done
 *   - special-abilities.ts → IG_SPECIAL_ABILITIES (Orders + Hymns + Psikana + 11/7/16)   ✅ done
 *   - weapon-abilities.ts → IG_WEAPON_ABILITIES (no keyword gate + prose + points)        ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Imperial Guard migration done (2026-06-11).
 */

export { IG_SLOTS } from './slots';
export { IG_UNIT_TYPES } from './unit-types';
export { IG_KEYWORDS } from './keywords';
export { IG_SPECIAL_ABILITIES } from './special-abilities';
export { IG_WEAPON_ABILITIES } from './weapon-abilities';
export { IG_TRAIT_EFFECTS } from './traits';
