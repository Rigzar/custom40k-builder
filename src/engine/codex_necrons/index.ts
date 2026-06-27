/**
 * codex_necrons — Fase 4 migration target (5-category data model), Necrons' turn.
 *
 * EIGHTEENTH and FINAL faction migrated — completes the full 19-faction roster (after CSM pilot +
 * Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus
 * + Adeptus Sororitas + Adeptus Custodes + Dark Eldar + Eldar + Harlequins + Genestealer Cults +
 * Orks + Tyranids + Leagues of Votann + T'au Empire). Canonical grounding in
 * `rules-model/necrons.md` (built from the `.ods` canon 2026-06-11, which the user added
 * mid-session; Warriors + Monolith spot-checks match production).
 *
 * Notable: the Necron/Canoptek sub-factions encoded in `unit_type` (not keywords[], like Tau's
 * Kroot); no veteran tier. Signature mechanic = Reanimation Protocols (RPoint economy).
 *
 * Pre-migration: `ki-necrons-vetvehcategory-01` (4 Vehicle Equipment untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit). `ki-necrons-psychic-unwired-01` (Powers of the
 * C'tan not loaded) remains KNOWN.
 *
 *   - slots.ts → NECRON_SLOTS (37 units / 8 slots, uses every slot)                      ✅ done
 *   - unit-types.ts → NECRON_UNIT_TYPES (static; Necron/Canoptek encoded in unit_type)   ✅ done
 *   - keywords.ts → NECRON_KEYWORDS (Necron/Canoptek-in-unit_type; armour/mark/datasheet empty) ✅ done
 *   - special-abilities.ts → NECRON_SPECIAL_ABILITIES (Reanimation Protocols + Gauss + 4/6/17) ✅ done
 *   - weapon-abilities.ts → NECRON_WEAPON_ABILITIES (no keyword gate + vehicle; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Necrons migration done (2026-06-11). 19/19 FACTIONS MIGRATED.
 */

export { NECRON_SLOTS } from './slots';
export { NECRON_UNIT_TYPES } from './unit-types';
export { NECRON_KEYWORDS } from './keywords';
export { NECRON_SPECIAL_ABILITIES } from './special-abilities';
export { NECRON_WEAPON_ABILITIES } from './weapon-abilities';
export { NECRONS_TRAIT_EFFECTS } from './traits';
