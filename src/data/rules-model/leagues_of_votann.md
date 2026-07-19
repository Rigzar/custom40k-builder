# Rules-model digest — Leagues of Votann

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Votann was 🔴
> (no prior digest). Prerequisite for its Fase 4 migration. Datasheet spot-check done (Hearthkyn
> Warriors + Hekaton Land Fortress vs production — both match exactly).

**Sources read** (2026-06-11, ALL `.ods` structural sheets read + 2 datasheet spot-checks):
- `Informacion/Leagues of Votann.ods` — Index, Army Customisation, Armory, League Armory,
  Skeinwrought discipline, + 17 unit datasheets (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/leagues_of_votann/` production: `units.json` (18 units + `slot_to_units`),
  `armory/general.json` (27 equipment items), `armory/legion_league.json`, `archetypes.json`
  (4 archetypes / 5 legacies / 16 traits)
- `src/data/loaders.ts:leagues_of_votann` (units + general + archetypes + League armory; NO psychic)

---

## Faction: Leagues of Votann

### 1. Keyword vocabulary

- **Armour types: Exo-armor gate EXISTS** (a populated armour axis — like Orks/Custodes/CSM). The
  `.ods` Armory states "Models in Exo-armor can only receive equipment marked with ᵀ", and
  production encodes this via the **ᴱ glyph** suffixed to 14/27 armory item names (e.g. "Ancestor
  relicᴱ", "Darkstar alloyᴱ", "RAM shieldᴱ"). CAVEAT (§6.2): glyph-encoded (ᴱ in the name), NOT an
  `armourKeyword` field NOR `term_compat` (both absent: 0 each). Exo-armor is itself a purchasable
  item (2+ Sv / 5+inv / Massive/Shock Troops/Unyielding, infantry only). A glyph-encoded armour
  axis (same family as Orks Mega-armor ᴹ-glyph / CSM mark glyphs).
- **Marks: NONE.** No `locked_mark`. (Leagues are a Legacy axis, §5, not a base keyword.)
- **Datasheet keywords[]: EMPTY.** All 18 units `keywords: []`.
- **Unit types** (production, 18 units): `Character Model, Infantry` (6), `Infantry` (6), `Vehicle`
  (4), `Jetbike` (1, Hernkyn Pioneers), `Infantry, Sniper: ...` (1, Hernkyn Yaegirs — a unit_type
  ARTIFACT, an ability sentence leaked into the type field; §6.3).
- **Net:** populated armour axis (Exo-armor, ᴱ glyph); mark/faction/datasheet empty.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| ᴱ-glyph items (14 of 27) | Exo-armor (ᴱ name-glyph) | ".ods: Models in Exo-armor can only receive equipment marked with ᵀ" — production uses the ᴱ glyph. Plus a "Weavefield crest (Exo)" variant "Exo-armor only" |
| "Only for infantry" prose | free-text | Exo-armor / Skimmer bike / Skimmer-type options |
| Vehicle Equipment (7: Accelerated engine/Additional void armor/Ancestor's judgement warhead/Improved targeting scanner/Jammer/Refined power cores/Smoke Launcher) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/Aeldari/GSC/Orks/Tyranids |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER"). Mirrors the cross-
  faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier**.

### 4. Army rules / special rules

- **Eye of the Ancestors** (signature mechanic, Index): a Judgement-token economy — "each time a
  friendly unit is removed, place a Judgement token by the enemy unit that caused the last wound
  (max 2). Friendly units attacking a target with ≥1 token gain cumulative benefits: 1 token =
  re-roll 1 hit/activation; 2 tokens = re-roll 1 wound/activation." Several traits feed/exploit
  Judgement tokens (Grudgebearers, Quick to Judge, Vengeful, Brutal Efficiency).
- **Steady Advance** (Index): "The unit can never receive an 'Advance' order and gains 'Move through
  cover'." (The Frontier Momentum trait re-enables Advance.)
- **Void armor** (Index): "Enemy attacks reduce their AT and AP value by -1 (min 0 each)." Army-wide
  defensive rule.
- **Psyker** (1 unit `is_psyker`: Grimnyr): the `.ods` has a "Skeinwrought discipline" (19 rows).
  **⚠ NOT wired into the loader — see §6.4** (same gap class as IG/Eldar/Harlequins/GSC/Orks/
  Tyranids).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 4 archetypes /
5 legacies / 16 traits — matches the `.ods` exactly.

**4 Archetypes**: Demiurg (cross-faction — Battle Brothers with Tau; must field/be an Allied Tau
detachment), Einhyr Guard (Einhyr Hearthguard→Troops; must take a Kâhl/High Kâhl HQ; Hearthkyn→
Elite), Hearthfyre Arsenal (a free Brôkhyr Iron-master per 500 pts; Hearthkyn don't count to 25%),
Persecution Prospect (Hernkyn Yaegirs→Troops; non-Infiltrate <12"M units must start embarked).

**5 Legacies** — each = one League, granting that League's Armory (loaded as the 'League' legacy):
League of Explorers→Trans-Hyperain Alliance / League of Leagues→Greater Thurian League / League of
Magnates→Ymir Conglomerate / League of Sentinels→Urani-Surtr Regulates / League of Warriors→Kronus
Hegemony.

**16 Traits** (3-column pricing; many Judgement-token-themed): Brutal Efficiency / Dour Survivalists
/ Frontier Momentum / Fury from the Delve / Grudgebearers / Honor in Toil / HUNTR's Mark / Ironskein
/ Martial Cloneskeins / Master Salvagers / Pan-Spectral Visualizers / Quick to Judge / Ranger
Outriders / Trivârg Cyber Implants / Vengeful / Voidship Specialists. Canonical in `archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-leagues-of-votann-vetvehcategory-01`): the 7 Vehicle
   Equipment items (idx 20-26) were `category: none`; tagged `category: 'vehicle'`. POINTS already
   in `p_unit` (no value-move). NO veteran-side fix: Votann have no veteran tier (0
   `has_veteran_abilities`).
2. **Exo-armor gated via ᴱ name-glyph, not `armourKeyword`/`term_compat`** (keyword-seam note, not a
   fix): the armour axis is real (Exo-armor, 14 ᴱ-items + the `.ods` rule) but production keys it
   via the ᴱ glyph suffix. Same pre-keyword-seam family as Orks Mega-armor ᴹ-glyph / CSM mark-glyphs
   ([[project_pipeline_migration]]). Left as-is (cross-faction keyword-engine refactor out of scope).
3. **"Hernkyn Yaegirs" `unit_type` artifact**: production has `unit_type: "Infantry, Sniper: Models
   with a Magna-coil rifle receive a +1 bonus to their BS value."` (an ability sentence leaked into
   the type; should be "Infantry"). Cosmetic, `ki-unittype-residuals-01` family.
