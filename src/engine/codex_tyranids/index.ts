/**
 * codex_tyranids — Fase 4 migration target (5-category data model), Tyranids' turn.
 *
 * FIFTEENTH faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition +
 * Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark
 * Eldar + Eldar + Harlequins + Genestealer Cults + Orks. Canonical grounding in
 * `rules-model/tyranids.md` (built from the `.ods` canon 2026-06-11; Hive Tyrant datasheet
 * spot-check matches production, biomorphs confirmed as per-unit options).
 *
 * UNIQUE among migrated factions: no shared Armory (general.json empty), 0 vehicles, 0 veteran
 * units — wargear is the per-unit BIOMORPH system. The ONLY faction with NO armory category fix to
 * do. Datasheet axis POPULATED but uniform ("Tyranid" on all 40 units). Signature mechanic =
 * Synapse. No Traits (like Custodes/Harlequins).
 *
 * `ki-tyranids-psychic-unwired-01` (Tyranid discipline not loaded) remains KNOWN.
 *
 *   - slots.ts → TYRANID_SLOTS (40 units / 8 slots, uses every slot)                     ✅ done
 *   - unit-types.ts → TYRANID_UNIT_TYPES (static; monster-heavy, no vehicles)            ✅ done
 *   - keywords.ts → TYRANID_KEYWORDS (datasheet POPULATED but uniform: "Tyranid")        ✅ done
 *   - special-abilities.ts → TYRANID_SPECIAL_ABILITIES (Synapse + Instinctive + 3/5/0)   ✅ done
 *   - weapon-abilities.ts → TYRANID_WEAPON_ABILITIES (Biomorph system; no armory/veteran fix) ✅ done
 *
 * ALL 5 CATEGORIES COMPLETE — Fase 4 Tyranids migration done (2026-06-11).
 */

export { TYRANID_SLOTS } from './slots';
export { TYRANID_UNIT_TYPES } from './unit-types';
export { TYRANID_KEYWORDS } from './keywords';
export { TYRANID_SPECIAL_ABILITIES } from './special-abilities';
export { TYRANID_WEAPON_ABILITIES } from './weapon-abilities';
