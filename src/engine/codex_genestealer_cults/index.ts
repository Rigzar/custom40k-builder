/**
 * codex_genestealer_cults — Fase 4 migration target (5-category data model), GSC's turn.
 *
 * THIRTEENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark
 * Eldar + Eldar + Harlequins. Canonical grounding in `rules-model/genestealer_cults.md` (built from
 * the `.ods` canon 2026-06-11 — all sheets read before deciding).
 *
 * All keyword axes empty (IG/AdMech/Sororitas/Eldar/Harlequins group); no veteran tier. Signature
 * mechanic = Ambush (marker-based deployment/reserve). Legacies are GK-shaped (bonus-power grants,
 * not armory access). Very character-heavy roster (11 of 20 units are Character Model, Infantry).
 *
 * Pre-migration: `ki-genestealer-cults-vetvehcategory-01` (7 Vehicle Equipment untagged) fixed
 * FIRST (`category:'vehicle'`, POINTS already in p_unit). `ki-genestealer-cults-psychic-unwired-01`
 * (Broodmind discipline + 6 Legacy powers not loaded) remains KNOWN.
 *
 *   - slots.ts → GSC_SLOTS (20 units / 6 slots)                                          ✅ done
 *   - unit-types.ts → GSC_UNIT_TYPES (static; no parser artifacts)                        ✅ done
 *   - keywords.ts → GSC_KEYWORDS (ALL axes empty)                                         ✅ done
 *   - special-abilities.ts → GSC_SPECIAL_ABILITIES (Ambush + 2/6/15 + psychic gap-note)   ✅ done
 *   - weapon-abilities.ts → GSC_WEAPON_ABILITIES (no keyword gate + vehicle; no veteran tier) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Genestealer Cults migration done (2026-06-11).
 */

export { GSC_SLOTS } from './slots';
export { GSC_UNIT_TYPES } from './unit-types';
export { GSC_KEYWORDS } from './keywords';
export { GSC_SPECIAL_ABILITIES } from './special-abilities';
export { GSC_WEAPON_ABILITIES } from './weapon-abilities';
export { GSC_TRAIT_EFFECTS } from './traits';
