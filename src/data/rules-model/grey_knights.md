# Rules-model digest — Grey Knights

> Built from scratch (no prior digest existed) on 2026-06-08, per user's "hazlo, sé detallista"
> — Grey Knights had NO `rules-model/grey_knights.md`, unlike CSM/CD/SM/Inquisition (the four
> factions already migrated in Fase 4). This digest is the prerequisite for any future Fase 4
> migration of Grey Knights.

**Sources read to build this digest** (2026-06-08):
- `Informacion/Custom40k Core Rules.txt` (full, 1739 lines)
- `Informacion/Custom40k Missions.txt` (full, 230 lines)
- `data/source/Grey Knights ENG/Index.html` (roster + 6 army-wide Special Rules)
- `data/source/Grey Knights ENG/Armory.html` (full ARMORY/EQUIPMENT/VETERAN ABILITIES/VEHICLE EQUIPMENT tables)
- `data/source/Grey Knights ENG/Army Customisation.html` (full — Archetypes/Legacies, no Traits section)
- `data/source/Grey Knights ENG/Grey Knight psychic discipline.html` (Sanctity + Dominus disciplines + 8 Legacy powers)
- `data/source/Grey Knights ENG/Prayers.html` (Litanies of Purity + Prayers of Battle)
- `data/source/Grey Knights ENG/Strike Squad.html`, `Terminator Squad.html` (Troops datasheets, sampled for keyword/ability vocabulary)
- `data/parsed/grey_knights/` production data (22 unit `.ts` files across 7 slots, `armory/general.json`, `psychic/{disciplines,prayers}.json`, `archetypes.json`) — cross-checked against HTML per GOLDEN RULE (production = canonical where it diverges in semantics)

---

## Faction: Grey Knights

### 1. Keyword vocabulary

- **Armour types:** ONLY **Terminator** exists as a populated `armourKeyword` value (7 units:
  Ancient/Apothecary/Captain/Ghost Terminator Squad/Librarian/Paladin Squad/Terminator Squad —
  grepped `"armourKeyword": "Terminator"` across all 22 production unit files). **No
  Cataphractii/Gravis/Power-armour-as-keyword analogue exists** — confirmed by grepping for any
  other `armourKeyword` value: zero hits. This makes GK's armour-subset gate the SAME shape as
  Inquisition's (a single binary ᵀ gate, no ᴳ/ᵀ split the way SM has — see
  [[project_inquisition_codex_migration]]) — a THIRD faction landing on this "simplest armour
  gate" shape.
