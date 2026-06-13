# Rules-model digest — Chaos Space Marines

> Per-faction digest of rules + keyword model, validated against canonical files.
> Fase 1 of the CSM .ods×.ods audit (2026-06-12). Covers Army Customisation, Animosity of the
> Gods, and all 10 armory sheets (General + 4 Marks + 5 Legions). Unit-by-unit audit (62
> datasheets) is a separate, later pass.

---

## Faction: Chaos Space Marines

**Sources read to build this digest:**
- `Informacion/Chaos Space Marines ENG.ods` — sheets: "Army Customisation", "Animosity of the
  Gods", "Armory", "Armory of Khorne/Nurgle/Slaanesh/Tzeentch", "Alpha Legion/Black
  Legion/Iron Warriors/Night Lords/Word Bearers Armory" (2026-06-12)
- `data/parsed/chaos_space_marines/archetypes.json`, `animosity.json`,
  `armory/{general,mark_*,legion_*}.json`
- `src/engine/codex_csm/traits.ts`, `src/engine/validators.ts`

### 1. Keyword vocabulary

- **Armour types:** Terminator (ᵀ glyph — gates the general Armory + 4 Mark Armories + 5 Legion
  Armories, all marked `armour_compat: ["Terminator"]`); Cataphractii (Nurgle-only, granted by
  "Cataphractii armor" equipment item, `armourKeyword: "Cataphractii"`, gates "Manreaper" and
  "Twin plague spewer" via `requires_keywords`).
- **Marks / sub-factions:** Undivided/Without, Khorne, Nurgle, Slaanesh, Tzeentch — drive
  Animosity of the Gods compatibility (5x5 matrix in `animosity.json`) and unlock the
  corresponding Mark Armory. A unit's `locked_mark` (if any) is fixed; otherwise a Mark can be
  purchased.
- **Unit types (additive, per Jump Pack Infantry precedent):** Bike, Jetbike, Jump Pack
  Infantry, Monstrous Infantry — all granted by armory equipment items via
  `effect.adds_unit_types` + matching `effect.stat_mod`/`grants_abilities`.
