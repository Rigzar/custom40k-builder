/**
 * codex_space_marines — Fase 4 migration target (5-category data model), SM's turn.
 *
 * Third faction migrated, after [[project_codex_csm_pilot]] (proof-of-concept) and
 * Chaos Daemons (2nd, complete). Mirrors `engine/codex_chaos_daemons/` structure and the
 * recipe documented in PLAN_PROYECTO.md §2 (Fase 4): reuse existing digest, extract
 * programmatically, fill in cost order Slot→Unit type→Keyword→Special ability→Weapon ability,
 * anti-duplication discipline, build only at checkpoints. Canonical grounding lives in
 * `rules-model/space_marines.md`.
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Space Marines migration done (2026-06-08).
 *
 *   - slots.ts → SM_SLOTS (Slot — roster per slot, extracted from production)   ✅ done
 *   - unit-types.ts → SM_UNIT_TYPES (Unit type, same extraction pass as Slot)   ✅ done
 *   - keywords.ts → SM_KEYWORDS (Keyword — armour/mark/faction/datasheet)        ✅ done
 *   - special-abilities.ts → SM_SPECIAL_ABILITIES (§4-5 army rules/archetypes)  ✅ done
 *   - weapon-abilities.ts → SM_WEAPON_ABILITIES (§2-3 wargear gating + pricing) ✅ done
 */

export { SM_SLOTS } from './slots';
export { SM_UNIT_TYPES } from './unit-types';
export { SM_KEYWORDS } from './keywords';
export { SM_SPECIAL_ABILITIES } from './special-abilities';
export { SM_WEAPON_ABILITIES } from './weapon-abilities';
export { SM_LEGACY_DISC_MAP, SM_CRUSADER_PRAYERS } from './legacies';
export { SM_TRAIT_EFFECTS } from './traits';
export { smResolve } from './resolver';
export { validateSpaceMarines } from './validator';
export { SM_ARCHETYPES } from './archetypes/index';
export { SM_STRUCTURED_NOTES } from './archetypes/rules';
