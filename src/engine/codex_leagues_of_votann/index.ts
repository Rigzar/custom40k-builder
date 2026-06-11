/**
 * codex_leagues_of_votann — Fase 4 migration target (5-category data model), Votann's turn.
 *
 * SIXTEENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark
 * Eldar + Eldar + Harlequins + Genestealer Cults + Orks + Tyranids. Canonical grounding in
 * `rules-model/leagues_of_votann.md` (built from the `.ods` canon 2026-06-11; Hearthkyn Warriors +
 * Hekaton Land Fortress datasheet spot-checks match production).
 *
 * Notable: a POPULATED `armour` axis (Exo-armor, ᴱ glyph-encoded — like Orks Mega-armor); no
 * veteran tier. Signature mechanic = Eye of the Ancestors (Judgement-token economy). The Demiurg
 * archetype makes Votann Battle Brothers with Tau.
 *
 * Pre-migration: `ki-leagues-of-votann-vetvehcategory-01` (7 Vehicle Equipment untagged) fixed
 * FIRST (`category:'vehicle'`, POINTS already in p_unit). `ki-leagues-of-votann-psychic-unwired-01`
 * (Skeinwrought discipline not loaded) remains KNOWN.
 *
 *   - slots.ts → VOTANN_SLOTS (18 units / 6 slots)                                       ✅ done
 *   - unit-types.ts → VOTANN_UNIT_TYPES (static; 1 parser artifact: Hernkyn Yaegirs)      ✅ done
 *   - keywords.ts → VOTANN_KEYWORDS (armour: Exo-armor ᴱ-gate; mark/faction/datasheet empty) ✅ done
 *   - special-abilities.ts → VOTANN_SPECIAL_ABILITIES (Eye of the Ancestors + 4/5/16)     ✅ done
 *   - weapon-abilities.ts → VOTANN_WEAPON_ABILITIES (Exo-armor gate + vehicle; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Leagues of Votann migration done (2026-06-11).
 */

export { VOTANN_SLOTS } from './slots';
export { VOTANN_UNIT_TYPES } from './unit-types';
export { VOTANN_KEYWORDS } from './keywords';
export { VOTANN_SPECIAL_ABILITIES } from './special-abilities';
export { VOTANN_WEAPON_ABILITIES } from './weapon-abilities';