- **Legion keywords:** Alpha Legion / Black Legion / Iron Warriors / Night Lords / Word Bearers —
  granted via the 5 Legacies (`armory_key` unlocks that Legion's dedicated Armory sheet).
- **Other:** Cultist, Daemon, Priest (gates "Demagogue", Dark Apostle-only), Lieutenant (gates
  "Cursed blade"), Sorcerer (gates "Familiar"), Warpsmith (gates Iron Warriors melee weapons).

### 2. Wargear gating

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| General Armory ᵀ items | — | non-Terminator models can't take | `armour_compat: ["Terminator"]` |
| Mark Armory (Khorne/Nurgle/Slaanesh/Tzeentch) | matching Mark | — | unlocked when Mark purchased/locked |
| Manreaper, Twin plague spewer | Cataphractii (Nurgle armory) | — | `requires_keywords` |
| Legion Armory (5x) | matching Legacy selected | — | `armory_key` on legacy |
| Demagogue | Priest | — | Dark Apostles only |
| Cursed blade | Lieutenant | — | |
| Familiar | Sorcerer | — | |
| Axe of the Forgemaster / Nest of Mechaserpents | Warpsmith | — | Iron Warriors armory |
| Chaos Space Marine bike / Steed of Slaanesh / Juggernaut of Khorne / Disc of Tzeentch | Infantry | — | mount upgrades, all `requires_keywords: ["Infantry"]` |

### 3. Points model

- Weapons/equipment: `p_unit` (regular models) vs `p_char` (Character models) — standard split,
  `null` = not purchasable for that model class, `-` in sheet.
- Veteran abilities (Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank, Tank
  hunter, Terrain expert, Vanguard): `p_unit` (per model) + `p_veh` (per Wound/Hull point for
  Monstrous Creatures & Vehicles); Infiltrator/Vanguard have no `p_veh` (not applicable to
  vehicles).
- Vehicle upgrades (Additional armor, Blasphemous Rune, etc.): `p_unit` only, `category:
  'vehicle'`.
- Daemon weapons: `p_char` only (Daemon weapon/Greater Daemon weapon equipment items cost 0 —
  the cost is in the daemon-weapon ability itself).

### 4. Army rules / marks / special rules

- **Animosity of the Gods**: the army's most expensive HQ's Mark determines which other
  marks/units may join it (5x5 matrix, `animosity.json`). Suspended army-wide while Black
  Crusade is active.
- **Black Crusade** (trait): one designated HQ ("Black Crusade champion") bears all 4 Chaos god
  marks simultaneously; champion must not have `locked_mark`. Validated in `validators.ts`
  (exactly 1 champion required, Animosity skipped while active).
- **Marks count as veteran abilities** for all units (per `rules_csm_army.md`).
- Favored units / Summoning — see existing engine docs, not re-audited this pass.

### 5. Archetypes / Legacies / Traits

- 13 Archetypes, 5 Legacies (Arch Traitor→Word Bearers Armory, Hydra→Alpha Legion Armory, Iron
  Lord→Iron Warriors Armory, Night Haunter→Night Lords Armory, Warmaster→Black Legion Armory),
  17 Traits. Selection limits: 0-1 Archetype, 0-1 Legacy, 0-2 Traits (some traits via
  `enables_second_legacy`). All names confirmed 1:1 against the .ods "Army Customisation" sheet.

### 6. Findings this pass (all fixed v0.61, build ✓, local NOT pushed)

- **Malicious Volley** (trait): now correctly excludes "Heavy" weapons from Deflagrate(5+)
  (`resolver.ts` weapon-ability matcher).
- **Chaos Space Marine bike**: `effect` now includes `stat_mod` M+6/T+1/W+1 (was missing,
  desc-only). Still missing: free Combi-bolter grant — no `effect.grants_weapons` mechanism
  exists yet (`ki-csm-bike-combibolter-grant-unmodelled-01`).
- **Daemonic stature**: `effect` now grants Deep Strike ability (was missing).
- **Juggernaut of Khorne**: `effect` now includes `stat_mod` M+6/T+1/W+2/A+1 (was missing).
- **Steed of Slaanesh**: `effect` now includes `stat_mod` M+6/T+1/W+1/A+1 (was missing).
- **Disc of Tzeentch**: `effect` now includes `stat_mod` M+6/W+1/A+1 (was missing); also fixed
  `adds_unit_types` from "Jet Bike" → "Jetbike" (matches own `desc` and Custodes-confirmed
  canonical spelling).

All 23 general-armory weapons, all general/Mark/Legion equipment, daemon weapons, veteran
abilities, and vehicle upgrades cross-checked 1:1 against the .ods — no further discrepancies
found in the Armory sections.

### 7. Open / next

- Unit-by-unit audit of all 62 CSM datasheets — not started, multi-session.
- Index "Army specific Rules" (Animosity, Favored Units, Mark of Chaos Undivided, the 4 Mark
  grants, Summoning) cross-checked against the engine — all correctly implemented
  (`resolver.ts`, `special-abilities.ts`, `validators.ts`). One real bug found: Favored Units'
  +1 Attack was being applied to units with no squad leader (no armory/champion armory access,
  e.g. Poxwalkers) — fixed v0.62 (gate added in `codex_csm/resolver.ts`).
- "Disciplines of Chaos" (6 disciplines incl. Cult Powers) — matches `psychic/disciplines.json`
  1:1, no fixes needed. "General psychic disciplines" sheet is just a hyperlink, no content to
  audit.
- Daemonkin tables (4 gods) — Khorne/Slaanesh/Nurgle match `psychic/daemonkin.json`; Tzeentch
  "Cabbalistic Rituals" had 2 missing + 2 mis-mapped effects, fixed v0.62. Added missing
  Khorne/Slaanesh description paragraphs (Nurgle's was already present).
- Infernal Pacts (6) and Prayers to the Dark Gods (10, incl. "Lower prayers") — match
  `psychic/pacts.json` / `psychic/prayers.json` 1:1, no fixes needed.
- Open KI: `ki-csm-poxwalkers-slavesofdarkness-text-01` (Poxwalkers' "Slaves of Darkness" ability
  text needs verification against the .ods — extractor only returns "Mark of Nurgle").

**"Lo demás" complete** — all non-unit CSM sheets audited. Next: unit-by-unit audit of the 62
datasheets.