- **Sub-factions / Marks:** **NONE.** Grey Knights have no Mark-equivalent axis (no Ordo either,
  unlike Inquisition — GK is a single unified Chapter, the "Demon Hunters" army-wide rule grants
  access to Inquisition units but does not gate GK's OWN roster by any allegiance choice).
- **Unit types** (from grepping `"unit_type"` across all 22 units):
  - `Infantry` (6), `Character Model, Infantry` (6), `Vehicle` (5), `Monstrous Creature` (2),
    `Walker` (1, Dreadnought), `Flyer, Vehicle` (1, Stormraven Gunship), `Infantry, Jump Pack
    Infantry` (1, **Interceptor Squad — STATIC type**, not mutated via `OptionEffect.
    set_unit_type`; the "Personal teleporter"/"Teleporter" armory options that grant `Jump pack`
    + `+6" M` are pure ability/stat-mod GRANTS on otherwise-static-type units, mirroring the SM
    "Jump pack RULE vs Jump Pack Infantry TYPE" distinction documented in
    [[project_sm_digest]] §Fase 2 — confirms GK was correctly excluded from `ki-jumppack-
    otherfactions-01`'s "deferred" list because its one Jump-Pack-typed unit was already
    correctly tagged static).
  - No `datasheet`-axis keywords: grepped `"keywords": []` → 22/22 empty. FIFTH confirmation
    (CSM=6 populated, CD/SM/Inquisition/now GK=0) that a populated datasheet axis is the
    per-faction EXCEPTION, not the rule.
- **Other faction-flavour vocabulary** (textual, not keyword-gated): "Nemesis" weapons (force
  weapon/warding stave/daemon hammer/greatweapon — all carry `Force weapon` + `Shield breaker(-1)`
  abilities, the signature GK melee-weapon family), "Brotherhood of Psykers" (the GK-specific
  Psyker-unit ability replacing the generic `Psyker` tag on squads), "Dreadknight force field"
  (named 4+ invuln on Monstrous-Creature units).

### 2. Wargear gating (replaces term_compat / gravis_compat / category)

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| ᵀ-glyph items (60 of 65 armory entries — `"armour_compat": ["Terminator"]`) | `armourKeyword: "Terminator"` | — | Standard binary gate; production data ALREADY uses the target `armour_compat: string[]` keyword-array shape (not a `term_compat` boolean) — see §6 finding |
| Non-ᵀ items (5: Bound blade/Cleansing flame/Hunter-killer missile/Master-crafted armor/Warden of the Blade/Radiant Champion) | none | — | Universally available (subject to per-item "Only for X" prose restrictions, not keyword-gated) |
| "Only for Captains" (Titansword), "Only for Librarians" (Familiar/Librum Arcana), "Only for Apothecaries" (Selfless healer), "Only for Ancients" (Brotherhood banner), "Only for Brotherhood-Champion" (Radiant Champion/Warden of the Blade), "Only for infantry" (Personal teleporter) | — | — | Prose-only unit-restrictions, NOT keyword-derived — mirrors CSM/SM/Inquisition's "Only for X" pattern (engine enforces via free-text match, not a keyword axis) |
| Veteran Abilities (8: Counter-attack/Favoured enemy/Furious charge/Infiltrator/Outflank/Tank hunter/Terrain expert/Vanguard) | `has_veteran_abilities` (unit flag, 15/22 units) | — | **GAP — see §6**: production `armory/general.json` carries NONE of these with `category: 'veteran'` (engine requires this tag to surface them in `ArmoryModal`'s veteran tab and price them via `p_veh`) |
| Vehicle Equipment (5 named in HTML: Additional armor/Hunter-killer missile/Improved targeting/Jammer/Smoke Launcher — plus Blessed/Machine spirit/Ordained hull/Psy-ammunition/Truesilver armor also living in the same HTML block, 10 total) | `is_vehicle` (unit flag, 7/22 units) | — | **Same GAP — see §6**: none carry `category: 'vehicle'` in production |

### 3. Points model

- **Standard equipment**: `p_unit` (flat per-model) / `p_char` (flat character override) — exactly
  mirrors CSM/SM/Inquisition's `getItemPts` shape. No `× item.size` multiplier.
- **HTML's "Veteran Abilities" table has TWO price columns**: "POINTS" and "POINTS MONSTROUS
  CREATURES & VEHICLES" — structurally identical to Inquisition's "per model / per Wound-or-
  Hull-point" footnote (verbatim row 67: *"Point costs must be paid for every model in the unit
  and per Wound or Hull point"*). This is the SAME richer pricing tier
  [[project_space_marines_codex_migration]] found CD lacks entirely — GK's HTML clearly intends
  to sit on the SM/Inquisition side of that inverse-pair (a THIRD faction confirming the split is
  real game design, not an SM one-off).
- **BUT the production data does NOT mirror this column split** — see §6: the "Monstrous
  Creatures & Vehicles" column got mapped into the existing `p_char` field (e.g. Counter-attack:
  HTML POINTS=1/M&V=2 → JSON `p_unit:1, p_char:2`), and the dedicated `p_veh` field (which the
  engine schema supports — `src/types/data.ts:220`) is populated NOWHERE in GK's armory. This
  means the engine's `ArmoryModal` veteran-pricing code path (`p_veh × woundCount × item.size`,
  `ArmoryModal.tsx:318-321`) cannot currently price these items correctly for GK vehicles/monsters
  — they would either be invisible (no `category` tag → `regular` bucket only, gated by `!isVehicle`
  display logic) or mispriced as flat character costs.
- **Vehicle Equipment**: HTML shows a single "POINTS" column (no per-size multiplier note) — the
  simpler CD-style flat-vehicle-equipment shape, NOT Inquisition's `× item.size` shape. (Note:
  this is a DIFFERENT axis from the veteran-pricing finding above — vehicle equipment itself has
  one clean price; it's specifically the *veteran-on-vehicle/monster* pricing tier that's
  currently unmapped.)

### 4. Army rules / marks / special rules

Six verbatim army-wide Special Rules from `Index.html`:

