# Rules-model digest — Necrons

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Necrons was 🔴
> (no prior digest; `.ods` added by the user mid-session). Prerequisite for its Fase 4 migration.
> Datasheet spot-check done (Warriors + Monolith vs production — both match). THE LAST of the 19
> factions to be migrated.

**Sources read** (2026-06-11, ALL `.ods` structural sheets read + 2 datasheet spot-checks):
- `Informacion/Necrons ENG.ods` — Index, Army Customisation, Armory, Dynasty Armory, Powers of the
  Ctan, + 37 unit datasheets (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/necrons/` production: `units.json` (37 units + `slot_to_units`),
  `armory/general.json` (37 equipment items), `armory/legion_dynasty.json`, `archetypes.json`
  (4 archetypes / 6 legacies / 17 traits)
- `src/data/loaders.ts:necrons` (units + general + archetypes + Dynasty armory; NO psychic file)

---

## Faction: Necrons

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** No `armourKeyword`, 0 `term_compat`, 0 name-glyphs.
  Necron defence is the Sempiternal weave / Phase shifter / phase invuln items, not an armour
  keyword. No ᵀ/ᴹ/ᴱ/ᴵ gate.
- **Marks: NONE.** No `locked_mark`. (Dynasties are the Legacy axis, §5.)
- **Sub-factions encoded in `unit_type`, not `keywords[]`** (like Tau's Kroot): the Necron / Canoptek
  / Cryptek / Lord sub-types live inside the `unit_type` string (e.g. "Infantry, Necron", "Walker,
  Canoptek", "Character Model, Infantry, Cryptek, Necron"). The Canoptek Court archetype gates on
  `<Canoptek>`; several traits gate on `<Necron>`/`<Canoptek>`. `keywords[]` itself is EMPTY on all
  37 units.
- **Unit types**: very composite — "Infantry, Necron" (6), "Vehicle" (6), "Monstrous Creature" (4,
  C'tan Shards), "Jet Bike, ...Canoptek/Necron" (several), "Jump Pack Infantry, Necron", "Walker,
  Canoptek", etc. 11 vehicles.
- **Net:** armour/mark/datasheet `keywords[]` axes empty; the Necron/Canoptek sub-types live in
  `unit_type` (same encoding as Tau's Kroot).

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| General Armory items | `has_armory_access` | no `armour_compat`/`term_compat`/glyph |
| "Only for X" prose (Infantry / Lord / Cryptek) | free-text | e.g. Skorpekh body "Infantry only"; the Harbinger-of-X Cryptek upgrades; Lord-only relics |
| Vehicle Equipment (4: Additional armor/Improved targeting/Jammer/Smoke Launcher) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES section; 0 `has_veteran_abilities` units |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER"). Mirrors the cross-
  faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier**.

### 4. Army rules / special rules

- **Reanimation Protocols** (signature mechanic, Index): an RPoint (Reanimation Point) economy — the
  army gets 3 RPoints per 500 pts; in each Reinforcement phase units are allocated RPoints to heal
  lost wounds / revive slain models (roll 4+ per RPoint to restore a wound; retained on 3+, lost on
  1-2). Models killed by a weapon with ≥2× their Toughness can't use it. The defining Necron
  resilience mechanic. (The Index also lists an EXPERIMENTAL alternate version — §6.4.)
- **Gauss** (Index): "To wound rolls of 5+ against creatures always succeed; AT rolls of 5+ vs
  vehicles gain cumulative +1 AT and always inflict at least a Glancing Hit." Signature Necron
  weapon rule.
- **Tesla** (Index): "To hit rolls of 5+ always succeed + 2 additional automatic hits." (Shared with
  AdMech/Orks.)
- **Psyker** (4 units `is_psyker` — the C'tan Shards): the `.ods` has "Powers of the Ctan" (the
  C'tan power system). Wired into the loader; see §6.3 for a v0.69 model-assignment fix.

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 4 archetypes /
6 legacies / 17 traits — matches the `.ods` exactly.

**4 Archetypes**: Canoptek Court (only Crypteks as HQ, 2 per slot; <Canoptek> units gain Objective
Secured!), Destroyer Cult (roster restricted to Destroyer/Skorpekh/Canoptek/C'tan units; Skorpekh
Destroyers→Troops), Obeisance Phalanx (Lord/Overlord HQ; Lychguard/Triarch Praetorians→Troops, no
other Troops), Yngir (a C'tan Shard counts as HQ, +stats +85 pts + Time's Arrow; Pariahs→Troops).

**6 Legacies** — each = one Dynasty, granting that Dynasty's Armory (loaded as the 'Dynasty'
legacy): Channeling Solar Energies→Nephrekh / Extermination of all Life→Szarekhan / Industrial
Slaughter→Novokh / Secure Borders→Nihilakh / Starkillers→Mephrit / The Lord of the Storm→Sautekh.

**17 Traits** (3-column pricing; several `<Necron>`/`<Canoptek>`-gated + RPoint-themed): Arise
against Interlopers / Awakened by Murder / Eternal Conquerors / Immovable Phalanx / Interplanetary
Invasors / Isolationists / Masters of the Martial / Merciless Hunters / RAD-wreathed / Relentless
Expansionism / Solar Fury / Superior Artisans / The unmerciful Horde / Translocation Beams / Vassal
Dynasty (→"2nd Legacy") / Vengeful Stars / Warrior Nobles. Several have mutual-exclusion clauses
(Immovable Phalanx ⊗ Merciless Hunters; Relentless Expansionism ⊗ Translocation Beams). Canonical in
`archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-necrons-vetvehcategory-01`): the 4 Vehicle Equipment
   items (idx 33-36) were `category: none`; tagged `category: 'vehicle'`. POINTS already in `p_unit`
   (no value-move). NO veteran-side fix: Necrons have no veteran tier (0 `has_veteran_abilities`).
2. **Necron/Canoptek sub-factions in `unit_type`, not `keywords[]`**: like Tau's Kroot, the Necron/
   Canoptek/Cryptek/Lord sub-types are embedded in the `unit_type` string; archetypes/traits gate on
   `<Necron>`/`<Canoptek>`. A different encoding from Dark Eldar's keywords[] sub-factions — a
   candidate to promote into `keywords[]` in a future keyword-engine refactor.
3. **Powers of the C'tan — RESOLVED v0.60, model-assignment bug FIXED v0.69**
   (`ki-necrons-psychic-unwired-01`): the v0.60 batch extracted "Powers of the Ctan" (Form Matter,
   Transdimensional Manipulation, Time's Arrow) into `data/parsed/necrons/psychic/disciplines.json`
   (key "Powers") and wired it into `loaders.ts`. But `is_psyker: true` was on the **Pariahs**
   (anti-psyker "Psionic Abomination" unit) instead of the 4 C'tan Shard datasheets (which all carry
   the "Powers of the C'tan" ability). v0.69 moved `is_psyker: true` to C'tan Shard / C'tan Shard of
   the Deceiver / of the Dragon / of the Nightbringer, and set the Pariahs back to `false`. The
   Powers tab now shows correctly on the C'tan Shards.
4. **Experimental Reanimation Protocols** (note, not a gap): the Index sheet lists an EXPERIMENTAL
   alternate Reanimation Protocols rule ("undergoing playtesting, completely optional"). The digest
   documents the standard rule (§4) as canonical; the experimental variant is opt-in and not part of
   the migration.
5. **Roster cross-check**: production 37 units / 8 populated slots (HQ 5/Troops 3/Elites 14/Fast
   Attack 5/Heavy Support 5/Dedicated Transport 2/Fortifications 1/Flyers 2). Uses every slot. No
   phantoms; matches the Index roster (Elites is the big slot — 4 C'tan Shards + Canoptek constructs
   + Destroyers).

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: §4 (Reanimation Protocols, Gauss, Tesla) was already built directly
   from the `.ods` during the Fase 4 digest — [[feedback_lo_demas_ods_not_html]], no re-derivation
   needed. No gaps.
2. **Psychic disciplines / prayers**: §6.3 flagged `ki-necrons-psychic-unwired-01`. The v0.60 batch
   HAD extracted "Powers of the C'tan" into `disciplines.json` ("Powers") and wired it — but
   `is_psyker: true` was on the Pariahs (wrong unit, anti-psyker themed) instead of the 4 C'tan Shard
   datasheets that carry the "Powers of the C'tan" ability. NEW FIX v0.69: moved `is_psyker: true` to
   the 4 C'tan Shards, removed it from the Pariahs.

**Necrons "lo demás" complete** — Index already grounded in .ods; Powers of the C'tan now wired to
the correct model. Build ✓, changelog v0.69, local NOT pushed.

**This was the 19th and final regular faction in the Fase-4 "lo demás" order.**

### 8. Full field-by-field ODS audit (v0.94, 2026-06-20)

Went beyond the Fase-4 structural digest above to a per-unit, per-field comparison (stats, points,
min/max, weapon profiles, option groups, flags) across all 37 units + Armory/Dynasty Armory/Army
Customisation. **19 fixes** found and applied — full list in `changelog.ts` v0.94. By root cause:

1. **`has_armory_access` false on 9 vehicles** despite the `.ods` granting "Has access to vehicle
   equipment from the Armory" — Triarch Stalker, Annihilation Barge, Canoptek Doomstalker, Doomsday
   Ark, Monolith, Catacomb Command Barge, Ghost Ark, Doom Scythe, Night Scythe.
2. **Quantity-prefixed choice names breaking weapon gating** (NEW bug class this session, also found
   independently in AdMech — see `rules-model/adeptus_mechanicus.md` §8): Canoptek Spyders ("Two
   Particle beamers"), Monolith ("four Death rays") never matched their weapon's base name, so the
   weapon showed in the table unconditionally. Renamed to the exact singular weapon name.
3. **7 units missing `replaces`** on functional swap groups (Royal Warden, Triarch Stalker,
   Annihilation Barge, Lokhust Destroyers, Monolith, Catacomb Command Barge, Lychguard, Triarch
   Praetorians) — old weapon wasn't dropping on swap.
4. **Skorpekh/Ophydian Destroyers' "for every 3, one may swap" used `constraint:'one'`** (flat
   toggle) instead of `per_n:3,count_per_n:1` — the per-3 cap didn't exist at all.
5. **Canoptek Spyders' 3-option upgrade collapsed into a single `inline_pts` toggle** — 2 of 3 options
   were unselectable; restructured to `constraint:'every'` with 3 named choices.
6. **Lychguard hard-locked to min:1/max:1** — the `.ods`'s disjoint "1 or 4-10" range meant the 4-10
   squad mode was completely unavailable. Fixed to min:1/max:10 (the illegal 2-3 window is not
   blocked — see `ki-necrons-lychguard-disjoint-sizerange-01`, the `Model` type has no disjoint-range
   support).
7. Misc: Warriors' Disruptor field was 0pts instead of +1; Doomsday Ark's "High energy" profile had
   S:"D6" instead of the `.ods`'s literal "D"; Ancient Destructor Lord's `unit_type` still listed
   Infantry (it's a Monstrous Creature).

**All 3 KIs from this pass — FIXED (closed in known-issues.ts):**
- `ki-necrons-lychguard-disjoint-sizerange-01` — FIXED (2026-06-21): new `Model.squad_min` field;
  stepper now jumps 1↔4 directly.
- `ki-necrons-ctanshard-armywide-cap-unenforced-01` — FIXED (2026-06-21): `ctanShardCapBlockReason`
  greys out all C'tan Shard entries once any variant is already in the roster.
- `ki-necrons-cryptek-dynastyscion-novariant-01` — FIXED (2026-06-21): per-choice `variant_link`
  + `unique_per_army` added to `Choice` type; Dynasty Scion correctly swaps profile + armory tier. The cross-faction `ki-crossfaction-one-constraint-multimodel-replaces-noop-01`
(a `constraint:'one'` swap on a multi-model squad never reaches the `replaces` threshold, since the
toggle always stores qty=1 regardless of squad size) is now CLOSED — every concrete instance found
(Immortals, Warriors, Tomb Blades, all re-checked 2026-06-23 against `Necrons ENG.ods`'s "+N
points/model" phrasing) turned out to be the same data mistag, fixed by correcting
`constraint.type` from `"one"` to `"every"` (no engine change needed).

**Verified clean**: Armory, Dynasty Armory (two-tier Cryptek/Lord pricing), Army Customisation (4
Archetypes / 6 Legacies / all 17 Traits' 3-column pricing) — no discrepancies against the `.ods`.

Build ✓. Live-verified: Lychguard size 1-10 + War scythe swap UI; Skorpekh Destroyers per_n cap
scaling (1→2 at size 3→6); Canoptek Spyders' 3 options independently selectable. LOCAL NOT PUSHED at
time of writing.

### 9. Re-audit after .ods replacement (v1.32, 2026-07-03)

User replaced `Necrons ENG.ods`. Full field-by-field re-audit per protocol (all 37 units + Armory +
Dynasty Armory + Army Customisation). **9 fixes** found and applied:

**Engine — free-slot rules (all were present as text but had zero implementation):**
- **Royal Court (Cryptek/Royal Warden/Lord)**: Overlord (= Lord with Overlord upgrade) present →
  up to 4 Crypteks free + up to 4 Royal Wardens free + up to 4 extra Lords free (HQ slot).
  Lord present (no Overlord) → up to 2 Crypteks free + up to 2 Royal Wardens free. New
  `computeRoyalCourtFreeSlots()` in `validators.ts` wired into slotAdj[HQ]. (GH#55/56)
- **Hexmark Destroyer — Royal Assassin**: 1 free Elite slot per Lord or Skorpekh Lord. New
  `computeHexmarkDestroyerFreeSlots()` wired into slotAdj[Elites]. (GH#58)
- **Cryptothralls**: 1 free Elite slot per Cryptek. New `computeCryptothrallsFreeSlots()` wired
  into slotAdj[Elites].

**Data fixes:**
- **Plasmacyte**: `models[]` was empty (0 pts shown). Fixed to `models[15pts, min:1, max:1]`.
  Also corrected `is_character: false → true` (ODS: "A Plasmacyte is a character model").
  `default_size: 0→1`, `min_cost: 0→15`. Bogus `option_groups` entry removed (free-slot already
  in engine). (GH#54)
- **Tomb Blades**: Nebuloscope (+14 pts) and Shadowloom & shieldvanes (+22 pts) missing
  `per_model: true`. ODS: "+14 points/model" / "+22 points/model". (GH#57)
- **Armory — Illuminor**: description said "Rites of Reanimation ability" → corrected to
  "Technomancer ability" (ODS-verbatim).
- **Tesla AT(-1)** (found in previous session when .ods was replaced): Immortals, Royal Warden,
  Tomb Blades, Doom Scythe all had "Tesla, AT(-1)" — AT(-1) removed from all four. (GH#53)

**Known gap — CLOSED (ki-necrons-spyder-particle-beamer-count-display-01, fixed v1.32):**
- **Canoptek Spyders Particle beamers**: weapon choice renamed to match weapon profile name
  (weapon gating now works). The engine still shows ×1 profile even when 2 are taken — no
  per-choice count display primitive exists — but the KI is closed: the fix was the naming
  alignment, not the count label. Residual ×2 display limitation is cosmetic-only.

**32 of 37 units + Armory + Dynasty Armory + Army Customisation (4 archetypes/6 legacies/17 traits)
verified clean.** Build ✓.
