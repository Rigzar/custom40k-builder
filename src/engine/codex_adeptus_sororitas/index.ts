/**
 * codex_adeptus_sororitas — Fase 4 migration target (5-category data model), Sororitas' turn.
 *
 * EIGHTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey
 * Knights + Imperial Guard + Adeptus Mechanicus. Mirrors `engine/codex_imperial_guard/` and the
 * PLAN_PROYECTO.md §2 recipe. Canonical grounding in `rules-model/adeptus_sororitas.md` (built
 * from the `.ods` canon 2026-06-11).
 *
 * Pre-migration: `ki-sororitas-vetvehcategory-01` (9 Vehicle Upgrades untagged) fixed FIRST (pure
 * `category: 'vehicle'` tagging — POINTS already in `p_unit`, like AdMech). NO Doctrina/Veteran
 * gap here: Sororitas have no veteran-ability tier at all (like Chaos Daemons).
 *
 * Structurally an IG/AdMech sibling on keywords (all axes empty, no armour gate) but UNIQUE in
 * lacking any veteran-ability pricing tier. Signature mechanic = Acts of Faith (Faith-point
 * economy). Witch hunters (Inquisition + Assassins access) already shipped.
 *
 *   - slots.ts → SORORITAS_SLOTS (27 units / 6 slots)                                   ✅ done
 *   - unit-types.ts → SORORITAS_UNIT_TYPES (static; no parser artifacts)                ✅ done
 *   - keywords.ts → SORORITAS_KEYWORDS (ALL axes empty — documented absence)            ✅ done
 *   - special-abilities.ts → SORORITAS_SPECIAL_ABILITIES (Acts of Faith + 3/7/12 + Witch hunters) ✅ done
 *   - weapon-abilities.ts → SORORITAS_WEAPON_ABILITIES (no keyword gate; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Adeptus Sororitas migration done (2026-06-11).
 */

export { SORORITAS_SLOTS } from './slots';
export { SORORITAS_UNIT_TYPES } from './unit-types';
export { SORORITAS_KEYWORDS } from './keywords';
export { SORORITAS_SPECIAL_ABILITIES } from './special-abilities';
export { SORORITAS_WEAPON_ABILITIES } from './weapon-abilities';
