/**
 * codex_chaos_daemons — Fase 4 migration target (5-category data model), CD's turn.
 *
 * Mirrors `engine/codex_csm/` structure and the recipe documented in PLAN_PROYECTO.md §2
 * (Fase 4): Slot first (cheapest, mechanical), then Unit type / Keyword / Special ability /
 * Weapon ability. Canonical grounding lives in `rules-model/chaos_daemons.md`.
 *
 *   - slots.ts → CD_SLOTS (Slot — roster per slot, §4a)            ✅ done
 *   - unit-types.ts → CD_UNIT_TYPES (Unit type, §4d-4i)            ✅ done
 *   - keywords.ts → CD_KEYWORDS (Keyword — armour/mark/faction)    ✅ done
 *   - special-abilities.ts → CD_SPECIAL_ABILITIES (§4, §4b, §6)    ✅ done
 *   - weapon-abilities.ts → CD_WEAPON_ABILITIES (§2-3)             ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Chaos Daemons migration done (2026-06-08).
 */

export { CD_SLOTS } from './slots';
export { CD_UNIT_TYPES } from './unit-types';
export { CD_KEYWORDS } from './keywords';
export { CD_SPECIAL_ABILITIES } from './special-abilities';
export { CD_WEAPON_ABILITIES } from './weapon-abilities';
