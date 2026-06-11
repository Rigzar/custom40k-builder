/**
 * codex_tau_empire — Fase 4 migration target (5-category data model), T'au Empire's turn.
 *
 * SEVENTEENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark
 * Eldar + Eldar + Harlequins + Genestealer Cults + Orks + Tyranids + Leagues of Votann. Canonical
 * grounding in `rules-model/tau_empire.md` (built from the `.ods` canon 2026-06-11; Crisis
 * Battlesuits + Hammerhead Gunship spot-checks match production).
 *
 * Notable: Infantry-restriction via the ᴵ glyph; the Kroot sub-faction encoded in `unit_type` (not
 * keywords[]); the unique Support Systems mechanic (left `category:none`, NOT vehicle) + Drones;
 * 42 units across all 8 slots; no veteran tier. Signature mechanic = Markerlight. The Demiurg
 * (Votann) archetype makes those two Battle Brothers.
 *
 * Pre-migration: `ki-tau-empire-vetvehcategory-01` (11 Vehicle Equipment untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit; Support Systems left untagged).
 * `ki-tau-empire-psychic-unwired-01` (Ethereal Invocations + Kroot Shaman psychic not loaded)
 * remains KNOWN.
 *
 *   - slots.ts → TAU_SLOTS (42 units / 8 slots, uses every slot)                         ✅ done
 *   - unit-types.ts → TAU_UNIT_TYPES (static; Kroot encoded in unit_type)                ✅ done
 *   - keywords.ts → TAU_KEYWORDS (Infantry ᴵ-gate + Kroot-in-unit_type; mark/datasheet empty) ✅ done
 *   - special-abilities.ts → TAU_SPECIAL_ABILITIES (Markerlight + Supporting Fire + 3/7/17) ✅ done
 *   - weapon-abilities.ts → TAU_WEAPON_ABILITIES (ᴵ-gate + Support Systems + Drones + vehicle) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 T'au Empire migration done (2026-06-11).
 */

export { TAU_SLOTS } from './slots';
export { TAU_UNIT_TYPES } from './unit-types';
export { TAU_KEYWORDS } from './keywords';
export { TAU_SPECIAL_ABILITIES } from './special-abilities';
export { TAU_WEAPON_ABILITIES } from './weapon-abilities';
