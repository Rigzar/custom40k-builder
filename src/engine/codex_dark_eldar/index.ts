/**
 * codex_dark_eldar — Fase 4 migration target (5-category data model), Dark Eldar's turn.
 *
 * TENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey
 * Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes. Mirrors the
 * PLAN_PROYECTO.md §2 recipe. Canonical grounding in `rules-model/dark_eldar.md` (built from the
 * `.ods` canon 2026-06-11).
 *
 * HEADLINE: Dark Eldar is the SECOND faction (after the CSM pilot) with a POPULATED `datasheet`
 * keyword axis — its three sub-factions (Kabal/Coven/Cult) are modelled via the unit `keywords[]`
 * array (the target keyword model). This axis drives the sub-faction-purity archetypes and the
 * "Only for <Coven>/<Cult>/<Kabal>" trait/item gating.
 *
 * Pre-migration: `ki-dark-eldar-vetvehcategory-01` (7 Vehicle Equipment untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit). NO veteran tier (like CD/Sororitas).
 * `ki-dark-eldar-furiouscharge-phantom-01` (a Power-through-Pain bonus name in the Elites slot
 * index, no datasheet) remains KNOWN.
 *
 *   - slots.ts → DARK_ELDAR_SLOTS (19 units / 7 slots; "Furious Charge" phantom excluded)  ✅ done
 *   - unit-types.ts → DARK_ELDAR_UNIT_TYPES (static; no parser artifacts)                   ✅ done
 *   - keywords.ts → DARK_ELDAR_KEYWORDS (datasheet POPULATED: Kabal/Coven/Cult sub-factions) ✅ done
 *   - special-abilities.ts → DARK_ELDAR_SPECIAL_ABILITIES (Combat drugs + PtP + 5/3/22)      ✅ done
 *   - weapon-abilities.ts → DARK_ELDAR_WEAPON_ABILITIES (sub-faction gating + vehicle + drugs) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Dark Eldar migration done (2026-06-11).
 */

export { DARK_ELDAR_SLOTS } from './slots';
export { DARK_ELDAR_UNIT_TYPES } from './unit-types';
export { DARK_ELDAR_KEYWORDS } from './keywords';
export { DARK_ELDAR_SPECIAL_ABILITIES } from './special-abilities';
export { DARK_ELDAR_WEAPON_ABILITIES } from './weapon-abilities';
export { DARK_ELDAR_TRAIT_EFFECTS } from './traits';
