/**
 * codex_orks — Fase 4 migration target (5-category data model), Orks' turn.
 *
 * FOURTEENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark
 * Eldar + Eldar + Harlequins + Genestealer Cults. Canonical grounding in `rules-model/orks.md`
 * (built from the `.ods` canon 2026-06-11; datasheet spot-checks Boyz + Battlewagon match
 * production exactly).
 *
 * Notable: a POPULATED `armour` axis (Mega armor, ᴹ glyph-encoded — like Custodes/CSM, not the
 * empty-armour group); a unique Kustom Jobs mechanic (unit-gated upgrades, left `category:none`,
 * NOT vehicle-only); FIRST faction with a populated Fortifications slot; no veteran tier. Signature
 * mechanic = Waaagh!.
 *
 * Pre-migration: `ki-orks-vetvehcategory-01` (13 Vehicle Upgrades untagged) fixed FIRST
 * (`category:'vehicle'`, POINTS already in p_unit; the 16 Kustom Jobs deliberately left untagged).
 * `ki-orks-psychic-unwired-01` (Waaagh! discipline not loaded) remains KNOWN.
 *
 *   - slots.ts → ORK_SLOTS (41 units / 8 slots incl. Fortifications)                     ✅ done
 *   - unit-types.ts → ORK_UNIT_TYPES (static; no parser artifacts)                        ✅ done
 *   - keywords.ts → ORK_KEYWORDS (armour: Mega armor ᴹ-gate; mark/faction/datasheet empty) ✅ done
 *   - special-abilities.ts → ORK_SPECIAL_ABILITIES (Waaagh! + Mob + Dakka + Tellyporta + 2/6/14) ✅ done
 *   - weapon-abilities.ts → ORK_WEAPON_ABILITIES (Mega-armor gate + Kustom Jobs + vehicle; no veteran) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Orks migration done (2026-06-11).
 */

export { ORK_SLOTS } from './slots';
export { ORK_UNIT_TYPES } from './unit-types';
export { ORK_KEYWORDS } from './keywords';
export { ORK_SPECIAL_ABILITIES } from './special-abilities';
export { ORK_WEAPON_ABILITIES } from './weapon-abilities';
export { ORKS_TRAIT_EFFECTS } from './traits';