1. **Demon Hunters**: "The army has access to units from the Inquisition codex (Inquisitors must
   select 'Ordo Malleus'). Additionally, the army has access to Assassins." — the native-allied-
   access rule; cross-references [[project_alien_hunters_fix]] (`ki-gk-inquisition-allied-badge-01`,
   fixed) and [[project_inquisition_audit]] (Fase A `intrinsic_allies` mechanism).
2. **Nemesis warding stave**: "If at least one model in the unit is equipped with a Nemesis
   warding stave, all models in the unit gain the 'Parry' ability." — a unit-wide grant triggered
   by a single model's wargear choice (mirrors CSM banner-type "if one model has X, unit gains Y"
   patterns).
3. **Psykers and Force weapons**: "If every model in the unit can manifest psychic powers, the
   unit's controller must choose one model that will be the only one allowed to use psychic
   powers and Force weapons (and risk Perils of the Warp) for the rest of the game." — the core
   GK psyker-squad mechanic; structurally a "pick-one-caster" cap, distinct from Inquisition's
   simple `is_psyker` per-unit grant.
4. **Shrouding**: "While at 12'' or more from the bearer, all enemy ranged attacks against the
   model gain the (cumulative) 'Deflect' ability." — universal GK defensive rule, present on
   nearly every infantry/monster unit's ability line.
5. **They Shall Know No Fear**: standard SM-family auto-regroup rule (verbatim matches the
   Astartes-wide rule — GK are Space Marines, inherit this).
6. **Teleport strike**: "For every 2500 points in the army, it gains 3 'Teleport tokens'. ... a
   unit can be redeployed using the rules for Deep Strike..." — army-wide Deep-Strike-resource
   rule, the in-fiction basis for "Personal teleporter"/"Teleporter" armory grants (§1).
7. **True Grit**: "All ranged weapons of the model are treated as Assault weapons. Additionally,
   if the model made a ranged AND melee attack in the same activation, it gains +1 Attack until
   the end of the Fight phase." — present on Strike/Terminator Squad ability lines.

**Psyker rule** (verbatim, datasheet-level — appears on EVERY unit carrying `is_psyker: true`,
21/22 units — the lone exception is Ghost Terminator Squad, `is_psyker: false`):
*"Psyker: The [unit/model] can cast 1 power and deny 1 power per battle round. It/He knows Smite
and 1 power from a chosen discipline."* — GK is overwhelmingly psyker-saturated (95% of the
roster), the OPPOSITE shape from Inquisition (3/13 = 23%) — worth remembering as a structural
contrast when reasoning about `is_psyker`-axis density across factions.

**Brotherhood of Psykers**: a named ability appearing on GK Infantry squads (Strike/Terminator)
— functions as the unit-wide carrier of the Psyker rule for multi-model units (vs. the bare
`Psyker:` line on single-model Characters/Monsters). Worth flagging: this is GK's own-named
wrapper, NOT a generic `is_psyker` synonym — both ultimately drive the same `is_psyker` flag in
production but the SOURCE TEXT differs (named ability vs. raw rule line), a textual nuance an
audit must not flatten.

**Psychic disciplines**: GK has its OWN dedicated discipline pair — **Sanctity** (Banishment/
Cleanse Soul/Sanctuary/Astral Aim/Hammerhand/Destruction) and **Dominus** (Warp Shaping/Empyric
Amplification/Ghostly Bonds/Gate/Psy-steel Armor/Vortex) — 12 named powers, living in
`psychic/disciplines.json` (anti-dup: stays there, not migrated into codex.ts per the established
[[project_inquisition_codex_migration]] precedent for named powers).

