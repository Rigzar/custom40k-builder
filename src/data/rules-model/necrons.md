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
- **Psyker** (1 unit `is_psyker`): the `.ods` has "Powers of the Ctan" (the C'tan power system —
  the C'tan Shards' powers). **⚠ NOT wired into the loader — see §6.3.**

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
3. **⚠ Powers of the C'tan + Cryptek psychic not wired** (`ki-necrons-psychic-unwired-01`, KNOWN):
   the `.ods` has a "Powers of the Ctan" sheet (the C'tan Shards' power system) and Necrons have a
   psyker unit, but `loaders.ts` imports only units+general+archetypes+Dynasty armory (disciplines
   slot `{}`). Same gap class as IG/Eldar/Harlequins/GSC/Orks/Tyranids/Votann/Tau. Larger separate
   scope.
4. **Experimental Reanimation Protocols** (note, not a gap): the Index sheet lists an EXPERIMENTAL
   alternate Reanimation Protocols rule ("undergoing playtesting, completely optional"). The digest
   documents the standard rule (§4) as canonical; the experimental variant is opt-in and not part of
   the migration.
5. **Roster cross-check**: production 37 units / 8 populated slots (HQ 5/Troops 3/Elites 14/Fast
   Attack 5/Heavy Support 5/Dedicated Transport 2/Fortifications 1/Flyers 2). Uses every slot. No
   phantoms; matches the Index roster (Elites is the big slot — 4 C'tan Shards + Canoptek constructs
   + Destroyers).
