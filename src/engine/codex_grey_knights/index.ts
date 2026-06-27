/**
 * codex_grey_knights — Fase 4 migration target (5-category data model), Grey Knights' turn.
 *
 * Fifth faction migrated, after [[project_codex_csm_pilot]] (proof-of-concept), Chaos Daemons,
 * Space Marines, and Inquisition (all complete). Mirrors `engine/codex_inquisition/` structure
 * and the recipe documented in PLAN_PROYECTO.md §2 (Fase 4): reuse existing digest, extract
 * programmatically, fill in cost order Slot→Unit type→Keyword→Special ability→Weapon ability,
 * anti-duplication discipline, build only at checkpoints. Canonical grounding lives in
 * `rules-model/grey_knights.md` (built from scratch 2026-06-08).
 *
 * Pre-migration blocker `ki-gk-vetvehcategory-01` (8 Veteran Abilities + 10 Vehicle Equipment
 * armory items missing `category`/`p_veh`) was fixed FIRST, mirroring the Inquisition order.
 *
 *   - slots.ts → GK_SLOTS (Slot — roster per slot, extracted from production)        ✅ done
 *   - unit-types.ts → GK_UNIT_TYPES (Unit type, same extraction pass as Slot)        ✅ done
 *   - keywords.ts → GK_KEYWORDS (Keyword — armour/mark/faction/datasheet)            ✅ done
 *   - special-abilities.ts → GK_SPECIAL_ABILITIES (§4 army rules + §5 archetypes/legacies) ✅ done
 *   - weapon-abilities.ts → GK_WEAPON_ABILITIES (§2-3 wargear gating)                ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Grey Knights migration done (2026-06-11).
 * Fifth faction fully migrated, after codex_csm (pilot) + Chaos Daemons + Space Marines +
 * Inquisition.
 */

export { GK_SLOTS } from './slots';
export { GK_UNIT_TYPES } from './unit-types';
export { GK_KEYWORDS } from './keywords';
export { GK_SPECIAL_ABILITIES } from './special-abilities';
export { GK_WEAPON_ABILITIES } from './weapon-abilities';
export { getGKLegacyPower } from './legacies';
