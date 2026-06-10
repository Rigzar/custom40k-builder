/**
 * codex_inquisition — Fase 4 migration target (5-category data model), Inquisition's turn.
 *
 * Fourth faction migrated, after [[project_codex_csm_pilot]] (proof-of-concept), Chaos Daemons
 * (2nd, complete), and Space Marines (3rd, complete). Mirrors `engine/codex_space_marines/`
 * structure and the recipe documented in PLAN_PROYECTO.md §2 (Fase 4): reuse existing digest,
 * extract programmatically, fill in cost order Slot→Unit type→Keyword→Special ability→Weapon
 * ability, anti-duplication discipline, build only at checkpoints. Canonical grounding lives in
 * `rules-model/inquisition.md` (fully audited+fixed v0.56 — see [[project_inquisition_audit]]).
 *
 * SMALLEST faction migrated so far (5 slots/13 units vs CSM 8/62, CD 6/37, SM 8/74) AND the
 * structurally simplest Paso 4 candidate: digest §5 confirms NO archetypes/legacies/traits
 * exist for this faction at all — Army Customisation tab is absent from Index.html. Picked
 * deliberately as the cheapest-to-migrate 4th faction (per "tú elige, lo más eficiente").
 *
 *   - slots.ts → INQ_SLOTS (Slot — roster per slot, extracted from production)   ✅ done
 *   - unit-types.ts → INQ_UNIT_TYPES (Unit type, same extraction pass as Slot)   ✅ done
 *   - keywords.ts → INQ_KEYWORDS (Keyword — armour/ordo/mark/faction/datasheet)   ✅ done
 *   - special-abilities.ts → INQ_SPECIAL_ABILITIES (§4 army rules, no archetypes)✅ done
 *   - weapon-abilities.ts → INQ_WEAPON_ABILITIES (§2-3 wargear gating)           ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Inquisition migration done (2026-06-08).
 * Fourth faction fully migrated, after codex_csm (pilot) + Chaos Daemons + Space Marines.
 */

export { INQ_SLOTS } from './slots';
export { INQ_UNIT_TYPES } from './unit-types';
export { INQ_KEYWORDS } from './keywords';
export { INQ_SPECIAL_ABILITIES } from './special-abilities';
export { INQ_WEAPON_ABILITIES } from './weapon-abilities';