**Prayers** (NOT psychic powers — a separate "Litanies/Prayers" system, 8 named entries across
two groups: **Litanies of Purity** [Intonement for Guidance/Invocation of Focus/Litany of
Expulsion/Refrain of Convergence/Words of Power] and **Prayers of Battle** [Catechism of Fire/
Focus Recitation/Litany of Faith/Litany of Hate/Mantra of Strength]) — living in
`psychic/prayers.json`. **OPEN QUESTION for §6**: need to confirm which units/keyword grants
access to Prayers vs Psychic disciplines (likely Chaplain-equivalent — GK datasheets sampled so
far don't show a "Prayers" access line; needs a wider unit sample or user confirmation).

### 5. Archetypes / Legacies / Traits

**2 Archetypes** (both simple AOP-shuffle, mirrors CSM/SM "Troops↔Elite swap" archetype shape):
- **Chamber of Purity**: Purifier Squads → Troops; all other Troops → Elite.
- **Hall of Champions**: Paladin Squads → Troops; all other Troops → Elite.

**8 Legacies** — uniformly the SIMPLEST legacy shape catalogued of any faction: each one grants
"All Psykers know the '<Named Power>' psychic power in addition" — a single bonus-power grant,
zero armory/discipline-access complexity (contrast CSM's 5 richer legacies with `armory_key`
cross-refs, all of which are `null` here per `archetypes.json`):
Blades of Victory→Inescapable Pursuit / Exactors→Purge Soul / Prescient Brethren→Fatal
Precognition / Preservers→Aegis Eternal / Rapiers→Symphonic Strike / Silver Blades→Temporal
Accuracy / Swordbearers→Empyric Lodestone / Wardmakers→Projection of Purity. (All 8 named powers
verified present in `Grey Knight psychic discipline.html`'s dedicated "Legacy" row-group — 12
Sanctity/Dominus core powers + 8 Legacy bonus powers = 20 total named GK powers.)

**Traits: CONFIRMED ABSENT.** `Army Customisation.html` row 3 states the selection budget as
*"You may select up to the following: 0-1 Archetype, 0-1 Legacy"* — no Trait slot offered, and
no "TRAITS" section exists in the HTML (only ARCHETYPES + LEGACIES). Production `archetypes.json`
confirms: `"traits": []`. **Same confirmed-absence shape as Inquisition** — but unlike
Inquisition's "missing Army Customisation tab entirely," GK genuinely HAS the tab, it simply
offers no Traits within it. A finer-grained absence than Inquisition's — worth distinguishing in
any future Paso 4 write-up: "tab present but category empty" ≠ "tab absent."

### 6. Open questions / discrepancies found

1. **CONFIRMED DATA GAP — Veteran/Vehicle armory items untagged** (candidate for a new known
   issue, e.g. `ki-gk-vetvehcategory-01`): GK's `armory/general.json` carries the 8 Veteran
   Abilities + 10 Vehicle Equipment items as plain `equipment[]` entries with NO `category:
   'veteran'|'vehicle'` tag and NO `p_veh` value populated anywhere in the file (grepped
   `"p_veh"` → 0 hits; grepped `"category"` → 0 hits). The engine's `ArmoryModal`/`UnitCard`/
   `validators` code paths (`ArmoryModal.tsx:262-266,318-327`, `validators.ts:365,384,1126`)
   ALL key off `item.category` to: (a) route items into the veteran/vehicle display tabs, (b)
   gate vehicle-only items to `isVehicle` units, (c) compute `p_veh × woundCount × item.size`
   pricing for veteran-on-vehicle/monster purchases, and (d) enforce the veteran-ability cap
   validators. Without the tag, these 18 items currently fall into the generic `regular` bucket
   — likely showing in the wrong tab and/or pricing incorrectly for GK's 7 vehicles + 8
   `has_veteran_abilities` non-character units. **This is structurally the EXACT same class of
   bug Inquisition had pre-v0.56** ("were misfiled in weapons[], now correctly tagged" — see
   [[project_inquisition_codex_migration]] Paso 5 entry for the Inquisition-side fix pattern) —
   GK appears to be carrying the SAME unaudited gap Inquisition had before its v0.56 fix pass.
   **Recommend flagging to the user before any GK Fase 4 migration** — this should likely be
   fixed in production data FIRST (mirroring the Inquisition fix), the same "fix data, then
   migrate" order CD/SM/Inquisition all followed.
2. **Prayers access — RESOLVED** (§4): grounded directly in `Chaplain.html` (2026-06-08, user
   confirmed GK has a Chaplain). The gate is the named ability **"Faithful"** (verbatim: *"The
   model can recite 1 prayer per turn. A prayer is successfully recited on a roll of 3+. If a
   prayer fails to be recited, it can not be attempted again by the same model in this battle
   round. The model knows all prayers from the Prayer list."*) — a textual datasheet-level grant,
   NOT keyword-derived (mirrors the `is_psyker`/Psyker-rule shape exactly: named ability → grants
   access to a named pool). The Chaplain can additionally be upgraded to **"Master of Sanctity"**
   (+15 pts, one per army — *"The model can recite 1 additional prayer per turn"*, a stacking
   modifier on the same Faithful grant, not a separate access route). Both abilities verified
   present on the Chaplain datasheet alongside `Brotherhood of Psykers`/`Psyker` — i.e. the
   Chaplain is BOTH a Psyker (disciplines) AND a Faithful model (prayers), the two systems are
   independent and stack on the same unit. "The Prayer list" in the verbatim text reads as a
   single unified pool — does not itself distinguish Litanies of Purity vs Prayers of Battle, so
   (pending nothing further from the user) treat both `prayers.json` groups as the one list a
   Faithful model draws from.
3. **`armour_compat: string[]` vs `term_compat: boolean`** — GK's production armory ALREADY uses
   the target keyword-ARRAY shape (`"armour_compat": ["Terminator"]`) rather than the older
   `term_compat: true/false` boolean flag that CSM/SM/CD/Inquisition's pre-migration data used.
   This is GOOD NEWS for any future keyword-engine refactor (the "Modelo de datos objetivo:
   KEYWORDS" decision, 2026-06-03) — GK's armory data is structurally AHEAD of the other four
   already-migrated factions on this specific axis. Worth noting as a positive precedent, and
   worth checking whether `keywords.ts`'s shared `isTerminatorArmourName`/`modelRestrictsToTerm
   Subset` primitives already handle the array shape or would need a small adapter.
4. **Roster cross-check**: `Index.html` roster (HQ 5/Troops 2/Elite 5/Fast Attack 1/Heavy Support
   5/Transports 2/Fortifications 0/Flyers 1 = 21 named units across 7 populated slots, +1 row
   gap noted in summary) vs. production `units/` (22 `.ts` files across the SAME 7 slots: HQ 5/
   Troops 2/Elites 6/Fast Attack 1/Heavy Support 5/Dedicated Transport 2/Flyers 1). The +1 in
   Elites is **Dreadnought** — present in production, and re-confirmed present in `Index.html`'s
   roster table (a unit the initial roster-read summary undercounted by one row). **Zero actual
   drift** — clean roster match, the SAME "free audit, clean run" outcome SM/Inquisition had.

### 7. "Lo demás" pass (2026-06-13)

- **Index "Special rules"**: re-read raw `Index.html` (R12-R20) — all 7 verbatim rules (Demon
  Hunters, Nemesis warding stave, Psykers and Force weapons, Shrouding, They Shall Know No Fear,
  Teleport strike, True Grit) confirmed present and accounted for in
  `codex_grey_knights/special-abilities.ts` §4. No gaps.
- **"Grey Knight psychic discipline"** (Sanctity 6 + Dominus 6 = 12 powers, plus a separate
  "Legacy" row-group with 8 bonus powers) — Sanctity/Dominus 1:1 match vs `psychic/disciplines.json`.
  **Found and fixed a doc-only inaccuracy**: `special-abilities.ts` claimed all 20 named powers
  (12 + 8) live in `disciplines.json`, but the 8 Legacy bonus powers were never in that file —
  they're correctly implemented (verified 1:1 vs the .ods, e.g. Inescapable Pursuit = "+3" charge
  range") in `engine/legacies/grey_knights.ts` (`GK_LEGACY_POWER_DETAILS`), a different file. No
  functional bug (the feature works), just a misleading anti-duplication comment — corrected to
  point at the right files. Build ✓, no changelog (internal doc comment only).
- **"Prayers"** (Litanies of Purity 5 + Prayers of Battle 5 = 10 entries) — 1:1 match vs
  `psychic/prayers.json`. Also corrected a stale "8 named Prayers" count in
  `special-abilities.ts` to the correct "10 (5+5)". "General psychic disciplines" sheet is just a
  link, as usual.

**GK "lo demás" complete** — Index, psychic disciplines/legacy powers and prayers all re-audited.
Two doc-comment corrections made (no functional/data changes), build ✓, local NOT pushed.

**Addendum (2026-06-13, found during the IG pass) — real fix v0.65**: while wiring up IG's
Preacher prayers, checked GK's Chaplain (HQ) for the same "Faithful" pattern. Its ability text
already says "Faithful: ... Knows all Prayers", same as the SM Chaplain (which has
`is_priest:true`), but GK's Chaplain was missing the flag — so its Prayers tab never appeared
despite `psychic/prayers.json` (10 entries) being loaded correctly. Added `"is_priest": true` to
`data/parsed/grey_knights/units/hq/chaplain.ts`. Build ✓, changelog v0.65.