4. **Skeinwrought psychic discipline wiring — RESOLVED v0.60** (`ki-leagues-of-votann-psychic-unwired-01`,
   FIXED): the "Skeinwrought discipline" (19 rows) is now in `data/parsed/leagues_of_votann/psychic/
   disciplines.json` and `loaders.ts:leagues_of_votann` imports it (`{ disciplines: discs }`). The
   Grimnyr's Powers tab is populated. This entry was written 2026-06-11 (before the v0.60 batch
   fix); superseded.
5. **Roster cross-check**: production 18 units / 6 populated slots (HQ 3/Troops 2/Elites 6/Fast
   Attack 2/Heavy Support 3/Dedicated Transport 2; Fortifications 0, Flyers 0). No phantoms; matches
   the Index roster.

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: §4 (Eye of the Ancestors, Steady Advance, Void armor) was already built
   directly from the `.ods` during the Fase 4 digest — [[feedback_lo_demas_ods_not_html]], no
   re-derivation needed. No gaps.
2. **Psychic disciplines / prayers**: no "Faithful"/prayers sheet in the `.ods`. The Skeinwrought
   discipline gap flagged in §6.4 was ALREADY RESOLVED by the v0.60 batch fix
   (`data/parsed/leagues_of_votann/psychic/disciplines.json` exists, wired in `loaders.ts`, KI status
   `fixed`). Updated §6.4 to reflect the resolved state (was stale, written before v0.60).

**Votann "lo demás" complete** — Index already grounded in .ods, psychic discipline already wired
(stale doc corrected). Doc-only, no build required.

---

### 8. Codex 1.01 re-audit (2026-07-19) — `Informacion/Leagues of Votann 1.01.ods`

Full field-by-field pass over all 22 sheets (Index, Army Customisation, Armory, League Armory,
Skeinwrought discipline, 18 datasheets). Every unit's stats, points, min/max, equipped_with, weapon
profiles and option groups were compared against production; Army Customisation (4 archetypes,
5 legacies, 17 traits) and the League Armory matched 1:1 with no changes.

**Applied — the author''s own 1.01 change list:**
- `Grudgepyre` and `Interface Echo` Cast value 5 → **6**.
- `Interface Echo` effect now reads "...a single die roll **of their own dice**...".
- Cthonian Beserks'' **Concussion maul** AT(1) → **AT(2)**.
- Armory **Concussion gauntletᴱ** and **Concussion hammerᴱ**: `Unwieldy` removed. Armory-only — the
  *datasheet* copies (Hearthkyn Warriors, Ironkin Steeljacks, Einhyr Hearthguard, Cthonian Beserks)
  still carry Unwieldy in the .ods and were left as-is.
- Armory **Mass gauntletᴱ** and **Mass hammerᴱ** removed (the equipment item "Mass driver
  accelerators" is unrelated and stays).

**Applied — found by the audit, NOT in the author''s change list** (the Wracks/Taurox pattern again):
- Hernkyn Yaegirs, "All remaining models may swap their Bolt shotguns → Bolt revolver and Plasma
  knife": **0 → +1 point/model**.
- Armory was missing two weapon rows the .ods lists with a `-` cost (reference profiles for grants):
  **Ancestor''s jugdement warhead** (120", Heavy 1, S8, AP-3, D2, Ammo(1)/AT(2)) and **Magna-coil
  autocannon** (24", Assault 2, S7, AP-2, D1, AT(1)). Added as non-purchasable.

**Open — raised with the author, not fixed in the app** (`ki-votann-warhead-grant-name-mismatch-01`):
the two grant descriptions name weapons that don''t match any weapon row — "Ancestor''s **judgement**
warhead" vs the row''s "**jugdement**", and Skimmer bike''s "Magna-coil **autogun**" vs the row''s
"Magna-coil **autocannon**". Correcting a weapon name is a rules fact, so production stays faithful
to the sheet until the author reconciles it.

Faction badge moved to green / version 1.01 (app + wiki).
